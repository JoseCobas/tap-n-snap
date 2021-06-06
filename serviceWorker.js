importScripts('/src/utilities/idb-min.js');
importScripts('/src/utilities/IDB.js');

const cacheName = 'v1'

// Files to cache:
const cacheAssets = [
  'index.html',
  '/src/App.jsx'
]

// Call Install Event
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed')

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files')
        cache.addAll(cacheAssets)
      })
      .then(() => self.skipWaiting())
  )

})

// Call Activate Event
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated')
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache != cacheName) {
            console.log('Service Worker: Clearing Old Cache')
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

// Call fetch event
self.addEventListener('fetch', e => {
  if (!(e.request.url.indexOf('http') === 0)) return;

  console.log('Service Worker: Fetching')
  e.respondWith(
    fetch(e.request)
    .then(res => {
      // Make copy/clone of response
      const resClone = res.clone();
      // Open cache
      caches
        .open(cacheName)
        .then(cache => {
          // Add response to cache
          cache.put(e.request, resClone)
        })
      return res
    })
    .catch(err => caches.match(e.request).then(res => res))

  )
})

// 'sync' triggers when the service worker has
// access to the network
self.addEventListener('sync', evt => {
  if(evt.tag === 'sync-new-messages') {
    evt.waitUntil(onBackgroundSync());
  }
});

async function onBackgroundSync() {
  // get saved messages
  let posts = await IDB.getAll('sync-messages');

  // loop messages and send to server
  for (let post of posts) {
    let res = await fetch('http://localhost:4000/posts', {
      method: "post",
      headers: { 'Accept': 'application/json',
      'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });

    // when a message has been posted successfully 
    // we remove that message from indexedDB
    // so we don't resend it every time we go online
    res.ok && await IDB.remove('sync-messages', post.uuid);
  }
}
