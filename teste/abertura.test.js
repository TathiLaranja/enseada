/* Teste da abertura. Node puro: node teste/abertura.test.js */

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
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("css/base.css", "utf8") + fs.readFileSync("css/tema.css", "utf8");

teste("a abertura leva a frase pedida e as três funcionalidades", function () {
  assert.ok(html.indexOf("Bem-vindos à Enseada") !== -1);
  assert.ok(html.indexOf("Um espaço seguro e sem pressa para respirar, criar e pausar. Sinta-se em casa.") !== -1);
  ["Jogos calmos", "Espaço de desenho", "Ajustes"].forEach(function (t) {
    assert.ok(html.indexOf(t) !== -1, t);
  });
});

teste("a abertura nasce escondida e a tela Agora continua no HTML", function () {
  assert.ok(/id="abertura"[^>]*hidden/.test(html));
  assert.ok(html.indexOf('id="lista"') !== -1);
});

teste("sem animação em lugar nenhum: nada de keyframes nem animation ligada", function () {
  assert.ok(css.indexOf("@keyframes") === -1);
  assert.ok(!/animation\s*:\s*(?!none)\S/.test(css));
  assert.ok(!/<animate|<set |animateTransform/.test(html));
});

teste("a gota usa só cores do tema, sem código de cor solto", function () {
  const svg = html.slice(html.indexOf("<svg"), html.indexOf("</svg>"));
  assert.ok(!/#[0-9a-fA-F]{3,6}/.test(svg));
});

teste("o ajuste que esconde a abertura guarda só sim ou não, sem data", function () {
  const g = require("../js/armazenamento.js");
  const v = g.depositoVazio().ajustes;
  assert.strictEqual(typeof v.boasVindasVistas, "boolean");
});

fim("abertura");
