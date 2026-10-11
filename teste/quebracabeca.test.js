/* Teste do quebra-cabeca Cantinho Tranquilo. Node puro: node teste/quebracabeca.test.js */

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
const q = require("../js/quebracabeca.js");
const fs = require("node:fs");

function seq(semente) {
  let x = semente;
  return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
}
function peca(e, id) { return e.pecas.filter(function (p) { return p.id === id; })[0]; }

teste("os três níveis têm 12, 24 e 56 peças e os nomes pedidos", function () {
  assert.deepStrictEqual(q.QC_NIVEIS.map(function (n) { return n.nome; }), ["Chegar", "Explorar", "Permanecer"]);
  assert.deepStrictEqual(q.QC_NIVEIS.map(function (n) { return n.colunas * n.linhas; }), [12, 24, 56]);
  q.QC_NIVEIS.forEach(function (n) {
    const e = q.qcNovo(n.id, seq(3));
    assert.strictEqual(e.pecas.length, n.colunas * n.linhas);
    assert.strictEqual(new Set(e.pecas.map(function (p) { return p.id; })).size, e.pecas.length);
  });
  assert.strictEqual(q.qcNivel("nao-existe").id, "chegar");
});

teste("o jogo começa sem nenhuma peça no lugar, todas na bandeja, dentro da mesa", function () {
  q.QC_NIVEIS.forEach(function (n) {
    const e = q.qcNovo(n.id, seq(7));
    assert.strictEqual(q.qcCompleto(e), false);
    e.pecas.forEach(function (p) {
      assert.strictEqual(p.encaixada, false);
      assert.ok(p.y >= q.QC_BANDEJA_TOPO - 1e-9, "peca fora da bandeja");
      assert.ok(p.x >= 0 && p.x <= 1 - 1 / e.colunas + 1e-9);
      assert.ok(p.y <= q.QC_MESA_ALTURA - 1 / e.linhas + 1e-9);
    });
  });
});

teste("soltar perto do lugar certo encaixa; longe, fica onde foi solta", function () {
  const e = q.qcNovo("explorar", seq(1));
  const p = e.pecas[0], lugar = q.qcLugar(e, p);
  const perto = q.qcSoltar(e, p.id, lugar.x + 0.03, lugar.y - 0.03);
  assert.strictEqual(peca(perto, p.id).encaixada, true);
  assert.deepStrictEqual([peca(perto, p.id).x, peca(perto, p.id).y], [lugar.x, lugar.y]);
  const longe = q.qcSoltar(e, p.id, 0.5, 1.4);
  assert.strictEqual(peca(longe, p.id).encaixada, false);
  assert.deepStrictEqual([peca(longe, p.id).x, peca(longe, p.id).y], [0.5, 1.4]);
});

teste("peça no lugar errado do quadro não encaixa e não dá aviso: só fica ali", function () {
  const e = q.qcNovo("chegar", seq(2));
  const p = e.pecas[0], lugar = q.qcLugar(e, p);
  const errado = q.qcSoltar(e, p.id, (lugar.x + 0.5) % 0.66, (lugar.y + 0.5) % 0.5);
  assert.strictEqual(peca(errado, p.id).encaixada, false);
  assert.deepStrictEqual(Object.keys(errado).sort(), ["colunas", "linhas", "nivel", "pecas"]);
});

teste("a peça nunca sai da mesa, nem ao ser solta fora", function () {
  const e = q.qcNovo("permanecer", seq(4));
  const id = e.pecas[0].id;
  const r = peca(q.qcSoltar(e, id, -5, -5), id);
  assert.ok(r.x >= 0 && r.y >= 0);
  const r2 = peca(q.qcSoltar(e, id, 9, 9), id);
  assert.ok(r2.x <= 1 - 1 / e.colunas + 1e-9 && r2.y <= q.QC_MESA_ALTURA - 1 / e.linhas + 1e-9);
});

teste("peça encaixada fica trancada: não se move nem se desencaixa", function () {
  const e = q.qcNovo("chegar", seq(5));
  const id = e.pecas[0].id, lugar = q.qcLugar(e, e.pecas[0]);
  const a = q.qcSoltar(e, id, lugar.x, lugar.y);
  assert.deepStrictEqual(peca(q.qcMover(a, id, 0.9, 1.5), id), peca(a, id));
  assert.deepStrictEqual(peca(q.qcSoltar(a, id, 0.9, 1.5), id), peca(a, id));
});

teste("mover durante o arrasto não encaixa; só soltar encaixa; o estado antigo não muda", function () {
  const e = q.qcNovo("chegar", seq(6));
  const p = e.pecas[0], lugar = q.qcLugar(e, p);
  const antes = JSON.stringify(e);
  const m = q.qcMover(e, p.id, lugar.x, lugar.y);
  assert.strictEqual(peca(m, p.id).encaixada, false);
  assert.strictEqual(JSON.stringify(e), antes);
});

teste("encaixar todas as peças completa o quadro, em qualquer nível", function () {
  q.QC_NIVEIS.forEach(function (n) {
    let e = q.qcNovo(n.id, seq(9));
    e.pecas.slice().forEach(function (p) { const l = q.qcLugar(e, p); e = q.qcSoltar(e, p.id, l.x, l.y); });
    assert.strictEqual(q.qcCompleto(e), true, n.id);
  });
});

teste("a ajuda encaixa uma peça solta por vez e termina avisando que não há mais", function () {
  let e = q.qcNovo("chegar", seq(8));
  const s = seq(1);
  for (let i = 0; i < 12; i++) {
    const r = q.qcAjudar(e, s);
    assert.ok(r.id);
    assert.strictEqual(peca(r.estado, r.id).encaixada, true);
    e = r.estado;
  }
  assert.strictEqual(q.qcCompleto(e), true);
  assert.strictEqual(q.qcAjudar(e, s).id, null);
});

teste("trazer para a frente põe a peça no fim da lista", function () {
  const e = q.qcNovo("chegar", seq(10));
  const id = e.pecas[0].id;
  const r = q.qcTrazerParaFrente(e, id);
  assert.strictEqual(r.pecas[r.pecas.length - 1].id, id);
  assert.strictEqual(r.pecas.length, e.pecas.length);
});

teste("a imagem do quadro existe e a tela não usa tempo, pontos nem rede", function () {
  assert.ok(fs.existsSync("public/images/quebra-cabeca.jpg"));
  const js = fs.readFileSync("js/tela-quebracabeca.js", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(js.indexOf("public/images/quebra-cabeca.jpg") !== -1);
  assert.ok(!/setInterval|setTimeout|Date\.now|pontos|placar|erro/i.test(js));
  assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon|https?:\/\//.test(js));
});

fim("quebra-cabeça");
