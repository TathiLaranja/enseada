/* Teste do icone do app. Node puro: node teste/icone.test.js */

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
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

function tamanhoDoPng(caminho) {
  const b = fs.readFileSync(caminho);
  assert.strictEqual(b.slice(1, 4).toString(), "PNG", caminho + " nao e PNG");
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

teste("o icone novo existe em assets/icon.png com 1024 x 1024", function () {
  assert.deepStrictEqual(tamanhoDoPng("assets/icon.png"), [1024, 1024]);
});

teste("o manifest aponta para o icone novo e todo icone declarado existe com o tamanho dito", function () {
  assert.ok(manifest.icons.some(function (i) { return i.src === "assets/icon.png"; }));
  manifest.icons.forEach(function (i) {
    const lado = parseInt(i.sizes.split("x")[0], 10);
    assert.deepStrictEqual(tamanhoDoPng(i.src), [lado, lado], i.src);
  });
});

teste("o manifest ainda tem 192 e 512, que o navegador exige para instalar", function () {
  const tam = manifest.icons.map(function (i) { return i.sizes; });
  assert.ok(tam.indexOf("192x192") !== -1 && tam.indexOf("512x512") !== -1);
  assert.ok(manifest.icons.some(function (i) { return i.purpose === "maskable"; }));
});

teste("o service worker guarda o icone novo", function () {
  assert.ok(fs.readFileSync("service-worker.js", "utf8").indexOf('"assets/icon.png"') !== -1);
});

teste("o PNG tem canal de transparencia (cantos arredondados de verdade)", function () {
  const b = fs.readFileSync("assets/icon.png");
  assert.strictEqual(b[25], 6, "tipo de cor deveria ser RGBA");
});

fim("icone");
