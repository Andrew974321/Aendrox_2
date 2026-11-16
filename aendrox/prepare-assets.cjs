const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
(async()=>{
 const out=path.join(__dirname,'public','assets');
 await Promise.all(['emblem','exploded'].map(name=>sharp(path.join(out,name+'.png')).resize({width:1600}).webp({quality:86}).toFile(path.join(out,name+'.webp'))));
 await sharp(path.join(out,'wordmark.png')).extract({left:132,top:190,width:1590,height:465}).resize(600).webp({quality:90}).toFile(path.join(out,'wordmark.webp'));
 fs.mkdirSync(path.join(out,'frames'),{recursive:true});
 const source='D:/Aendrox Video/AENDROX_logo_assembly_and_rotation_4beddf5a_1080p-frames';
 for(let i=0;i<48;i++){
  const index=Math.round(i*189/47)+1;
  await sharp(path.join(source,`frame-${String(index).padStart(4,'0')}.png`)).resize(1280,720,{fit:'contain',background:'#000000'}).webp({quality:75}).toFile(path.join(out,'frames',`${String(i).padStart(3,'0')}.webp`));
 }
 console.log('Optimized 3 images and 48 animation frames.');
})();
