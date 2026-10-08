/* Teste do jogo da memória. Node puro: node teste/memoria.test.js */

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
const m = require("../js/memoria.js");

const semSorteio = function () { return 0; };

function posicoesDe(jogo, palavra) {
  return jogo.cartas.map(function (p, i) { return p === palavra ? i : -1; })
    .filter(function (i) { return i !== -1; });
}

teste("o jogo tem cada palavra exatamente duas vezes", function () {
  const jogo = m.novoJogo(Math.random);
  m.PALAVRAS_DO_JOGO.forEach(function (p) {
    assert.strictEqual(posicoesDe(jogo, p).length, 2);
  });
  assert.strictEqual(jogo.cartas.length, m.PALAVRAS_DO_JOGO.length * 2);
});

teste("embaralhar não altera a lista original", function () {
  const original = [1, 2, 3, 4];
  m.embaralhar(original, Math.random);
  assert.deepStrictEqual(original, [1, 2, 3, 4]);
});

teste("duas cartas iguais ficam achadas", function () {
  let jogo = m.novoJogo(semSorteio);
  const par = posicoesDe(jogo, "Mar");
  jogo = m.tocar(jogo, par[0]);
  jogo = m.tocar(jogo, par[1]);
  assert.deepStrictEqual(jogo.achadas.slice().sort(), par.slice().sort());
  assert.deepStrictEqual(jogo.viradas, []);
});

teste("duas cartas diferentes ficam viradas, sem fechar sozinhas", function () {
  let jogo = m.novoJogo(semSorteio);
  const a = posicoesDe(jogo, "Mar")[0];
  const b = posicoesDe(jogo, "Sol")[0];
  jogo = m.tocar(jogo, a);
  jogo = m.tocar(jogo, b);
  assert.deepStrictEqual(jogo.viradas, [a, b]);
  assert.deepStrictEqual(jogo.achadas, []);
});

teste("o toque seguinte fecha as duas erradas e abre a nova", function () {
  let jogo = m.novoJogo(semSorteio);
  const a = posicoesDe(jogo, "Mar")[0];
  const b = posicoesDe(jogo, "Sol")[0];
  const c = posicoesDe(jogo, "Lua")[0];
  jogo = m.tocar(m.tocar(jogo, a), b);
  jogo = m.tocar(jogo, c);
  assert.deepStrictEqual(jogo.viradas, [c]);
});

teste("não existe derrota: errar nunca tira carta achada", function () {
  let jogo = m.novoJogo(semSorteio);
  const par = posicoesDe(jogo, "Mar");
  jogo = m.tocar(m.tocar(jogo, par[0]), par[1]);
  jogo = m.tocar(jogo, posicoesDe(jogo, "Sol")[0]);
  jogo = m.tocar(jogo, posicoesDe(jogo, "Lua")[0]);
  assert.strictEqual(jogo.achadas.length, 2);
});

teste("tocar em carta achada ou fora do jogo não muda nada", function () {
  let jogo = m.novoJogo(semSorteio);
  const par = posicoesDe(jogo, "Mar");
  jogo = m.tocar(m.tocar(jogo, par[0]), par[1]);
  assert.strictEqual(m.tocar(jogo, par[0]), jogo);
  assert.strictEqual(m.tocar(jogo, 99), jogo);
});

teste("achar todos os pares termina o jogo", function () {
  let jogo = m.novoJogo(Math.random);
  m.PALAVRAS_DO_JOGO.forEach(function (p) {
    posicoesDe(jogo, p).forEach(function (i) { jogo = m.tocar(jogo, i); });
  });
  assert.strictEqual(m.terminou(jogo), true);
});

fim("jogo da memória");
