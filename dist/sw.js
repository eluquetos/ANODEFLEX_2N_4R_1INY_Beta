const CACHE="anodeflex-2-ramas-1iny-v3";
const ASSETS=["./","index.html","styles.css?v=3","model.js?v=3","app.js?v=3","manifest.webmanifest","favicon.svg","icon-192.svg","icon-512.svg"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:"window"})).then(clients=>Promise.all(clients.map(client=>client.navigate(client.url))))));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("index.html"))))});
