'use strict';
// Run after local server is started: python3 -m http.server 8765
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const out=process.env.QA_DIR||path.join(__dirname,'artifacts','gita-quest');
const base=process.env.GITA_URL||'http://127.0.0.1:8765';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const page=await ctx.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/gita-quest.html');
 await page.locator('.world-card').first().waitFor();
 assert.equal(await page.locator('.world-card').count(),3);
 assert.equal(await page.locator('.lesson-pill').count(),15);
 // Original old game must be unaffected and loadable on the same origin.
 const oldGame=await ctx.newPage();await oldGame.goto(base+'/game.html');
 assert(await oldGame.locator('#gameCanvas').count()===1,'Original game.html is still present');
 await oldGame.close();
 const original=await page.request.get(base+'/data/gita-v2.json');
 assert.equal(original.status(),200);
 const collection=await original.json();
 const refs=['2.47','2.48','3.19','3.21','2.14','6.5','6.26','12.13','16.2','17.15','9.22','12.14','4.7','18.66','18.78'];
 const keys=new Set(collection.map(x=>x.verse_id));
 assert.deepEqual(refs.filter(x=>!keys.has(x)),[],'Some quest references were not in the current dataset');
 for(const width of [280,320,360,390,430,599,600,768,800,1024,1360,1440,1920]){
   const height=width>=1024?900:width>=600?950:780;
   await page.setViewportSize({width,height});
   await page.goto(base+'/gita-quest.html');
   await page.locator('.lesson-pill').first().waitFor();
   for(const view of ['home','level']){
     if(view==='level')await page.locator('[data-level="0"]').first().click();
     const metrics=await page.evaluate(()=>({
       w:innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth,
       contentRight:document.querySelector('main').getBoundingClientRect().right,
       answers:document.querySelectorAll('.answer').length
     }));
     assert(metrics.html<=width+1&&metrics.body<=width+1&&metrics.contentRight<=width+1,'Overflow at '+width+' '+view+': '+JSON.stringify(metrics));
     if(view==='level')assert.equal(metrics.answers,3);
     if([320,390,768,1440,1920].includes(width)){
       await page.screenshot({path:path.join(out,width+'-'+view+'.png'),fullPage:view==='home'});
     }
   }
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/gita-quest.html');
 // First level: wrong answer, retry, then correct answer shows original Gita text.
 await page.locator('[data-level="0"]').first().click();
 await page.locator('[data-choice="0"]').click();
 assert.equal(await page.locator('.feedback').count(),1);
 await page.locator('#retry').click();
 await page.locator('[data-choice="2"]').click();
 assert.equal(await page.locator('.feedback.success').count(),1);
 assert.equal(await page.locator('.scripture').count(),1);
 assert((await page.locator('.scripture').innerText()).includes('कर्मण्येवाधिकारस्ते'));
 // Complete all other levels with the published answer key.
 const answers=[2,1,0,2,null,1,0,2,1,null,1,0,2,1,null];
 for(let index=1;index<15;index++){
   await page.locator('#next-level').click();
   if(answers[index]===null){
     for(const k of [0,1,2])await page.locator('[data-pick="'+k+'"]').click();
     await page.locator('#check-order').click();
   }else await page.locator('[data-choice="'+answers[index]+'"]').click();
   assert.equal(await page.locator('.feedback.success').count(),1,'Level '+(index+1)+' failed');
 }
 await page.locator('#next-level').click();
 assert((await page.locator('.hero-counter').innerText()).includes('15 / 15'));
 await page.reload();
 assert((await page.locator('.hero-counter').innerText()).includes('15 / 15'));
 await page.locator('#lang').selectOption('marathi');
 assert((await page.locator('.hero h1').innerText()).includes('खेळता'));
 await page.locator('#lang').selectOption('english');
 assert((await page.locator('.hero h1').innerText()).includes('Learn the Gita'));
 await page.locator('#lang').selectOption('hindi');
 assert((await page.locator('.hero h1').innerText()).includes('खेलते'));
 // User chooses to resume a completed challenge: no lockouts.
 await page.locator('[data-level="0"]').first().click();
 assert.equal(await page.locator('.answer').count(),3);
 await page.reload();
 assert.equal(await page.locator('.answer').count(),3,'Deep link was not restored');
 assert.deepEqual(errors,[],'Uncaught errors: '+errors.join('; '));
 console.log(JSON.stringify({passed:true,game:'Gita Quest',levels:15,worlds:3,languages:3,widths:13,sourceVerseChecks:refs.length,errors:errors.length},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
