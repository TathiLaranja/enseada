/* Teste do album de retratos. Node puro: node teste/album.test.js */

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
const a = require("../js/album.js");
const g = require("../js/armazenamento.js");
const fs = require("node:fs");

const FOTO = "data:image/jpeg;base64,/9j/4AAQ";
function contador() { let i = 0; return function () { return "p" + (i++); }; }

teste("o álbum começa com 3 páginas em branco e aceita mais, sem limite fixo", function () {
  let al = a.albumNovo(contador());
  assert.strictEqual(al.paginas.length, 3);
  assert.ok(al.paginas.every(function (p) { return p.polaroids.length === 0; }));
  for (let i = 0; i < 40; i++) { al = a.albumAdicionarPagina(al, "n" + i); }
  assert.strictEqual(al.paginas.length, 43);
});

teste("adicionar polaroid põe a foto no meio da página certa, com anotação vazia", function () {
  const al0 = a.albumNovo(contador());
  const al = a.albumAdicionarPolaroid(al0, "p1", "q1", FOTO, 3);
  assert.strictEqual(al.paginas[1].polaroids.length, 1);
  assert.strictEqual(al.paginas[0].polaroids.length, 0);
  const q = al.paginas[1].polaroids[0];
  assert.strictEqual(q.nota, "");
  assert.strictEqual(q.foto, FOTO);
  assert.ok(q.x >= 0 && q.x <= 1 - a.POLAROID_LARGURA && q.y >= 0 && q.y <= 1 - a.POLAROID_ALTURA);
  assert.strictEqual(al0.paginas[1].polaroids.length, 0, "o álbum antigo não pode mudar");
});

teste("polaroids novas não caem exatamente uma em cima da outra", function () {
  let al = a.albumNovo(contador());
  for (let i = 0; i < 4; i++) { al = a.albumAdicionarPolaroid(al, "p0", "q" + i, FOTO, 0); }
  const pos = al.paginas[0].polaroids.map(function (q) { return q.x.toFixed(3) + "," + q.y.toFixed(3); });
  assert.strictEqual(new Set(pos).size, 4);
});

teste("mover leva a polaroid ao lugar pedido e nunca a deixa sair da página", function () {
  let al = a.albumAdicionarPolaroid(a.albumNovo(contador()), "p0", "q1", FOTO, 0);
  al = a.albumMover(al, "p0", "q1", 0.2, 0.3);
  assert.deepStrictEqual([al.paginas[0].polaroids[0].x, al.paginas[0].polaroids[0].y], [0.2, 0.3]);
  al = a.albumMover(al, "p0", "q1", -5, -5);
  assert.deepStrictEqual([al.paginas[0].polaroids[0].x, al.paginas[0].polaroids[0].y], [0, 0]);
  al = a.albumMover(al, "p0", "q1", 9, 9);
  assert.ok(Math.abs(al.paginas[0].polaroids[0].x - (1 - a.POLAROID_LARGURA)) < 1e-9);
  assert.ok(Math.abs(al.paginas[0].polaroids[0].y - (1 - a.POLAROID_ALTURA)) < 1e-9);
});

teste("a anotação é opcional e tem tamanho máximo", function () {
  let al = a.albumAdicionarPolaroid(a.albumNovo(contador()), "p0", "q1", FOTO, 0);
  al = a.albumAnotar(al, "p0", "q1", "praia com a vovó");
  assert.strictEqual(al.paginas[0].polaroids[0].nota, "praia com a vovó");
  al = a.albumAnotar(al, "p0", "q1", "x".repeat(200));
  assert.strictEqual(al.paginas[0].polaroids[0].nota.length, a.ALBUM_TAMANHO_DA_NOTA);
});

teste("trazer para a frente põe a polaroid no fim da lista; tirar remove só ela", function () {
  let al = a.albumNovo(contador());
  ["q1", "q2", "q3"].forEach(function (id) { al = a.albumAdicionarPolaroid(al, "p0", id, FOTO, 0); });
  al = a.albumTrazerParaFrente(al, "p0", "q1");
  assert.deepStrictEqual(al.paginas[0].polaroids.map(function (q) { return q.id; }), ["q2", "q3", "q1"]);
  al = a.albumTirarPolaroid(al, "p0", "q3");
  assert.deepStrictEqual(al.paginas[0].polaroids.map(function (q) { return q.id; }), ["q2", "q1"]);
});

teste("há um teto de polaroids; passado dele o álbum não muda", function () {
  let al = a.albumNovo(contador());
  for (let i = 0; i < a.ALBUM_MAXIMO_DE_POLAROIDS + 5; i++) { al = a.albumAdicionarPolaroid(al, "p" + (i % 3), "q" + i, FOTO, 0); }
  assert.strictEqual(a.albumTotalDePolaroids(al), a.ALBUM_MAXIMO_DE_POLAROIDS);
  assert.strictEqual(a.albumPodeAdicionar(al), false);
  assert.strictEqual(a.albumAdicionarPolaroid(al, "p0", "novo", FOTO, 0), al);
});

teste("o recorte quadrado fica no centro, como o object-fit: cover", function () {
  assert.deepStrictEqual(a.albumRecorteQuadrado(800, 600), { x: 100, y: 0, lado: 600 });
  assert.deepStrictEqual(a.albumRecorteQuadrado(600, 800), { x: 0, y: 100, lado: 600 });
});

teste("o armazenamento guarda o álbum e recoloca tudo dentro da página", function () {
  const bruto = { album: { paginas: [
    { id: "p0", polaroids: [
      { id: "q1", foto: FOTO, nota: "oi", x: -3, y: 40, giro: 99 },
      { id: "q2", foto: "javascript:alert(1)", nota: "x", x: 0, y: 0, giro: 0 },
      { id: "q3", foto: "data:image/svg+xml;base64,AAAA", nota: "x", x: 0, y: 0, giro: 0 }
    ] },
    { id: "BAD ID!", polaroids: [] },
    { id: "p2", polaroids: [] }
  ] } };
  const n = g.normalizar(bruto).album;
  assert.deepStrictEqual(n.paginas.map(function (p) { return p.id; }), ["p0", "p2"]);
  const q = n.paginas[0].polaroids;
  assert.strictEqual(q.length, 1);
  assert.ok(q[0].x === 0 && q[0].y <= 1 - a.POLAROID_ALTURA + 1e-9 && q[0].giro === 8);
});

teste("os limites do armazenamento batem com as medidas da polaroid", function () {
  const n = g.normalizar({ album: { paginas: [{ id: "p0", polaroids: [{ id: "q1", foto: FOTO, x: 9, y: 9 }] }] } }).album;
  assert.ok(Math.abs(n.paginas[0].polaroids[0].x - (1 - a.POLAROID_LARGURA)) < 1e-9);
  assert.ok(Math.abs(n.paginas[0].polaroids[0].y - (1 - a.POLAROID_ALTURA)) < 1e-3);
});

teste("o armazenamento corta o excesso de polaroids", function () {
  const pols = [];
  for (let i = 0; i < 50; i++) { pols.push({ id: "q" + i, foto: FOTO, x: 0, y: 0 }); }
  const n = g.normalizar({ album: { paginas: [{ id: "p0", polaroids: pols }] } }).album;
  assert.strictEqual(n.paginas[0].polaroids.length, g.MAXIMO_DE_POLAROIDS);
});

teste("o álbum nunca está salvo sem páginas e começa vazio (a tela cria as 3)", function () {
  assert.strictEqual(g.depositoVazio().album, null);
  assert.strictEqual(g.normalizar({ album: { paginas: [] } }).album, null);
});

teste("a tela tem baixar página e salva sozinha, sem rede", function () {
  const js = fs.readFileSync("js/tela-album.js", "utf8");
  const html = fs.readFileSync("album.html", "utf8");
  assert.ok(html.indexOf("Baixar esta página como imagem") !== -1);
  assert.ok(html.indexOf("Nova página") !== -1);
  assert.ok(js.indexOf("image/png") !== -1 && js.indexOf("download") !== -1);
  assert.ok(js.indexOf("guardar()") !== -1);
  assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon|https?:\/\//.test(js));
});

fim("álbum");
