const CACHE_NAME = 'islamic-portal-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  // Core app shell files will be auto-cached by Vite
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/data/quran-surahs.json',
  '/data/quran-translations.json',
  '/data/prayer-times.json',
  '/data/hadith-collections.json',
  '/data/duas-adhkar.json',
  '/data/quran-reciters.json'
];

// Audio files to cache (sample URLs - in production these would be real CDN URLs)
const AUDIO_CACHE_URLS = [
  // Add actual Quran recitation URLs here when available
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Open cache and add static assets
        const cache = await caches.open(CACHE_NAME);
        console.log('[ServiceWorker] Caching static assets');
        await cache.addAll(STATIC_CACHE_URLS);
        
        // Cache API data
        console.log('[ServiceWorker] Caching API data');
        for (const url of API_CACHE_URLS) {
          try {
            await cache.add(url);
          } catch (error) {
            console.warn(`[ServiceWorker] Failed to cache ${url}:`, error);
          }
        }
        
        console.log('[ServiceWorker] Install complete');
      } catch (error) {
        console.error('[ServiceWorker] Install failed:', error);
      }
    })()
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.startsWith('islamic-portal-') && name !== CACHE_NAME
      );
      
      await Promise.all(
        oldCaches.map(name => {
          console.log(`[ServiceWorker] Deleting old cache: ${name}`);
          return caches.delete(name);
        })
      );
      
      // Claim all clients
      await self.clients.claim();
      console.log('[ServiceWorker] Activate complete');
    })()
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Don't cache Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Don't cache browser sync requests
  if (event.request.url.includes('browser-sync')) return;
  
  event.respondWith(
    (async () => {
      try {
        // Try to get the resource from cache first (Cache First Strategy for static assets)
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
          // For HTML pages, also try to fetch from network in background to update cache
          if (event.request.destination === 'document') {
            fetch(event.request)
              .then(response => {
                if (response.status === 200) {
                  const cache = caches.open(CACHE_NAME);
                  cache.then(c => c.put(event.request, response.clone()));
                }
              })
              .catch(() => {}); // Ignore network errors in background
          }
          
          return cachedResponse;
        }
        
        // Try to fetch from network
        const networkResponse = await fetch(event.request);
        
        // If successful, cache the response for future use
        if (networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          
          // Cache API data and static assets
          if (
            event.request.url.includes('/data/') ||
            event.request.destination === 'document' ||
            event.request.destination === 'script' ||
            event.request.destination === 'style' ||
            event.request.destination === 'image'
          ) {
            await cache.put(event.request, networkResponse.clone());
          }
        }
        
        return networkResponse;
        
      } catch (error) {
        console.log('[ServiceWorker] Fetch failed, serving cached content or offline page:', error);
        
        // If request is for a page, return offline page
        if (event.request.destination === 'document') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          return offlineResponse || new Response('الموقع غير متاح حالياً، يرجى المحاولة لاحقاً', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }
        
        // For other resources, try to return a cached version
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Return a generic offline response for other failed requests
        return new Response('المحتوى غير متاح بدون اتصال بالإنترنت', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })()
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('[ServiceWorker] Performing background sync...');
  
  try {
    // Get pending actions from IndexedDB or localStorage
    const pendingActions = JSON.parse(
      (await getFromStorage('pendingActions')) || '[]'
    );
    
    for (const action of pendingActions) {
      try {
        // Process each pending action
        await processPendingAction(action);
      } catch (error) {
        console.error('[ServiceWorker] Failed to process action:', error);
      }
    }
    
    // Clear processed actions
    await setInStorage('pendingActions', '[]');
    console.log('[ServiceWorker] Background sync completed');
    
  } catch (error) {
    console.error('[ServiceWorker] Background sync failed:', error);
  }
}

async function processPendingAction(action) {
  switch (action.type) {
    case 'save-bookmark':
      // Handle saving bookmarks when back online
      console.log('[ServiceWorker] Processing bookmark save:', action.data);
      break;
    case 'update-progress':
      // Handle updating reading progress when back online
      console.log('[ServiceWorker] Processing progress update:', action.data);
      break;
    default:
      console.warn('[ServiceWorker] Unknown action type:', action.type);
  }
}

// Utility functions for storage access
async function getFromStorage(key) {
  return new Promise((resolve) => {
    // In a real implementation, you might use IndexedDB
    // For now, we'll simulate with a simple approach
    resolve(null);
  });
}

async function setInStorage(key, value) {
  return new Promise((resolve) => {
    // In a real implementation, you might use IndexedDB
    resolve();
  });
}

// Handle push notifications (if implemented)
self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push received');
  
  const options = {
    body: 'حان وقت الصلاة - البوابة الإسلامية',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'prayer-reminder',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'عرض مواقيت الصلاة',
        icon: '/icons/prayer-shortcut.png'
      },
      {
        action: 'dismiss',
        title: 'إغلاق'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('تذكير الصلاة', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/?page=prayer-times')
    );
  }
});

// Handle periodic background sync (for prayer time updates)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'prayer-times-update') {
    event.waitUntil(updatePrayerTimes());
  }
});

async function updatePrayerTimes() {
  console.log('[ServiceWorker] Updating prayer times...');
  
  try {
    // Fetch updated prayer times
    const response = await fetch('/data/prayer-times.json');
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/data/prayer-times.json', response);
      console.log('[ServiceWorker] Prayer times updated');
    }
  } catch (error) {
    console.error('[ServiceWorker] Failed to update prayer times:', error);
  }
}

console.log('[ServiceWorker] Service Worker script loaded');