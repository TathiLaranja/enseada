/* Enseada - ajustes de aparencia.
   Roda no cabecalho de toda tela, antes de desenhar, para nao piscar.
   So existe um ajuste: o tamanho da letra. A cor e uma so, e nao se escolhe. */

var dados = criarArmazenamento(window.localStorage);

function aplicarAjustes() {
  var ajustes = dados.ler().ajustes;
  var raiz = document.documentElement;

  if (ajustes.fonte === "grande" || ajustes.fonte === "maior") {
    raiz.setAttribute("data-fonte", ajustes.fonte);
  } else {
    raiz.removeAttribute("data-fonte");
  }
}

function guardarAjuste(nome, valor) {
  dados.mudar(function (d) {
    d.ajustes[nome] = valor;
    return d;
  });
  aplicarAjustes();
}

aplicarAjustes();
