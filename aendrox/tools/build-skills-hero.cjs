// Builds the Skills hero art: crops the android head from the supplied mockup and upscales it to HD.
const sharp=require('sharp');const path=require('path');
const REF=path.join(__dirname,'skills-reference.webp'),OUT=path.join(__dirname,'..','public','assets','skills');
const CROP={left:590,top:70,width:664,height:356},SCALE=3,BG=[8,9,11];
(async()=>{
 const up=await sharp(REF).extract(CROP).removeAlpha().resize(CROP.width*SCALE,CROP.height*SCALE,{kernel:'lanczos3'}).sharpen({sigma:1.3,m1:.8,m2:3}).raw().toBuffer();
 for(let i=0;i<up.length;i++)up[i]=Math.max(up[i],BG[i%3]);
 const out=sharp(up,{raw:{width:CROP.width*SCALE,height:CROP.height*SCALE,channels:3}});
 await out.clone().webp({quality:90,smartSubsample:true}).toFile(path.join(OUT,'android-head-hd.webp'));
 await out.clone().jpeg({quality:92,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile(path.join(OUT,'android-head-hd.jpg'));
 console.log('android-head-hd',CROP.width*SCALE,'x',CROP.height*SCALE);
})();
