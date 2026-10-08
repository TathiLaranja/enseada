/* Enseada - service worker.
   Cache PRIMEIRO: a rede só é procurada para arquivo que não está no cache.
   O app não tem servidor, então procurar a rede a cada toque seria gasto à toa
   e deixaria o app lento justo no momento ruim.

   Não existe bloco de push nem de notificação aqui: web push depende de
   servidor com chave, e o Enseada não tem servidor.

   Trocar VERSAO a cada publicação faz o aparelho buscar os arquivos novos. */

var VERSAO = "enseada-v11";

var ARQUIVOS = [
  "./",
  "index.html",
  "ancoras.html",
  "achar.html",
  "ajuda.html",
  "escrever.html",
  "desenhar.html",
  "jogos.html",
  "rede.html",
  "manifest.json",
  "css/tema.css",
  "css/base.css",
  "js/ancoras.js",
  "js/armazenamento.js",
  "js/ajustes.js",
  "js/menu.js",
  "js/rede.js",
  "js/memoria.js",
  "js/sudoku.js",
  "js/tetris.js",
  "js/cruzadas.js",
  "js/tela-escrever.js",
  "js/paleta.js",
  "js/tela-desenhar.js",
  "js/tela-jogos.js",
  "js/tela-sudoku.js",
  "js/tela-tetris.js",
  "js/tela-cruzadas.js",
  "js/tela-rede.js",
  "js/agora.js",
  "js/tela-ancoras.js",
  "js/perguntas.js",
  "js/roteiro.js",
  "js/tela-achar.js",
  "js/tela-ajuda.js",
  "js/registra-sw.js",
  "fontes/AtkinsonHyperlegible-Regular.woff2",
  "fontes/AtkinsonHyperlegible-Bold.woff2",
  "icones/icone-192.png",
  "icones/icone-512.png",
  "icones/icone-192-mascara.png",
  "icones/icone-512-mascara.png"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(VERSAO).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.map(function (nome) {
        if (nome !== VERSAO) { return caches.delete(nome); }
        return null;
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (evento) {
  var pedido = evento.request;

  if (pedido.method !== "GET") { return; }
  if (new URL(pedido.url).origin !== self.location.origin) { return; }

  evento.respondWith(
    caches.match(pedido).then(function (guardado) {
      if (guardado) { return guardado; }

      return fetch(pedido).then(function (resposta) {
        if (resposta && resposta.status === 200 && resposta.type === "basic") {
          var copia = resposta.clone();
          caches.open(VERSAO).then(function (cache) {
            cache.put(pedido, copia);
          });
        }
        return resposta;
      }).catch(function () {
        if (pedido.mode === "navigate") {
          return caches.match("index.html");
        }
        return Response.error();
      });
    })
  );
});
