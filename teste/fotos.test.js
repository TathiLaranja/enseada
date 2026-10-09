/* Teste das fotos. Node puro: node teste/fotos.test.js */

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
const f = require("../js/fotos.js");
const fs = require("node:fs");

teste("foto grande é reduzida mantendo a proporção; foto pequena não cresce", function () {
  assert.deepStrictEqual(f.tamanhoReduzido(4000, 3000, 900), { largura: 900, altura: 675 });
  assert.deepStrictEqual(f.tamanhoReduzido(3000, 4000, 900), { largura: 675, altura: 900 });
  assert.deepStrictEqual(f.tamanhoReduzido(300, 200, 900), { largura: 300, altura: 200 });
  assert.ok(f.tamanhoReduzido(10000, 1, 900).altura >= 1);
});

teste("o teto de fotos é respeitado", function () {
  assert.strictEqual(f.podeGuardarMais(new Array(11).fill(0), 12), true);
  assert.strictEqual(f.podeGuardarMais(new Array(12).fill(0), 12), false);
});

teste("só JPEG em data URL vira foto", function () {
  assert.ok(f.novaFoto("data:image/jpeg;base64,/9j/4AAQ", "a"));
  assert.strictEqual(f.novaFoto("javascript:alert(1)", "a"), null);
  assert.strictEqual(f.novaFoto("https://exemplo.com/a.jpg", "a"), null);
  assert.strictEqual(f.novaFoto(42, "a"), null);
});

teste("tirar remove só a foto escolhida e não altera a lista antiga", function () {
  const lista = [{ id: "a", dados: "x" }, { id: "b", dados: "y" }];
  assert.deepStrictEqual(f.tirarFoto(lista, "a").map(function (i) { return i.id; }), ["b"]);
  assert.strictEqual(lista.length, 2);
});

teste("a tela não manda foto para a internet e não usa endereço externo", function () {
  const js = fs.readFileSync("js/tela-fotos.js", "utf8");
  assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon|https?:\/\//.test(js));
  assert.ok(js.indexOf("image/jpeg") !== -1, "regrava como JPEG para apagar a localizacao");
});

fim("fotos");
