/* Teste da Memória de palavras. Node puro: node teste/palavrapar.test.js */

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
const m = require("../js/palavrapar.js");
const fs = require("node:fs");
const BANCO = [
  { resposta: "MAR", dica: "Água salgada com ondas." },
  { resposta: "SOL", dica: "Estrela que ilumina o dia." },
  { resposta: "PAO", dica: "Alimento de farinha que vai ao forno." }
];
/* sorteio previsível, para o teste não depender de sorte */
function fila(valores) { let i = 0; return () => valores[i++ % valores.length]; }
const jogo = () => m.palavraparNovo(BANCO, 3, fila([0]));

teste("cada par vira duas cartas: a palavra e a frase dela", function () {
  const e = jogo();
  assert.strictEqual(e.cartas.length, 6);
  assert.strictEqual(e.cartas.filter(c => c.tipo === "palavra").length, 3);
  assert.strictEqual(e.cartas.filter(c => c.tipo === "dica").length, 3);
  e.cartas.forEach(c => assert.ok(c.texto && c.texto.trim() !== "", "carta sem texto"));
  const ids = e.cartas.map(c => c.id);
  ids.forEach((id, i) => assert.strictEqual(ids.indexOf(id), i, "id repetido: " + id));
});

teste("pede mais pares do que o banco tem e não quebra", function () {
  const e = m.palavraparNovo(BANCO, 99, fila([0]));
  assert.strictEqual(e.cartas.length, 6);
});

teste("embaralhar não estraga nem altera a lista de origem", function () {
  const origem = ["a", "b", "c", "d"];
  const saida = m.palavraparEmbaralhar(origem, fila([0.9, 0.1, 0.5]));
  assert.deepStrictEqual(origem, ["a", "b", "c", "d"], "mexeu na lista recebida");
  assert.deepStrictEqual(saida.slice().sort(), origem.slice().sort());
});

teste("a palavra casa com a frase dela, e não com outra palavra", function () {
  let e = jogo();
  const p0 = e.cartas.filter(c => c.par === 0);
  e = m.palavraparVirar(m.palavraparVirar(e, p0[0].id), p0[1].id);
  assert.ok(m.palavraparCasaram(e));
  e = m.palavraparResolver(e);
  assert.deepStrictEqual(e.achados, [0]);
  assert.deepStrictEqual(e.abertas, []);
});

teste("duas cartas de pares diferentes não casam, e nada é perdido", function () {
  let e = jogo();
  const a = e.cartas.filter(c => c.par === 0)[0];
  const b = e.cartas.filter(c => c.par === 1)[0];
  e = m.palavraparVirar(m.palavraparVirar(e, a.id), b.id);
  assert.ok(!m.palavraparCasaram(e));
  e = m.palavraparResolver(e);
  assert.deepStrictEqual(e.achados, [], "errar não pode tirar nada");
  assert.deepStrictEqual(e.abertas, []);
  assert.strictEqual(e.cartas.length, 6, "nenhuma carta pode sumir ao errar");
});

teste("duas palavras do mesmo par não existem, mas se existissem não casariam", function () {
  const e = { cartas: [
    { id: "a", par: 0, tipo: "palavra", texto: "MAR" },
    { id: "b", par: 0, tipo: "palavra", texto: "MAR" }
  ], abertas: ["a", "b"], achados: [] };
  assert.ok(!m.palavraparCasaram(e), "casou palavra com palavra");
});

teste("não vira a terceira carta, nem a mesma duas vezes, nem uma já achada", function () {
  let e = jogo();
  const c = e.cartas;
  e = m.palavraparVirar(e, c[0].id);
  assert.deepStrictEqual(e.abertas, [c[0].id]);
  e = m.palavraparVirar(e, c[0].id);
  assert.deepStrictEqual(e.abertas, [c[0].id], "virou a mesma duas vezes");
  e = m.palavraparVirar(e, c[1].id);
  e = m.palavraparVirar(e, c[2].id);
  assert.strictEqual(e.abertas.length, 2, "virou uma terceira carta");
  /* carta de um par já achado não vira mais */
  const ja = { cartas: c, abertas: [], achados: [c[0].par] };
  assert.deepStrictEqual(m.palavraparVirar(ja, c[0].id).abertas, []);
  /* id que não existe não faz nada */
  assert.deepStrictEqual(m.palavraparVirar(ja, "nao-existe").abertas, []);
});

teste("o jogo só termina quando todos os pares foram achados", function () {
  let e = jogo();
  assert.ok(!m.palavraparCompleto(e));
  [0, 1, 2].forEach(function (par) {
    const duas = e.cartas.filter(c => c.par === par);
    e = m.palavraparResolver(m.palavraparVirar(m.palavraparVirar(e, duas[0].id), duas[1].id));
  });
  assert.ok(m.palavraparCompleto(e));
});

teste("não há pontuação, tempo nem derrota no código", function () {
  /* sem os comentários: eles explicam justamente que isso não existe */
  const semComentario = (f) => fs.readFileSync(f, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const js = semComentario("js/palavrapar.js") + semComentario("js/tela-palavrapar.js");
  [/\bpontos?\b/i, /pontua[cç][aã]o/i, /placar/i, /perdeu/i, /derrota/i, /cronometro/i, /cronômetro/i, /setInterval/]
    .forEach(p => assert.ok(!p.test(js), "voltou a ter " + p));
});

fim("memória de palavras");
