/* Teste do botao Compartilhar desenho. Node puro: node teste/compartilhar.test.js */

const assert = require("node:assert");
let passaram = 0;
const falhas = [];
function teste(nome, corpo) {
  try { corpo(); passaram++; } catch (erro) { falhas.push(nome + "\n   " + erro.message); }
}
function fim(nomeDoTeste) {
  if (falhas.length > 0) {
    console.log("FALHOU " + falhas.length + " de " + (passaram + falhas.length));
    falhas.forEach(function (f) { console.log(" - " + f); });
  } else {
    console.log("Passaram " + passaram + " testes de " + nomeDoTeste + ".");
  }
  process.exit(falhas.length > 0 ? 1 : 0);
}
const fs = require("node:fs");
const html = fs.readFileSync("desenhar.html", "utf8");
const js = fs.readFileSync("js/tela-desenhar.js", "utf8");
const htmlAlbum = fs.readFileSync("album.html", "utf8");
const jsAlbum = fs.readFileSync("js/tela-album.js", "utf8");

teste("o botão Compartilhar desenho fica ao lado de Guardar o desenho", function () {
  const i = html.indexOf('id="btn-salvar"');
  const j = html.indexOf('id="btn-compartilhar"');
  assert.ok(i !== -1 && j > i);
  assert.ok(html.slice(i, j).split("</button>").length === 2, "mais de um botão no meio");
  assert.ok(html.indexOf("Compartilhar desenho</button>") !== -1);
});

teste("usa a API nativa e confere canShare antes de compartilhar", function () {
  assert.ok(js.indexOf("navigator.canShare(") !== -1);
  assert.ok(js.indexOf("navigator.share(") !== -1);
  assert.ok(js.indexOf("navigator.canShare(") < js.indexOf("navigator.share("));
});

teste("tem plano B para aparelho sem compartilhamento e não manda nada sozinho", function () {
  assert.ok(js.indexOf("baixar(blob)") !== -1);
  assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon/.test(js));
});

teste("a página do álbum também tem Compartilhar, ao lado de Baixar", function () {
  assert.ok(htmlAlbum.indexOf('id="compartilhar-pagina"') !== -1, "falta o botão");
  assert.ok(htmlAlbum.indexOf("Compartilhar esta página</button>") !== -1);
  const i = htmlAlbum.indexOf('id="compartilhar-pagina"');
  const j = htmlAlbum.indexOf('id="baixar-pagina"');
  assert.ok(j > i, "Baixar deveria vir depois de Compartilhar");
  assert.ok(htmlAlbum.slice(i, j).split("</button>").length === 2, "tem botão estranho no meio");
});

teste("o álbum confere canShare antes, e tem plano B para quem não compartilha", function () {
  assert.ok(jsAlbum.indexOf("navigator.canShare(") !== -1, "não confere canShare");
  assert.ok(jsAlbum.indexOf("navigator.share(") !== -1, "não chama share");
  assert.ok(jsAlbum.indexOf("navigator.canShare(") < jsAlbum.indexOf("navigator.share("),
    "tem de conferir ANTES de chamar");
  /* sem Web Share a imagem tem de ir para os downloads, senão o toque não faz nada */
  const depois = jsAlbum.slice(jsAlbum.indexOf("navigator.share("));
  assert.ok(depois.indexOf("baixar(blob, nome)") !== -1, "falta o plano B");
});

teste("compartilhar o álbum não manda nada sozinho e avisa quando a pessoa desiste", function () {
  assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon/.test(jsAlbum), "o álbum não pode falar com servidor");
  assert.ok(jsAlbum.indexOf("AbortError") !== -1, "fechar a folha tem de dizer que nada foi enviado");
  assert.ok(jsAlbum.indexOf("Nada foi enviado.") !== -1);
});

fim("compartilhar");
