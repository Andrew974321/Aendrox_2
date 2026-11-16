// Builds the services android artwork layers: page-matched base, rotating gear, and static mask.
const sharp=require('sharp');const path=require('path');
const A=path.join(__dirname,'..','public','assets');
const SRC=path.join(A,'services-android-hd.png');
const BG=[8,9,11];
const C={x:1538,y:807};           // gear rotation centre (full image px)
const SIZE=560,O={x:C.x-SIZE/2,y:C.y-SIZE/2};
const R_OUT=262;                    // tooth-tip radius
const EMB={x:1150+393,y:420+390,r:123}; // static A emblem disc
const PITCH=24;                     // 15 teeth
// thumb + wrist in front of the gear (full image px)
const HAND=[[436,566],[434,586],[420,594],[400,602],[375,611],[350,620],[330,628],[315,636],[300,644],[288,654],[250,690],[180,720],[180,600],[250,628],[265,618],[300,602],[330,585],[355,572],[372,566],[395,555],[420,551],[430,553]].map(([x,y])=>[x+1150,y+420]);
const inPoly=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const segDist=(px,py,[ax,ay],[bx,by])=>{const dx=bx-ax,dy=by-ay;const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-ax-t*dx,py-ay-t*dy)};
const polyDist=(x,y,P)=>{let d=1e9;for(let i=0,j=P.length-1;i<P.length;j=i++)d=Math.min(d,segDist(x,y,P[j],P[i]));return inPoly(x,y,P)?-d:d};
const smooth=(e0,e1,v)=>{const t=Math.max(0,Math.min(1,(v-e0)/(e1-e0)));return t*t*(3-2*t)};
(async()=>{
 // 0) replace the generated "A" marks (gear centre + head) with the site's own emblem medallion (emblem.png)
 const MED={x:909.5,y:433,ring:323};               // medallion in emblem.png
 const medallion=async(ringR,cropRing)=>{const scale=ringR/MED.ring,cr=Math.round(cropRing*scale),side=cr*2+2;
  const raw=await sharp(path.join(A,'emblem.png')).extract({left:Math.round(MED.x-cropRing),top:Math.round(MED.y-cropRing),width:cropRing*2,height:cropRing*2}).resize(side,side,{kernel:'lanczos3'}).removeAlpha().raw().toBuffer();
  const out=Buffer.alloc(side*side*4);
  for(let y=0;y<side;y++)for(let x=0;x<side;x++){const i=y*side+x,r=Math.hypot(x+.5-side/2,y+.5-side/2);out[i*4]=raw[i*3];out[i*4+1]=raw[i*3+1];out[i*4+2]=raw[i*3+2];out[i*4+3]=Math.round(255*(1-smooth(cr-2.5,cr,r)))}
  return {input:await sharp(out,{raw:{width:side,height:side,channels:4}}).png().toBuffer(),side};};
 const HEAD={x:925,y:351,r:94};                     // head emblem ring
 const gearLogo=await medallion(119,330),headLogo=await medallion(HEAD.r,327);
 const withLogo=await sharp(SRC).removeAlpha().composite([
  {input:gearLogo.input,left:Math.round(EMB.x-gearLogo.side/2),top:Math.round(EMB.y-gearLogo.side/2)},
  {input:headLogo.input,left:Math.round(HEAD.x-headLogo.side/2),top:Math.round(HEAD.y-headLogo.side/2)}]).png().toBuffer();
 const {data,info}=await sharp(withLogo).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const W=info.width,H=info.height;
 // 1) page-matched base: never darker than the section background.
 //    The four service labels/tiles are erased here and redrawn as vector SVG + live text in the page.
 const ERASE=[[270,145,660,280],[270,280,600,545],[270,965,595,1400],[1795,140,2150,275],[1830,275,2150,545],[1810,970,2140,1400]];
 const F=16,SIG=45;
 const M=new Float32Array(W*H),hard=Buffer.alloc(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let k=0,h=0;for(const[x0,y0,x1,y1]of ERASE){const d=Math.hypot(Math.max(x0-x,0,x-x1),Math.max(y0-y,0,y-y1));if(d<F)k=Math.max(k,1-smooth(0,F,d));if(d<F+6)h=1}M[y*W+x]=k;hard[y*W+x]=h?0:255}
 // background estimate: harmonic (Laplace) fill from each box's own border at quarter-res; bright features clamped
 const D=4,w4=Math.ceil(W/D),h4=Math.ceil(H/D),CLAMP=26;
 const known=new Uint8Array(w4*h4),fld=[0,1,2].map(()=>new Float32Array(w4*h4));
 {const sum=[0,1,2].map(()=>new Float32Array(w4*h4)),n=new Float32Array(w4*h4),bad=new Uint8Array(w4*h4);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const j=Math.floor(y/D)*w4+Math.floor(x/D),i=y*W+x;if(!hard[i])bad[j]=1;n[j]++;for(let c=0;c<3;c++)sum[c][j]+=Math.min(data[i*3+c],CLAMP)}
  for(let j=0;j<w4*h4;j++){known[j]=bad[j]?0:1;for(let c=0;c<3;c++)fld[c][j]=bad[j]?BG[c]:sum[c][j]/n[j]}}
 const unk=[];for(let j=0;j<w4*h4;j++)if(!known[j])unk.push(j);
 for(let it=0;it<1500;it++)for(const j of unk){const x=j%w4,y=(j-x)/w4;for(let c=0;c<3;c++){const f=fld[c];f[j]+=1.9*((f[j-1]+f[j+1]+f[j-w4]+f[j+w4])/4-f[j])}}
 const est=(x,y,c)=>{const fx=Math.min(w4-1.001,Math.max(0,x/D-.5)),fy=Math.min(h4-1.001,Math.max(0,y/D-.5)),x0=Math.floor(fx),y0=Math.floor(fy),ax=fx-x0,ay=fy-y0,a=fld[c];
  return a[y0*w4+x0]*(1-ax)*(1-ay)+a[y0*w4+x0+1]*ax*(1-ay)+a[(y0+1)*w4+x0]*(1-ax)*ay+a[(y0+1)*w4+x0+1]*ax*ay};
 const base=Buffer.from(data);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,k=M[i];for(let c=0;c<3;c++){const v=Math.max(base[i*3+c],BG[c]);base[i*3+c]=k>0?Math.round(v*(1-k)+Math.max(est(x,y,c),BG[c])*k):v}}
 await sharp(base,{raw:{width:W,height:H,channels:3}}).webp({quality:93,smartSubsample:true}).toFile(path.join(A,'services-android-base.webp'));
 await sharp(base,{raw:{width:W,height:H,channels:3}}).png({compressionLevel:9}).toFile(path.join(A,'services-android-base.png'));
 const px=(x,y,c)=>{const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,i=(yy,xx)=>base[(yy*W+xx)*3+c];return i(y0,x0)*(1-fx)*(1-fy)+i(y0,x0+1)*fx*(1-fy)+i(y0+1,x0)*(1-fx)*fy+i(y0+1,x0+1)*fx*fy};
 // 2) rotating gear: thumb painted out with the same gear rotated by 3 teeth
 const gear=Buffer.alloc(SIZE*SIZE*4),mask=Buffer.alloc(SIZE*SIZE*4);
 const rot=3*PITCH*Math.PI/180,cs=Math.cos(-rot),sn=Math.sin(-rot);
 for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
  const X=O.x+x+.5,Y=O.y+y+.5,dx=X-C.x,dy=Y-C.y,r=Math.hypot(dx,dy),o=(y*SIZE+x)*4;
  const hd=polyDist(X,Y,HAND);
  const fill=1-smooth(-2,10,hd);   // dilated: replace thumb + halo in the rotating source
  const sx=C.x+dx*cs-dy*sn,sy=C.y+dx*sn+dy*cs;
  for(let c=0;c<3;c++)gear[o+c]=Math.round(px(X-.5,Y-.5,c)*(1-fill)+px(sx-.5,sy-.5,c)*fill);
  gear[o+3]=Math.round(255*(1-smooth(R_OUT-1.5,R_OUT+1.5,r)));
  // static mask: hide the rotating layer over the emblem and the hand
  const er=Math.hypot(X-EMB.x,Y-EMB.y);
  const show=smooth(EMB.r-2,EMB.r+2,er)*smooth(-1.5,1.5,hd);
  mask[o]=mask[o+1]=mask[o+2]=255;mask[o+3]=Math.round(255*show);
 }
 await sharp(gear,{raw:{width:SIZE,height:SIZE,channels:4}}).png({compressionLevel:9}).toFile(path.join(A,'services-android-gear.png'));
 await sharp(mask,{raw:{width:SIZE,height:SIZE,channels:4}}).png({compressionLevel:9}).toFile(path.join(A,'services-android-gear-mask.png'));
 console.log(JSON.stringify({left:O.x/W*100,top:O.y/H*100,width:SIZE/W*100,height:SIZE/H*100}));
})();
