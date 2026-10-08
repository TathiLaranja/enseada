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

fim("compartilhar");
