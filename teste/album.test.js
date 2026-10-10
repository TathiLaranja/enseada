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
const ad = require("../js/adesivos.js");
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

teste("a inclinação das polaroides pode ser ajustada e fica limitada a oito graus", function () {
  let al = a.albumAdicionarPolaroid(a.albumNovo(contador()), "p0", "q1", FOTO, 0);
  al = a.albumGirarPolaroid(al, "p0", "q1", 4);
  assert.strictEqual(al.paginas[0].polaroids[0].giro, 4);
  al = a.albumGirarPolaroid(al, "p0", "q1", 20);
  assert.strictEqual(al.paginas[0].polaroids[0].giro, 8);
  al = a.albumGirarPolaroid(al, "p0", "q1", -20);
  assert.strictEqual(al.paginas[0].polaroids[0].giro, -8);
  al = a.albumGirarPolaroid(al, "p0", "q1", 0);
  assert.strictEqual(al.paginas[0].polaroids[0].giro, 0);
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

teste("o fundo da página é o marfim #FAF8F5, sem verde, na tela e na imagem baixada", function () {
  const css = fs.readFileSync("css/base.css", "utf8");
  const bloco = css.slice(css.indexOf(".mural {"), css.indexOf("}", css.indexOf(".mural {")));
  assert.ok(/background:\s*#FAF8F5/i.test(bloco), "mural sem marfim");
  assert.ok(!/restinga|A5B09A/i.test(bloco), "ainda tem verde");
  const js = fs.readFileSync("js/tela-album.js", "utf8");
  assert.ok(js.indexOf('COR_DA_PAGINA = "#FAF8F5"') !== -1);
  assert.ok(!/restinga|A5B09A/i.test(js));
});

teste("cada polaroid leva uma fita adesiva de um dos quatro tons da paleta", function () {
  assert.strictEqual(a.ALBUM_CORES_DA_FITA.length, 4);
  let al = a.albumAdicionarPolaroid(a.albumNovo(contador()), "p0", "q1", FOTO, 0, 2);
  assert.strictEqual(al.paginas[0].polaroids[0].fita, 2);
  al = a.albumAdicionarPolaroid(al, "p0", "q2", FOTO, 0, 99);
  assert.strictEqual(al.paginas[0].polaroids[1].fita, 3);
  const css = fs.readFileSync("css/base.css", "utf8");
  [0, 1, 2, 3].forEach(function (i) { assert.ok(css.indexOf('.fita[data-fita="' + i + '"]') !== -1); });
  const n = g.normalizar({ album: { paginas: [{ id: "p0", polaroids: [{ id: "q", foto: FOTO, fita: 40 }] }] } }).album;
  assert.strictEqual(n.paginas[0].polaroids[0].fita, 3);
});

teste("a gaveta tem natureza, bichinhos e brinquedos e veículos, todos em vetor e sem rede", function () {
  const ids = ad.ADESIVOS.map(function (x) { return x.id; });
  ["sol", "nuvem", "lua", "estrela", "borboleta", "coracao", "flor", "ursinho", "bola", "carrinho", "aviao"].forEach(function (n) {
    assert.ok(ids.indexOf(n) !== -1, n);
  });
  assert.strictEqual(new Set(ids).size, ids.length);
  ad.ADESIVOS.forEach(function (x) {
    assert.ok(x.svg.indexOf("<svg") === 0 && x.svg.indexOf("viewBox") !== -1, x.id);
    assert.ok(!/https?:\/\/(?!www\.w3\.org)|href=|<script|<image|onload/i.test(x.svg), x.id + " fala com o mundo de fora");
    assert.ok(ad.adesivoEndereco(x.id).indexOf("data:image/svg+xml") === 0);
  });
  assert.strictEqual(ad.adesivoPorId("nao-existe"), null);
  assert.strictEqual(ad.adesivoEndereco("nao-existe"), "");
});

teste("adesivo novo entra no meio da página, com tamanho inicial, e não empilha", function () {
  let al = a.albumNovo(contador());
  for (let i = 0; i < 5; i++) { al = a.albumAdicionarAdesivo(al, "p0", "s" + i, "sol", 0); }
  const lista = al.paginas[0].adesivos;
  assert.strictEqual(lista.length, 5);
  assert.ok(lista.every(function (x) { return x.tam === a.ADESIVO_TAMANHO_INICIAL && x.tipo === "sol"; }));
  assert.strictEqual(new Set(lista.map(function (x) { return x.x.toFixed(3) + "," + x.y.toFixed(3); })).size, 5);
  assert.strictEqual(al.paginas[1].adesivos.length, 0);
});

teste("adesivo se move como a polaroid e nunca sai da página", function () {
  let al = a.albumAdicionarAdesivo(a.albumNovo(contador()), "p0", "s1", "lua", 0);
  al = a.albumMover(al, "p0", "s1", 0.1, 0.2);
  assert.deepStrictEqual([al.paginas[0].adesivos[0].x, al.paginas[0].adesivos[0].y], [0.1, 0.2]);
  al = a.albumMover(al, "p0", "s1", 9, 9);
  const s1 = al.paginas[0].adesivos[0];
  assert.ok(Math.abs(s1.x - (1 - s1.tam)) < 1e-9 && Math.abs(s1.y - (1 - a.albumAlturaDoAdesivo(s1.tam))) < 1e-9);
  al = a.albumMover(al, "p0", "s1", -9, -9);
  assert.deepStrictEqual([al.paginas[0].adesivos[0].x, al.paginas[0].adesivos[0].y], [0, 0]);
});

teste("o tamanho do adesivo muda em passos, tem mínimo e máximo, e o adesivo continua na página", function () {
  let al = a.albumAdicionarAdesivo(a.albumNovo(contador()), "p0", "s1", "sol", 0);
  for (let i = 0; i < 20; i++) { al = a.albumRedimensionarAdesivo(al, "p0", "s1", 1); }
  assert.strictEqual(al.paginas[0].adesivos[0].tam, a.ADESIVO_TAMANHO_MAXIMO);
  al = a.albumMover(al, "p0", "s1", 9, 9);
  al = a.albumRedimensionarAdesivo(al, "p0", "s1", -1);
  const t = al.paginas[0].adesivos[0];
  assert.ok(t.x + t.tam <= 1 + 1e-9 && t.y + a.albumAlturaDoAdesivo(t.tam) <= 1 + 1e-9);
  for (let i = 0; i < 30; i++) { al = a.albumRedimensionarAdesivo(al, "p0", "s1", -1); }
  assert.strictEqual(al.paginas[0].adesivos[0].tam, a.ADESIVO_TAMANHO_MINIMO);
});

teste("tirar e trazer para a frente valem para polaroid e adesivo; adesivo fica por cima", function () {
  let al = a.albumAdicionarPolaroid(a.albumNovo(contador()), "p0", "q1", FOTO, 0);
  al = a.albumAdicionarAdesivo(al, "p0", "s1", "sol", 0);
  al = a.albumAdicionarAdesivo(al, "p0", "s2", "lua", 0);
  al = a.albumTrazerParaFrente(al, "p0", "s1");
  assert.deepStrictEqual(al.paginas[0].adesivos.map(function (x) { return x.id; }), ["s2", "s1"]);
  assert.strictEqual(a.albumBuscar(al.paginas[0], "s2").tipo, "adesivo");
  assert.strictEqual(a.albumBuscar(al.paginas[0], "q1").tipo, "polaroid");
  al = a.albumTirar(al, "p0", "s2");
  assert.deepStrictEqual(al.paginas[0].adesivos.map(function (x) { return x.id; }), ["s1"]);
  al = a.albumTirar(al, "p0", "q1");
  assert.strictEqual(al.paginas[0].polaroids.length, 0);
  assert.strictEqual(a.albumBuscar(al.paginas[0], "q1"), null);
});

teste("há um teto de adesivos; passado dele o álbum não muda", function () {
  let al = a.albumNovo(contador());
  for (let i = 0; i < a.ALBUM_MAXIMO_DE_ADESIVOS + 5; i++) { al = a.albumAdicionarAdesivo(al, "p" + (i % 3), "s" + i, "sol", 0); }
  assert.strictEqual(a.albumTotalDeAdesivos(al), a.ALBUM_MAXIMO_DE_ADESIVOS);
  assert.strictEqual(a.albumAdicionarAdesivo(al, "p0", "novo", "sol", 0), al);
});

teste("o armazenamento guarda os adesivos, recoloca dentro da página e recusa tipo estranho", function () {
  const n = g.normalizar({ album: { paginas: [{ id: "p0", polaroids: [], adesivos: [
    { id: "s1", tipo: "sol", x: 9, y: 9, tam: 0.3, giro: 99 },
    { id: "s2", tipo: "javascript:x", x: 0, y: 0, tam: 0.2 },
    { id: "s3", tipo: "lua", x: -4, y: -4, tam: 5 },
    { id: "BAD!", tipo: "lua" }
  ] }] } }).album;
  const l = n.paginas[0].adesivos;
  assert.deepStrictEqual(l.map(function (x) { return x.id; }), ["s1", "s3"]);
  assert.ok(Math.abs(l[0].x - 0.7) < 1e-9 && Math.abs(l[0].y - (1 - 0.3 * 0.75)) < 1e-9 && l[0].giro === 12);
  assert.strictEqual(l[1].tam, 0.4);
  assert.strictEqual(l[1].x, 0);
});

teste("um álbum antigo, sem adesivos, continua abrindo", function () {
  const n = g.normalizar({ album: { paginas: [{ id: "p0", polaroids: [{ id: "q1", foto: FOTO }] }] } }).album;
  assert.deepStrictEqual(n.paginas[0].adesivos, []);
  assert.strictEqual(n.paginas[0].polaroids[0].fita, 0);
});

teste("a imagem baixada leva fita, adesivos e o marfim da página", function () {
  const js = fs.readFileSync("js/tela-album.js", "utf8");
  assert.ok(js.indexOf("desenharFita(") !== -1 && js.indexOf("pagina.adesivos.forEach") !== -1);
  assert.ok(js.indexOf("c.fillStyle = COR_DA_PAGINA") !== -1);
});

fim("álbum");
