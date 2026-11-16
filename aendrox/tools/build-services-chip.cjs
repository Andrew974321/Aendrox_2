// Builds the Services-page hero art: crops the AI chip scene from the supplied mockup and upscales it to HD.
const sharp=require('sharp');const path=require('path');
const REF=path.join(__dirname,'services-reference.webp');
const OUT=path.join(__dirname,'..','public','assets','services');
const CROP={left:552,top:64,width:613,height:328},SCALE=3,BG=[8,9,11];
(async()=>{
 // Erase the floating icon cards and the "AI" letters (redrawn as vectors in ai-chip-visual.tsx)
 const G=require('./services-chip-geometry.json');
 const {data}=await sharp(REF).extract(CROP).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const W=CROP.width,H=CROP.height,img=Float32Array.from(data);
 const shapes=G.cards.map(c=>{const x0=c.tl[0]-CROP.left,y0=c.tl[1]-CROP.top;return [[x0,y0],[x0+c.w,y0+c.w*c.slope],[x0+c.w,y0+c.w*c.slope+c.h],[x0,y0+c.h]]});
 const nU=Math.hypot(...G.ai.u),nV=Math.hypot(...G.ai.v),U=G.ai.u.map(v=>v/nU),V=G.ai.v.map(v=>v/nV);
 const toImg=([x,y])=>[G.ai.origin[0]-CROP.left+x*V[0]+y*U[0],G.ai.origin[1]-CROP.top+x*V[1]+y*U[1]];
 shapes.push([[-3,3],[55,3],[55,-61],[-3,-61]].map(toImg),[[53,3],[82,3],[82,-61],[53,-61]].map(toImg)); // "A" and "I" footprints
 const inPoly=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
 const segD=(px,py,[ax,ay],[bx,by])=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-ax-t*dx,py-ay-t*dy)};
 const dist=(x,y,P)=>{let d=1e9;for(let i=0,j=P.length-1;i<P.length;j=i++)d=Math.min(d,segD(x,y,P[j],P[i]));return inPoly(x,y,P)?-d:d};
 const GROW=4,unk=[],k=new Float32Array(W*H);
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){let d=1e9;for(const P of shapes)d=Math.min(d,dist(x+.5,y+.5,P));if(d<GROW+2){unk.push(y*W+x);k[y*W+x]=d<GROW?1:1-(d-GROW)/2}}
 const fill=Float32Array.from(img);
 for(let it=0;it<2500;it++)for(const j of unk)if(k[j]>=1)for(let c=0;c<3;c++){const i=j*3+c;fill[i]+=1.85*((fill[i-3]+fill[i+3]+fill[i-W*3]+fill[i+W*3])/4-fill[i])}
 for(const j of unk)for(let c=0;c<3;c++){const i=j*3+c;img[i]=img[i]*(1-k[j])+fill[i]*k[j]}
 const clean=Buffer.from(img.map(v=>Math.max(0,Math.min(255,Math.round(v)))));
 const up=await sharp(clean,{raw:{width:W,height:H,channels:3}}).resize(CROP.width*SCALE,CROP.height*SCALE,{kernel:'lanczos3'}).sharpen({sigma:1.2,m1:.7,m2:2.6}).raw().toBuffer();
 // Extra detail sharpening on the copper pin rows (feathered to the bands around the chip's front edges)
 const UW=CROP.width*SCALE,UH=CROP.height*SCALE;
 const sharp2=await sharp(up,{raw:{width:UW,height:UH,channels:3}}).sharpen({sigma:1.6,m1:1,m2:4,x1:2,y2:12,y3:25}).raw().toBuffer();
 const PIN_BANDS=[[[719,236],[842,286],[838,319],[712,263]],[[868,290],[974,234],[980,254],[872,316]]].map(P=>P.map(([x,y])=>[(x-CROP.left)*SCALE,(y-CROP.top)*SCALE]));
 const FE=12;
 for(let y=0;y<UH;y++)for(let x=0;x<UW;x++){let d=1e9;for(const P of PIN_BANDS)d=Math.min(d,dist(x+.5,y+.5,P));if(d>=FE)continue;const k=d<=0?1:1-d/FE;const i=(y*UW+x)*3;for(let c=0;c<3;c++)up[i+c]=Math.round(up[i+c]*(1-k)+sharp2[i+c]*k)}
 for(let i=0;i<up.length;i++)up[i]=Math.max(up[i],BG[i%3]);
 const out=sharp(up,{raw:{width:CROP.width*SCALE,height:CROP.height*SCALE,channels:3}});
 await out.clone().webp({quality:90,smartSubsample:true}).toFile(path.join(OUT,'ai-chip-hd.webp'));
 await out.clone().jpeg({quality:92,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile(path.join(OUT,'ai-chip-hd.jpg'));
 console.log('ai-chip-hd',CROP.width*SCALE,'x',CROP.height*SCALE);
})();
