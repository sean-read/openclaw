// OpenClaw Control – Service Worker (self-unregistering)
// Caching is intentionally disabled. On install/activate the worker
// purges every cache and unregisters itself, so subsequent page
// loads have NO service worker controlling them and content always
// comes fresh from the gateway. This is the safest mode while the
// UI is under active redesign.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (_e) {
        /* ignore */
      }
      try {
        await self.clients.claim();
      } catch (_e) {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch (_e) {
        /* ignore */
      }
    })(),
  );
});

// No fetch handler. Every request goes to the network.

// --- Web Push (kept so notification subscriptions still work) ---

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "OpenClaw", body: event.data.text() };
  }

  const title = data.title || "OpenClaw";
  const options = {
    body: data.body || "",
    icon: "./apple-touch-icon.png",
    badge: "./favicon-32.png",
    tag: data.tag || "openclaw-notification",
    data: { url: data.url || "./" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "./";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (new URL(client.url).pathname === new URL(targetUrl, self.location.origin).pathname) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
