/* Offline web shell. Native Android network handling is configured separately. */
const VERSION='gita-v13-2',CORE=VERSION+'-core',RUNTIME=VERSION+'-runtime';
const FILES=['./','index.html','data/gita-v2.json','assets/fonts/inter.ttf','assets/fonts/devanagari.ttf','logo.png','manifest.webmanifest','assets/art/chariot.webp','assets/sacred-editorial.css'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CORE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gita-v')&&!k.startsWith(VERSION)&&k!=='gita-v12-art').map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return;
if(req.mode==='navigate'){event.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(RUNTIME).then(c=>c.put(req,copy))}return r}).catch(async()=>await caches.match(req)||await caches.match('index.html')));return;}
event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(r=>{if(r.ok&&(/\/assets\//.test(url.pathname)||/\/data\//.test(url.pathname))){const copy=r.clone();caches.open(RUNTIME).then(c=>c.put(req,copy))}return r})));});
