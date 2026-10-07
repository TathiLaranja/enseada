/* Enseada - liga o service worker, que é o que faz o app funcionar sem internet.
   Se o navegador não tiver, o app continua funcionando com internet. */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").catch(function () {
      /* Sem service worker o app ainda abre. Nada a avisar para a pessoa. */
    });
  });
}
