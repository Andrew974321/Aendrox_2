// Builds the Contact-page artwork from the supplied mockup: the gear hero (floating cards removed,
// redrawn as vectors in contact-visuals.tsx) and the robot (chat window removed, rebuilt in HTML). HD = 3x.
const sharp=require('sharp');const path=require('path');
const G=require('./contact-art-geometry.json');
const REF=path.join(__dirname,'contact-reference.webp'),OUT=path.join(__dirname,'..','public','assets','contact');
const SCALE=3,BG=[8,9,11];
const inPoly=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const segD=(px,py,[ax,ay],[bx,by])=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-ax-t*dx,py-ay-t*dy)};
const dist=(x,y,P)=>{let d=1e9;for(let i=0,j=P.length-1;i<P.length;j=i++)d=Math.min(d,segD(x,y,P[j],P[i]));return inPoly(x,y,P)?-d:d};
async function build(name,{crop,erase},grow){
 const {data}=await sharp(REF).extract(crop).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const W=crop.width,H=crop.height,img=Float32Array.from(data);
 const shapes=erase.map(P=>P.map(([x,y])=>[x-crop.left,y-crop.top]));
 const unk=[],k=new Float32Array(W*H);
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){let d=1e9;for(const P of shapes)d=Math.min(d,dist(x+.5,y+.5,P));if(d<grow+5){unk.push(y*W+x);k[y*W+x]=d<grow?1:1-(d-grow)/5}}
 const fill=Float32Array.from(img.map(v=>Math.min(v,40)));
 for(let it=0;it<2500;it++)for(const j of unk)if(k[j]>=1)for(let c=0;c<3;c++){const i=j*3+c;fill[i]+=1.85*((fill[i-3]+fill[i+3]+fill[i-W*3]+fill[i+W*3])/4-fill[i])}
 for(const j of unk)for(let c=0;c<3;c++){const i=j*3+c;img[i]=img[i]*(1-k[j])+fill[i]*k[j]}
 const clean=Buffer.from(img.map(v=>Math.max(0,Math.min(255,Math.round(v)))));
 const up=await sharp(clean,{raw:{width:W,height:H,channels:3}}).resize(W*SCALE,H*SCALE,{kernel:'lanczos3'}).sharpen({sigma:1.3,m1:.8,m2:3}).raw().toBuffer();
 for(let i=0;i<up.length;i++)up[i]=Math.max(up[i],BG[i%3]);
 const out=sharp(up,{raw:{width:W*SCALE,height:H*SCALE,channels:3}});
 await out.clone().webp({quality:90,smartSubsample:true}).toFile(path.join(OUT,name+'-hd.webp'));
 await out.clone().jpeg({quality:92,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile(path.join(OUT,name+'-hd.jpg'));
 console.log(name+'-hd',W*SCALE,'x',H*SCALE);
}
(async()=>{await build('gear',G.hero,4);await build('robot',G.robot,3)})();
