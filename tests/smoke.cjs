const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path'),fs=require('node:fs');
const qa=process.env.QA_DIR||path.join(__dirname,'artifacts');fs.mkdirSync(qa,{recursive:true});
(async()=>{
const serverless=process.env.CHROMIUM_MODULE?await import(process.env.CHROMIUM_MODULE):null; const binary=serverless?.default; const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(binary?await binary.executablePath():undefined),args:binary?binary.args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:8765');await page.waitForFunction(()=>document.querySelector('.hero'));
await page.screenshot({path:path.join(qa,'gita-home.png'),fullPage:true});
const checks=await page.evaluate(()=>({total:data.length,ref:parseReference('अध्याय २ श्लोक ४७'),english:findVerses('2.47')[0].v.verse_id,missing:findVerses('9.9').length,word:findVerses('कर्म').length,roman:findVerses('krodh').length,num:findVerses('47').length,date:dateKey(new Date('2026-10-27T18:30:00Z')),dateBefore:dateKey(new Date('2026-10-27T18:29:59Z')),repeat:new Set(dailyOrder.map(v=>v.verse_id)).size,marathiDifferent:byId.get('2.1').marathi!==byId.get('2.1').tatparya_marathi}));
assert.equal(checks.total,689);assert.equal(checks.ref,'2.47');assert.equal(checks.english,'2.47');assert.equal(checks.missing,0);assert(checks.word>0&&checks.roman>0&&checks.num>1);assert.equal(checks.date,'2026-10-28');assert.equal(checks.dateBefore,'2026-10-27');assert.equal(checks.repeat,689);assert(checks.marathiDifferent);
await page.evaluate(()=>{searchQuery='कर्म';go('search')});await page.screenshot({path:path.join(qa,'gita-search.png'),fullPage:false});assert(await page.locator('#results mark').count()>0);
await page.evaluate(()=>openVerse('2.47'));await page.screenshot({path:path.join(qa,'gita-reader.png'),fullPage:true});await page.evaluate(()=>{toggleBookmark();$('verseNote').value='A useful personal reflection';saveNote();});
await page.reload();await page.waitForFunction(()=>data.length);assert(await page.evaluate(()=>profile.bookmarks.includes('2.47')&&profile.notes['2.47']==='A useful personal reflection'));
await page.evaluate(()=>openStudio('2.47'));await page.waitForFunction(()=>cardPages.length>0);await page.screenshot({path:path.join(qa,'gita-studio.png'),fullPage:true});
const card=await page.locator('#cardCanvas').screenshot({path:path.join(qa,'gita-card.png')});
for(const lang of ['hindi','marathi','english'])for(const format of ['story','square','portrait']){
await page.evaluate(async({lang:l,format:f})=>{lang=l;studioState.format=f;studioState.translit=true;studioState.size=1.2;studioState.id=data.reduce((a,b)=>(a[l]||'').length>(b[l]||'').length?a:b).verse_id;await renderCard()},{lang,format});
assert(await page.evaluate(()=>cardPages.length>0));
const metrics=await page.evaluate(()=>{let cv=cardPages[0],ctx=cv.getContext('2d'),v=byId.get(studioState.id),pages=fitLayout(ctx,v,1080,cv.height);return {pages:pages.length,overflow:pages.some(p=>p.reduce((s,l)=>s+l.height+l.gap,0)>(cv.height===1920?820:cv.height===1350?570:420)+24),widthOverflow:pages.some(p=>p.some(l=>{font(ctx,l.size,l.kind);return ctx.measureText(l.text).width>921}))}});assert(!metrics.overflow&&!metrics.widthOverflow,JSON.stringify(metrics));}
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});for(const view of ['home','read','search','library','studio']){await page.evaluate(view=>go(view),view);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${view} overflows`);}}
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{lang='hindi';studioState.id='2.1';studioState.format='story';studioState.translit=true;studioState.size=1;go('studio')});await page.waitForFunction(()=>cardPages.length>0&&!$('cardDownload').disabled);await page.locator('#cardCanvas').screenshot({path:path.join(qa,'gita-card-final.png')});
await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>data.length);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>data.length===689);assert(await page.evaluate(()=>findVerses('2.47').length===1));await context.setOffline(false);
assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,checks,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
