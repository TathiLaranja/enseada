/* Teste das fichas e do jogo Pequenos Tesouros. Node puro: node teste/fichas.test.js */

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
const f = require("../js/fichas.js");
const m = require("../js/memoria.js");
const fs = require("node:fs");

function seq(semente) {
  let x = semente;
  return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
}

teste("são 24 fichas diferentes, com nome para leitor de tela", function () {
  assert.strictEqual(f.FICHAS.length, 24);
  assert.strictEqual(new Set(f.FICHAS.map(function (x) { return x.id; })).size, 24);
  f.FICHAS.forEach(function (x) { assert.ok(x.nome.length > 2); });
});

teste("todo recorte cabe dentro da imagem da folha de fichas", function () {
  f.FICHAS.forEach(function (x) {
    assert.ok(x.cx - f.FICHAS_RAIO >= 0 && x.cx + f.FICHAS_RAIO <= f.FICHAS_LARGURA, x.id + " fora na largura");
    assert.ok(x.cy - f.FICHAS_RAIO >= 0 && x.cy + f.FICHAS_RAIO <= f.FICHAS_ALTURA, x.id + " fora na altura");
  });
});

teste("o arquivo da folha existe e tem o tamanho que o recorte espera", function () {
  const b = fs.readFileSync("public/images/jogo-memoria.jpg");
  assert.strictEqual(b[0], 0xff); assert.strictEqual(b[1], 0xd8);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marca = b[i + 1];
    if (marca >= 0xc0 && marca <= 0xc3) {
      assert.strictEqual(b.readUInt16BE(i + 7), f.FICHAS_LARGURA);
      assert.ok(Math.abs(b.readUInt16BE(i + 5) - f.FICHAS_ALTURA) <= 2);
      return;
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  assert.fail("sem cabecalho de tamanho");
});

teste("o estilo mostra só uma ficha: tamanho e posição em porcentagem do quadrado", function () {
  const e = f.fichaEstilo(f.fichaPorId("abelha"));
  assert.ok(e.backgroundImage.indexOf("public/images/jogo-memoria.jpg") !== -1);
  assert.ok(parseFloat(e.backgroundSize) > 600);
  const p = e.backgroundPosition.split(" ").map(parseFloat);
  assert.ok(p[0] >= 0 && p[0] <= 100 && p[1] >= 0 && p[1] <= 100);
  assert.strictEqual(f.fichaPorId("nao-existe"), null);
});

teste("as coleções só têm fichas que existem, sem repetir, e dão para uma partida", function () {
  f.FICHAS_TEMAS.forEach(function (t) {
    const ids = f.fichasDoTema(t.id);
    assert.strictEqual(new Set(ids).size, ids.length, t.id);
    ids.forEach(function (id) { assert.ok(f.fichaPorId(id), t.id + ": " + id); });
    assert.ok(ids.length >= f.FICHAS_PARES_POR_PARTIDA, t.id + " pequena demais");
  });
  assert.strictEqual(f.fichasDoTema("misturado").length, 24);
  assert.strictEqual(f.fichasDoTema("inexistente").length, f.fichasDoTema(f.FICHAS_TEMAS[0].id).length);
});

teste("as coleções temáticas não se misturam: bichinhos têm bichos, jardim tem plantas e objetos", function () {
  const bichos = f.fichasDoTema("bichinhos"), jardim = f.fichasDoTema("jardim");
  assert.ok(bichos.indexOf("abelha") !== -1 && bichos.indexOf("beterraba") === -1);
  assert.ok(jardim.indexOf("beterraba") !== -1 && jardim.indexOf("abelha") === -1);
  assert.ok(!bichos.some(function (id) { return jardim.indexOf(id) !== -1; }));
});

teste("a partida usa 8 fichas do tema, cada uma duas vezes, e nunca uma de outro tema", function () {
  for (let n = 1; n <= 30; n++) {
    const ids = m.sortearItens(f.fichasDoTema("bichinhos"), f.FICHAS_PARES_POR_PARTIDA, seq(n));
    assert.strictEqual(ids.length, 8);
    const jogo = m.novoJogo(seq(n + 100), ids);
    assert.strictEqual(jogo.cartas.length, 16);
    ids.forEach(function (id) {
      assert.strictEqual(jogo.cartas.filter(function (c) { return c === id; }).length, 2);
      assert.ok(f.fichasDoTema("bichinhos").indexOf(id) !== -1);
    });
  }
});

teste("sortear não repete nem altera a lista original, e pede no máximo o que existe", function () {
  const lista = ["a", "b", "c"];
  const r = m.sortearItens(lista, 10, seq(1));
  assert.deepStrictEqual(r.slice().sort(), ["a", "b", "c"]);
  assert.deepStrictEqual(lista, ["a", "b", "c"]);
});

teste("o jogo de palavras antigo continua igual quando não se passa lista", function () {
  const j = m.novoJogo(seq(2));
  assert.strictEqual(j.cartas.length, m.PALAVRAS_DO_JOGO.length * 2);
});

teste("a tela não tem cronômetro nem pontos e não fala com a rede", function () {
  const js = fs.readFileSync("js/tela-jogos.js", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/setInterval|setTimeout|Date\.now|pontos|placar/i.test(js));
  assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon|https?:\/\//.test(js));
});

fim("Pequenos Tesouros");
