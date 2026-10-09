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
const zlib = require("node:zlib");
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

/* Le os pixels de um PNG RGBA de 8 bits sem entrelacamento, so com o Node. */
function lerPng(caminho) {
  const b = fs.readFileSync(caminho);
  const largura = b.readUInt32BE(16), altura = b.readUInt32BE(20);
  assert.strictEqual(b[24], 8); assert.ok(b[25] === 6 || b[25] === 2, "so RGB ou RGBA"); assert.strictEqual(b[28], 0);
  const bpp = b[25] === 6 ? 4 : 3;
  let pos = 8; const dados = [];
  while (pos < b.length) {
    const tam = b.readUInt32BE(pos), tipo = b.slice(pos + 4, pos + 8).toString();
    if (tipo === "IDAT") { dados.push(b.slice(pos + 8, pos + 8 + tam)); }
    pos += 12 + tam;
  }
  const bruto = zlib.inflateSync(Buffer.concat(dados));
  const linha = largura * bpp, px = Buffer.alloc(linha * altura);
  for (let y = 0; y < altura; y++) {
    const f = bruto[y * (linha + 1)];
    for (let x = 0; x < linha; x++) {
      const v = bruto[y * (linha + 1) + 1 + x];
      const a = x >= bpp ? px[y * linha + x - bpp] : 0;
      const c = y > 0 ? px[(y - 1) * linha + x] : 0;
      const d = (x >= bpp && y > 0) ? px[(y - 1) * linha + x - bpp] : 0;
      let r = v;
      if (f === 1) { r = v + a; }
      else if (f === 2) { r = v + c; }
      else if (f === 3) { r = v + Math.floor((a + c) / 2); }
      else if (f === 4) {
        const pp = a + c - d, pa = Math.abs(pp - a), pb = Math.abs(pp - c), pc = Math.abs(pp - d);
        r = v + (pa <= pb && pa <= pc ? a : (pb <= pc ? c : d));
      }
      px[y * linha + x] = r & 255;
    }
  }
  return function (x, y) {
    const i = (y * largura + x) * bpp;
    return [px[i], px[i + 1], px[i + 2], bpp === 4 ? px[i + 3] : 255];
  };
}
function hex(r) { return "#" + r.slice(0, 3).map(function (n) { return n.toString(16).padStart(2, "0"); }).join("").toUpperCase(); }

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

teste("as camadas do icone: fundo pêssego, céu marfim no círculo, morros verdes por baixo", function () {
  const ler = lerPng("assets/icon.png");
  assert.strictEqual(ler(2, 2)[3], 0, "canto deveria ser transparente (arredondado)");
  assert.strictEqual(hex(ler(512, 8)), "#E8B9A8", "fundo pessego");
  assert.strictEqual(hex(ler(60, 512)), "#E8B9A8", "fundo pessego na lateral");
  assert.strictEqual(hex(ler(512, 300)), "#FAF8F5", "ceu marfim dentro do circulo");
  const morro = ler(400, 740);
  assert.ok(morro[1] > morro[0] && morro[2] > morro[0], "morro deveria ser verde-azulado, foi " + hex(morro));
});

teste("o círculo interno ocupa cerca de 55% da largura do ícone, centrado", function () {
  const ler = lerPng("assets/icon.png");
  let esq = -1, dir = -1;
  for (let x = 0; x < 1024; x++) { if (hex(ler(x, 512)) !== "#E8B9A8") { if (esq < 0) { esq = x; } dir = x; } }
  const razao = (dir - esq + 1) / 1024;
  assert.ok(razao > 0.53 && razao < 0.57, "razao " + razao);
  assert.ok(Math.abs((esq + dir) / 2 - 512) < 4, "fora do centro");
});

teste("o ícone maskable é quadrado cheio, sem cantos transparentes", function () {
  const ler = lerPng("icones/icone-512-mascara.png");
  assert.strictEqual(ler(1, 1)[3], 255);
  assert.strictEqual(hex(ler(1, 1)), "#E8B9A8");
});

fim("icone");
