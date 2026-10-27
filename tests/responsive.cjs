/* Responsive visual and functional regression QA for Bhagavad Gita.
   Start the local HTTP server first: python3 -m http.server 8765
   npm i --no-save playwright && npx playwright install chromium
   node tests/responsive.cjs
*/
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.GITA_URL||'http://127.0.0.1:8765';
const widths=[280,320,360,390,430,599,600,768,800,1024,1100,1280,1440,1920];
const screens=['home','read','search','library','studio'];
const qa=process.env.QA_DIR||path.join(__dirname,'artifacts','responsive');
fs.mkdirSync(qa,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:840},deviceScaleFactor:1});
 const page=await context.newPage();
 const pageErrors=[];
 page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof data!=='undefined' && data.length>0,{timeout:60000});
 const problems=[];
 const results=[];
 for(const width of widths){
   const height=width>=1100?900:width>=600?1024:780;
   await page.setViewportSize({width,height});
   for(const screen of screens){
     await page.evaluate(s=>go(s),screen);
     if(screen==='studio')await page.waitForFunction(()=>document.querySelector('.studio-actions'));
     const measure=await page.evaluate(()=>{
       const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,top:r.top,bottom:r.bottom,height:r.height}};
       const $=selector=>document.querySelector(selector);
       const nav=$('.nav'),main=$('main'),header=$('.appbar');
       const actions=$('.studio-actions'),canvas=$('#cardCanvas');
       return {
         viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
         bodyWidth:document.body.scrollWidth,
         header:rect(header),nav:rect(nav),main:rect(main),
         navFlow:getComputedStyle(nav).flexDirection,
         actionPosition:actions?getComputedStyle(actions).position:null,
         actions:actions?rect(actions):null,
         preview:canvas?rect(canvas):null,
         canvasFrame:canvas?rect(canvas.parentElement):null,
         bodyBg:getComputedStyle(document.body).backgroundColor
       };
     });
     results.push({width,screen,scrollWidth:measure.scrollWidth,nav:measure.navFlow});
     if(measure.scrollWidth>width+1||measure.bodyWidth>width+1)problems.push({width,screen,issue:'horizontal overflow',measure});
     if(measure.main.left<0||measure.main.right>width+2)problems.push({width,screen,issue:'main outside viewport',measure});
     if(width>=1100){
       if(measure.navFlow!=='column')problems.push({width,screen,issue:'desktop navigation is not a sidebar',measure});
       if(measure.main.left<220)problems.push({width,screen,issue:'desktop main overlaps sidebar',measure});
       if(measure.nav.right>measure.main.left+1)problems.push({width,screen,issue:'desktop nav and main overlap',measure});
     }else{
       if(measure.navFlow!=='row')problems.push({width,screen,issue:'mobile/tablet nav is not horizontal',measure});
     }
     if(screen==='studio'){
       if(measure.actionPosition!=='static')problems.push({width,screen,issue:'share controls overlay editing options',measure});
       if(measure.preview && measure.canvasFrame && measure.preview.width>measure.canvasFrame.width+1)problems.push({width,screen,issue:'canvas wider than preview',measure});
       if(measure.preview && width<600 && measure.preview.height>Math.min(height*.42,410)+2 && width>=360)problems.push({width,screen,issue:'phone preview excessively tall',measure});
     }
     if([320,390,768,1440,1920].includes(width)&&['home','studio','read'].includes(screen)){
       if(screen==='read'){
         await page.evaluate(()=>openVerse('2.47'));
       }
       await page.screenshot({path:path.join(qa,width+'-'+screen+'.png'),fullPage:screen==='home'});
     }
   }
 }
 // Night mode should be remembered when moving between screens.
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{openVerse('2.47');if(!document.body.classList.contains('dark'))toggleReadingNight()});
 assert.equal(await page.evaluate(()=>document.body.classList.contains('dark')),true);
 await page.evaluate(()=>go('home'));
 assert.equal(await page.evaluate(()=>document.body.classList.contains('dark')),true);
 await page.evaluate(()=>{go('studio');studioState.id='2.47'});
 await page.waitForFunction(()=>cardPages.length>0,{timeout:30000});
 const pixelFooter=await page.evaluate(()=>{
   const cv=cardPages[0],c=cv.getContext('2d');
   const p=c.getImageData(1,cv.height-40,1,1).data;
   return {width:cv.width,height:cv.height,hasCard:!!cv,footerPixel:[...p]};
 });
 assert.equal(pixelFooter.width,1080);
 assert(pixelFooter.height>0);
 assert(!pageErrors.length,'Uncaught JavaScript errors: '+pageErrors.join(' | '));
 if(problems.length)throw Error(JSON.stringify({count:problems.length,samples:problems.slice(0,12)},null,2));
 console.log(JSON.stringify({passed:true,viewportWidths:widths,checkedScreens:screens,checks:results.length,nightMode:true,exportCard:true,jsErrors:0},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
