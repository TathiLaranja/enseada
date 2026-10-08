/* Enseada - ajustes de aparencia.
   Roda no cabecalho de toda tela, antes de desenhar, para nao piscar.
   Dois ajustes: o tamanho da letra e o Modo Baixo Estimulo (tema escuro e
   calmo), que so muda quando a pessoa toca no botao da tela de Ajuda. */

var dados = criarArmazenamento(window.localStorage);

function aplicarAjustes() {
  var ajustes = dados.ler().ajustes;
  var raiz = document.documentElement;

  if (ajustes.fonte === "grande" || ajustes.fonte === "maior") {
    raiz.setAttribute("data-fonte", ajustes.fonte);
  } else {
    raiz.removeAttribute("data-fonte");
  }

  var baixo = ajustes.tema === "baixo";
  if (baixo) {
    raiz.setAttribute("data-tema", "baixo");
  } else {
    raiz.removeAttribute("data-tema");
  }

  var barra = document.querySelector('meta[name="theme-color"]');
  if (barra) { barra.setAttribute("content", baixo ? "#1B2328" : "#F8F9FA"); }
}

function guardarAjuste(nome, valor) {
  dados.mudar(function (d) {
    d.ajustes[nome] = valor;
    return d;
  });
  aplicarAjustes();
}

aplicarAjustes();
