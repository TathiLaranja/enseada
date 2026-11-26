/* Enseada - liga o service worker, que é o que faz o app funcionar sem internet.
   Se o navegador não tiver, o app continua funcionando com internet. */

if ("serviceWorker" in navigator) {
  /* Guardado ANTES de registrar: na primeiríssima abertura não existe
     controlador, e aí a troca é normal e não deve recarregar nada. */
  var jaTinhaControlador = !!navigator.serviceWorker.controller;
  var recarregando = false;

  /* Quando uma versão nova assume, a página aberta ainda está com os arquivos
     velhos na mão. Sem este recarregar, a pessoa continuava vendo o app
     antigo e achando que a correção não tinha saído. Acontece uma vez só. */
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (!jaTinhaControlador || recarregando) { return; }
    recarregando = true;
    window.location.reload();
  });

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").catch(function () {
      /* Sem service worker o app ainda abre. Nada a avisar para a pessoa. */
    });
  });
}

/* Pede ao navegador para NÃO apagar o que está guardado quando o aparelho
   ficar sem espaço. Sem este pedido, iOS e Android podem limpar o
   localStorage do app sozinhos, e aí some álbum, âncoras e tudo.
   É um pedido local: não sai nada do aparelho e não precisa de permissão
   nenhuma da pessoa. Se o navegador não tiver, o app segue igual. */
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persisted().then(function (ja) {
    if (!ja) { return navigator.storage.persist(); }
    return true;
  }).catch(function () { /* navegador antigo: nada a fazer e nada a avisar */ });
}
