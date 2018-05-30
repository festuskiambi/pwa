var cacheName = "weatherPWA-step-6-1";
var filesToCache = [];

self.addEventListener('install',function(event){
    console.log('[ServiceWorker] Install');

    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            return cache.addAll(filesToCache)
        })
    );
});