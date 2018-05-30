var cacheName = "weatherPWA-step-6-2";
var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];
var dataCacheName = "weatherData-v1";
//
self.addEventListener('install',function(event){
    console.log('[ServiceWorker] Install');

    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            return cache.addAll(filesToCache)
        })
    );
});

self.addEventListener('activate',function(event){
    event.waitUntil(
        caches.keys().then(function(keyList) {
          return Promise.all(keyList.map(function(key) {
            if (key !== cacheName && key !==dataCacheName) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch',function(event){
    console.log('[Service Worker] Fetch', e.request.url);
    var dataUrl ='https://query.yahooapis.com/v1/public/yql';

    if(event.request.indexOf(dataUrl) > -1){
     event.respondWith(
        caches.open(dataCacheName).then(function(cache){
            return fetch(event.request).then(function(response){
                cache.put(event.request.url, response.clone());
                return response;
            });
        })
     );   

    }else{

        event.respondWith(
            caches.match(event.request).then(function(response){
                return response || fetch(event.request);
            })
        );
    }
});