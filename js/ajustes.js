/* Pouso - ajustes de aparencia.
   Roda no cabecalho de toda tela, antes de desenhar, para nao piscar.
   Tema e tamanho de fonte ficam no aparelho, como todo o resto. */

var dados = criarArmazenamento(window.localStorage);

function aplicarAjustes() {
  var ajustes = dados.ler().ajustes;
  var raiz = document.documentElement;

  /* A tela Agora comeca escura, como foi decidido. Se a pessoa escolheu um
     tema na tela de Ajuda, a escolha dela vale em toda tela, Agora inclusive. */
  var tema = ajustes.tema;
  if (tema === "sistema" && raiz.getAttribute("data-tela") === "agora") {
    tema = "escuro";
  }

  if (tema === "claro" || tema === "escuro") {
    raiz.setAttribute("data-tema", tema);
  } else {
    raiz.removeAttribute("data-tema");
  }

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
