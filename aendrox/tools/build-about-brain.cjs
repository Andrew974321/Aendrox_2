// Builds the About-page brain: crops it from the supplied reference, paints out the "A",
// upscales to HD and detects the bright neuron points for the animated SVG network.
const sharp=require('sharp');const fs=require('fs');const path=require('path');
const REF=path.join(__dirname,'about-reference.webp');
const OUT=path.join(__dirname,'..','public','assets','about');
const CROP={left:540,top:70,width:520,height:334};
const SCALE=3,BG=[8,9,11];
const A_POLY=[[752,232],[790,160],[832,232]].map(([x,y])=>[x-CROP.left,y-CROP.top]); // the "A" (crop coords)
const BRAIN={cx:790-CROP.left,cy:212-CROP.top,rx:168,ry:128};                    // brain body for neuron search
const inPoly=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const segD=(px,py,[ax,ay],[bx,by])=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-ax-t*dx,py-ay-t*dy)};
const polyD=(x,y,P)=>{let d=1e9;for(let i=0,j=P.length-1;i<P.length;j=i++)d=Math.min(d,segD(x,y,P[j],P[i]));return inPoly(x,y,P)?-d:d};
const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t)};
(async()=>{
 const {data,info}=await sharp(REF).extract(CROP).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const W=info.width,H=info.height,img=Float32Array.from(data);
 // 1) remove the "A": harmonic fill from the border + fold texture borrowed from beside it
 const m=new Float32Array(W*H),unk=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const d=polyD(x+.5,y+.5,A_POLY);m[y*W+x]=1-smooth(1,4,d);if(d<4)unk.push(y*W+x)}
 const fill=Float32Array.from(img);
 for(let it=0;it<3000;it++)for(const j of unk)for(let c=0;c<3;c++){const i=j*3+c;fill[i]+=1.85*((fill[i-3]+fill[i+3]+fill[i-W*3]+fill[i+W*3])/4-fill[i])}
 const blur=await sharp(data,{raw:{width:W,height:H,channels:3}}).blur(3).raw().toBuffer();
 const SHIFT=-82; // texture donor: brain folds left of the "A"
 for(const j of unk){const x=j%W,y=(j-x)/W,k=m[j];for(let c=0;c<3;c++){const i=j*3+c,dj=(y*W+x+SHIFT)*3+c;const detail=(data[dj]-blur[dj])*.55;img[i]=img[i]*(1-k)+Math.max(0,fill[i]+detail)*k}}
 const clean=Buffer.from(img.map(v=>Math.max(0,Math.min(255,Math.round(v)))));
 // 2) HD upscale, page-matched blacks
 const up=await sharp(clean,{raw:{width:W,height:H,channels:3}}).resize(W*SCALE,H*SCALE,{kernel:'lanczos3'}).sharpen({sigma:1.1,m1:.6,m2:2.2}).raw().toBuffer();
 const LIFT=5;for(let i=0;i<up.length;i++)up[i]=Math.max(BG[i%3],Math.round((up[i]-LIFT)*255/(255-LIFT))); // drop the reference's haze to the page black
 const hd=sharp(up,{raw:{width:W*SCALE,height:H*SCALE,channels:3}});
 await hd.clone().webp({quality:92,smartSubsample:true}).toFile(path.join(OUT,'brain-hd.webp'));
 await hd.clone().png({compressionLevel:9}).toFile(path.join(OUT,'brain-hd.png'));
 // 3) neuron points: bright local maxima inside the brain body (crop coords)
 const g=(x,y)=>{const i=(y*W+x)*3;return (clean[i]+clean[i+1]+clean[i+2])/3};
 const peaks=[];
 for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){const v=g(x,y);if(v<200)continue;const e=((x-BRAIN.cx)/BRAIN.rx)**2+((y-BRAIN.cy)/BRAIN.ry)**2;if(e>1)continue;let max=true;for(let dy=-3;dy<=3&&max;dy++)for(let dx=-3;dx<=3;dx++)if(g(x+dx,y+dy)>v){max=false;break}if(max)peaks.push({x,y,v})}
 peaks.sort((a,b)=>b.v-a.v);const nodes=[];for(const p of peaks)if(nodes.every(n=>Math.hypot(n.x-p.x,n.y-p.y)>16))nodes.push(p);
 fs.writeFileSync(path.join(__dirname,'brain-peaks.json'),JSON.stringify({W,H,nodes:nodes.slice(0,40)}));
 console.log('size',W*SCALE,H*SCALE,'peaks',nodes.length);
})();
