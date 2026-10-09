/* Enseada - os adesivos do album (desenhos vetoriais, sem arquivo de imagem).
   Escolhidos para servir a adultos e a criancas de qualquer genero: natureza,
   bichinhos, brinquedos e veiculos, sem cor "de menino" nem "de menina".
   Cada adesivo e um SVG completo, com cores fixas e uma borda clara de
   recorte, para ficar igual na tela e na imagem baixada. Nada vem da rede. */

var ADESIVO_CONTORNO = "#454640";
var ADESIVO_BORDA = "#FFFDF9";

function adesivoEstrela(cx, cy, fora, dentro) {
  var pontos = [];
  for (var i = 0; i < 10; i++) {
    var r = i % 2 === 0 ? fora : dentro;
    var a = -Math.PI / 2 + (i * Math.PI) / 5;
    pontos.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
  }
  return pontos.join(" ");
}

/* Fecha o desenho com a borda clara de recorte (como um adesivo de verdade). */
function adesivoSvg(corpo) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">' +
    '<defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%">' +
    '<feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/>' +
    '<feFlood flood-color="' + ADESIVO_BORDA + '"/><feComposite in2="d" operator="in" result="f"/>' +
    '<feMerge><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<g filter="url(#b)" stroke="' + ADESIVO_CONTORNO + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">' +
    corpo + "</g></svg>";
}

var ADESIVOS = [
  { id: "sol", nome: "Sol", svg: adesivoSvg(
    '<g stroke="#F2B63C" stroke-width="6">' +
    '<path d="M50 10 V20 M50 80 V90 M10 50 H20 M80 50 H90 M22 22 L29 29 M71 71 L78 78 M78 22 L71 29 M29 71 L22 78"/></g>' +
    '<circle cx="50" cy="50" r="22" fill="#F5C945"/>') },
  { id: "nuvem", nome: "Nuvem", svg: adesivoSvg(
    '<path d="M24 68 A14 14 0 0 1 26 40 A20 20 0 0 1 64 34 A17 17 0 0 1 76 68 Z" fill="#D5E6EC"/>') },
  { id: "lua", nome: "Lua", svg: adesivoSvg(
    '<path d="M62 14 A38 38 0 1 0 86 68 A30 30 0 1 1 62 14 Z" fill="#F2DDA0"/>') },
  { id: "estrela", nome: "Estrela", svg: adesivoSvg(
    '<polygon points="' + adesivoEstrela(50, 53, 38, 16) + '" fill="#F5C945"/>') },
  { id: "arcoiris", nome: "Arco-íris", svg: adesivoSvg(
    '<g fill="none" stroke-width="7" stroke-linecap="butt"><path d="M14 74 A36 36 0 0 1 86 74" stroke="#E8918F"/>' +
    '<path d="M22 74 A28 28 0 0 1 78 74" stroke="#F5C945"/><path d="M30 74 A20 20 0 0 1 70 74" stroke="#9CC9A0"/>' +
    '<path d="M38 74 A12 12 0 0 1 62 74" stroke="#7FB0D8"/></g>') },
  { id: "borboleta", nome: "Borboleta", svg: adesivoSvg(
    '<ellipse cx="32" cy="38" rx="20" ry="16" transform="rotate(-20 32 38)" fill="#B8A8D8"/>' +
    '<ellipse cx="68" cy="38" rx="20" ry="16" transform="rotate(20 68 38)" fill="#B8A8D8"/>' +
    '<ellipse cx="36" cy="64" rx="14" ry="12" transform="rotate(20 36 64)" fill="#E8B9A8"/>' +
    '<ellipse cx="64" cy="64" rx="14" ry="12" transform="rotate(-20 64 64)" fill="#E8B9A8"/>' +
    '<rect x="46" y="30" width="8" height="44" rx="4" fill="#6B5F78"/>' +
    '<path d="M48 30 C44 20 40 18 36 18 M52 30 C56 20 60 18 64 18" fill="none"/>') },
  { id: "coracao", nome: "Coração", svg: adesivoSvg(
    '<path d="M50 86 C12 60 8 30 27 21 C40 16 50 25 50 33 C50 25 60 16 73 21 C92 30 88 60 50 86 Z" fill="#E8918F"/>') },
  { id: "flor", nome: "Flor", svg: adesivoSvg(
    '<path d="M50 56 V90 M50 78 C40 72 34 74 30 80 C40 84 46 82 50 78" fill="none" stroke="#6FA37E" stroke-width="4"/>' +
    '<g fill="#F7C6A8"><circle cx="50" cy="26" r="13"/><circle cx="74" cy="42" r="13"/>' +
    '<circle cx="66" cy="62" r="13"/><circle cx="34" cy="62" r="13"/><circle cx="26" cy="42" r="13"/></g>' +
    '<circle cx="50" cy="48" r="11" fill="#F5C945"/>') },
  { id: "ursinho", nome: "Ursinho", svg: adesivoSvg(
    '<circle cx="28" cy="30" r="12" fill="#C9A27E"/><circle cx="72" cy="30" r="12" fill="#C9A27E"/>' +
    '<circle cx="28" cy="30" r="5" fill="#E7C9AA" stroke="none"/><circle cx="72" cy="30" r="5" fill="#E7C9AA" stroke="none"/>' +
    '<circle cx="50" cy="55" r="30" fill="#C9A27E"/><ellipse cx="50" cy="66" rx="13" ry="10" fill="#EBD3B5"/>' +
    '<circle cx="39" cy="50" r="3.2" fill="#454640" stroke="none"/><circle cx="61" cy="50" r="3.2" fill="#454640" stroke="none"/>' +
    '<ellipse cx="50" cy="62" rx="4.5" ry="3.2" fill="#454640" stroke="none"/><path d="M50 65 V70 M44 71 Q50 75 56 71" fill="none"/>') },
  { id: "passarinho", nome: "Passarinho", svg: adesivoSvg(
    '<path d="M16 44 L30 40 L28 52 Z" fill="#F2A65A"/>' +
    '<ellipse cx="54" cy="56" rx="28" ry="22" fill="#7FB0D8"/><circle cx="34" cy="42" r="14" fill="#7FB0D8"/>' +
    '<path d="M84 52 L96 44 L92 62 Z" fill="#6A9CC4"/><path d="M44 58 Q56 44 70 60 Q56 70 44 58 Z" fill="#9CC4E4"/>' +
    '<circle cx="31" cy="40" r="2.8" fill="#454640" stroke="none"/><path d="M46 80 V90 M60 80 V90" fill="none"/>') },
  { id: "peixe", nome: "Peixinho", svg: adesivoSvg(
    '<path d="M66 50 L90 30 L90 70 Z" fill="#E88F5A"/><ellipse cx="44" cy="50" rx="30" ry="20" fill="#F2A65A"/>' +
    '<path d="M40 32 Q48 22 56 32" fill="#E88F5A"/><circle cx="30" cy="45" r="3.4" fill="#454640" stroke="none"/>' +
    '<path d="M50 38 Q55 50 50 62" fill="none"/>') },
  { id: "bola", nome: "Bola", svg: adesivoSvg(
    '<circle cx="50" cy="50" r="34" fill="#FFFDF9"/>' +
    '<path d="M50 50 L50 16 A34 34 0 0 1 84 50 Z" fill="#E8918F" stroke="none"/>' +
    '<path d="M50 50 L84 50 A34 34 0 0 1 50 84 Z" fill="#F5C945" stroke="none"/>' +
    '<path d="M50 50 L50 84 A34 34 0 0 1 16 50 Z" fill="#7FB0D8" stroke="none"/>' +
    '<path d="M50 50 L16 50 A34 34 0 0 1 50 16 Z" fill="#9CC9A0" stroke="none"/>' +
    '<circle cx="50" cy="50" r="34" fill="none"/>') },
  { id: "carrinho", nome: "Carrinho", svg: adesivoSvg(
    '<path d="M10 62 V50 Q10 44 18 42 L32 40 L42 28 H64 L74 40 L86 44 Q92 46 92 52 V62 Z" fill="#6FB3A8"/>' +
    '<path d="M44 33 H62 L69 42 H38 Z" fill="#D5E6EC"/>' +
    '<circle cx="30" cy="64" r="11" fill="#454640"/><circle cx="72" cy="64" r="11" fill="#454640"/>' +
    '<circle cx="30" cy="64" r="4.5" fill="#D8D3C8" stroke="none"/><circle cx="72" cy="64" r="4.5" fill="#D8D3C8" stroke="none"/>') },
  { id: "aviao", nome: "Avião", svg: adesivoSvg(
    '<path d="M44 52 L62 22 H72 L62 52 Z" fill="#E8B9A8"/><path d="M44 48 L62 78 H72 L62 48 Z" fill="#E8B9A8"/>' +
    '<path d="M12 50 Q14 44 24 44 H78 Q92 46 94 50 Q92 54 78 56 H24 Q14 56 12 50 Z" fill="#8DB6D8"/>' +
    '<path d="M16 44 L10 30 H20 L28 44 Z" fill="#8DB6D8"/><circle cx="76" cy="50" r="3" fill="#D5E6EC" stroke="none"/>' +
    '<circle cx="62" cy="50" r="3" fill="#D5E6EC" stroke="none"/><circle cx="48" cy="50" r="3" fill="#D5E6EC" stroke="none"/>') }
];

function adesivoPorId(id) {
  for (var i = 0; i < ADESIVOS.length; i++) { if (ADESIVOS[i].id === id) { return ADESIVOS[i]; } }
  return null;
}

/* Endereco de dados do desenho, para usar em <img> e para desenhar no canvas. */
function adesivoEndereco(id) {
  var a = adesivoPorId(id);
  return a ? "data:image/svg+xml;charset=utf-8," + encodeURIComponent(a.svg) : "";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ADESIVOS: ADESIVOS, adesivoPorId: adesivoPorId, adesivoEndereco: adesivoEndereco };
}
