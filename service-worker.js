"use strict";

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = "static-cache-v3";
const DATA_CACHE_NAME = "data-cache-v3";

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/lectures.html",
  "/lectures_recap.html",
  "/prieres.html",
  "/scripts/app.js",
  "/scripts/install.js",
  "/scripts/lectures/lectures_data.js",
  "/scripts/lectures/lectures.js",
  "/scripts/lectures/lecture_recap.js",
  "/scripts/prieres/prayers_data.js",
  "/scripts/prieres/prayers.js",
  "/styles/style.css",
  "/styles/my-theme.css",
  "/styles/icomoon.woff",
  "/manifest.json",
  "/images/icon.png",
];

self.addEventListener("install", (evt) => {
  console.log("[ServiceWorker] Install");
  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  console.log("[ServiceWorker] Activate");
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  //console.log("[ServiceWorker] Fetch", evt.request.url);
  // CODELAB: Add fetch event handler here.
  if (
    evt.request.url.includes("/get_evangile") ||
    evt.request.url.includes("/get_saint")
  ) {
    //console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
          .then((response) => {
            //console.log(response);
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
              //console.log(evt.request.url);
            }
            return response;
          })
          .catch((err) => {
            return cache.match(evt.request);
          });
      })
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request).then((response) => {
        return response || fetch(evt.request);
      });
    })
  );
});

let notif_data = "";

self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data 2: "${event.data.text()}"`);

  const title = "Quotidie";
  const options = {
    body: event.data.text(),
    icon: "images/icon.png",
    badge: "images/badge.svg",
  };

  notif_data = event.data.text();
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click received.");

  event.notification.close();
  if (notif_data === "Votre attestation a ??t?? g??n??r??e.") {
    event.waitUntil(clients.openWindow("http://cuke.duckdns.org/get_attestation"));
  } else {
    event.waitUntil(clients.openWindow("https://quotidie.netlify.app"));
  }

});
