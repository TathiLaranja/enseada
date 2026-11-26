/* Enseada - os adesivos do album (desenhos vetoriais, sem arquivo de imagem).
   Escolhidos para servir a adultos e a criancas de qualquer genero: bichos,
   plantas, ceu, papelaria e casa, sem cor "de menino" nem "de menina".
   Traco de ilustracao de caderno, nao de desenho infantil: formas chapadas,
   cores da paleta, e rosto so nos bichos, com olho de pontinho.
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
    '<circle cx="62" cy="50" r="3" fill="#D5E6EC" stroke="none"/><circle cx="48" cy="50" r="3" fill="#D5E6EC" stroke="none"/>') },
  /* ---------- bichos ---------- */
  { id: "gato", nome: "Gato", svg: adesivoSvg(
    '<path d="M24 40 L22 16 L40 28 Z" fill="#9A8C7E"/><path d="M76 40 L78 16 L60 28 Z" fill="#9A8C7E"/>' +
    '<path d="M27 37 L26 24 L36 30 Z" fill="#E8B9A8" stroke="none"/><path d="M73 37 L74 24 L64 30 Z" fill="#E8B9A8" stroke="none"/>' +
    '<ellipse cx="50" cy="52" rx="30" ry="27" fill="#9A8C7E"/>' +
    '<path d="M80 62 Q94 62 92 78 Q90 88 80 86" fill="none" stroke-width="7"/>' +
    '<circle cx="39" cy="48" r="3.4" fill="#454640" stroke="none"/><circle cx="61" cy="48" r="3.4" fill="#454640" stroke="none"/>' +
    '<path d="M46 60 L50 63 L54 60 Z" fill="#E8918F" stroke="none"/>' +
    '<path d="M50 63 V67 M50 67 Q44 71 40 67 M50 67 Q56 71 60 67" fill="none" stroke-width="2"/>' +
    '<path d="M18 54 H32 M18 60 H32 M68 54 H82 M68 60 H82" fill="none" stroke-width="1.6"/>') },
  { id: "cachorro", nome: "Cachorro", svg: adesivoSvg(
    '<ellipse cx="22" cy="44" rx="11" ry="20" fill="#A98363"/><ellipse cx="78" cy="44" rx="11" ry="20" fill="#A98363"/>' +
    '<ellipse cx="50" cy="50" rx="29" ry="26" fill="#C9A27E"/>' +
    '<ellipse cx="50" cy="64" rx="16" ry="13" fill="#EBD3B5"/>' +
    '<circle cx="39" cy="45" r="3.4" fill="#454640" stroke="none"/><circle cx="61" cy="45" r="3.4" fill="#454640" stroke="none"/>' +
    '<ellipse cx="50" cy="60" rx="5" ry="3.8" fill="#454640" stroke="none"/>' +
    '<path d="M50 64 V68 M50 68 Q44 73 39 68 M50 68 Q56 73 61 68" fill="none" stroke-width="2"/>') },
  { id: "coala", nome: "Coala", svg: adesivoSvg(
    '<circle cx="20" cy="38" r="15" fill="#A8ADB0"/><circle cx="80" cy="38" r="15" fill="#A8ADB0"/>' +
    '<circle cx="20" cy="38" r="8" fill="#D8C8CC" stroke="none"/><circle cx="80" cy="38" r="8" fill="#D8C8CC" stroke="none"/>' +
    '<ellipse cx="50" cy="52" rx="28" ry="26" fill="#B6BBBE"/>' +
    '<circle cx="40" cy="48" r="3.4" fill="#454640" stroke="none"/><circle cx="60" cy="48" r="3.4" fill="#454640" stroke="none"/>' +
    '<ellipse cx="50" cy="62" rx="8" ry="10" fill="#454640" stroke="none"/>') },
  { id: "preguica", nome: "Preguiça", svg: adesivoSvg(
    '<path d="M22 18 Q50 10 78 18" fill="none" stroke-width="5" stroke="#8A6A4F"/>' +
    '<ellipse cx="50" cy="58" rx="27" ry="25" fill="#C2A98E"/>' +
    '<ellipse cx="50" cy="60" rx="18" ry="17" fill="#E4D6C2"/>' +
    '<ellipse cx="41" cy="55" rx="6" ry="7" fill="#8A6A4F" stroke="none"/><ellipse cx="59" cy="55" rx="6" ry="7" fill="#8A6A4F" stroke="none"/>' +
    '<circle cx="41" cy="55" r="2.6" fill="#454640" stroke="none"/><circle cx="59" cy="55" r="2.6" fill="#454640" stroke="none"/>' +
    '<ellipse cx="50" cy="66" rx="3.4" ry="2.6" fill="#454640" stroke="none"/>' +
    '<path d="M30 40 Q26 22 34 18 M70 40 Q74 22 66 18" fill="none" stroke-width="5" stroke="#C2A98E"/>') },
  { id: "abelha", nome: "Abelha", svg: adesivoSvg(
    '<ellipse cx="38" cy="34" rx="16" ry="12" transform="rotate(-20 38 34)" fill="#D5E6EC"/>' +
    '<ellipse cx="64" cy="32" rx="14" ry="11" transform="rotate(16 64 32)" fill="#D5E6EC"/>' +
    '<ellipse cx="50" cy="58" rx="26" ry="20" fill="#F5C945"/>' +
    '<path d="M42 40 Q40 58 44 76 M58 39 Q62 58 58 77" fill="none" stroke-width="7" stroke="#454640"/>' +
    '<circle cx="34" cy="52" r="2.8" fill="#454640" stroke="none"/>' +
    '<path d="M30 40 Q26 28 20 26 M38 36 Q36 24 30 20" fill="none" stroke-width="2"/>') },
  { id: "raposa", nome: "Raposa", svg: adesivoSvg(
    '<path d="M22 44 L18 14 L42 30 Z" fill="#E08C4E"/><path d="M78 44 L82 14 L58 30 Z" fill="#E08C4E"/>' +
    '<path d="M50 24 Q78 32 74 54 Q68 78 50 82 Q32 78 26 54 Q22 32 50 24 Z" fill="#E8964F"/>' +
    '<path d="M50 56 Q66 60 62 72 Q56 82 50 84 Q44 82 38 72 Q34 60 50 56 Z" fill="#FBF1E4"/>' +
    '<circle cx="38" cy="48" r="3.4" fill="#454640" stroke="none"/><circle cx="62" cy="48" r="3.4" fill="#454640" stroke="none"/>' +
    '<ellipse cx="50" cy="68" rx="4.6" ry="3.4" fill="#454640" stroke="none"/>') },
  { id: "coelho", nome: "Coelho", svg: adesivoSvg(
    '<ellipse cx="36" cy="26" rx="9" ry="22" transform="rotate(-10 36 26)" fill="#E6E0D8"/>' +
    '<ellipse cx="64" cy="26" rx="9" ry="22" transform="rotate(10 64 26)" fill="#E6E0D8"/>' +
    '<ellipse cx="36" cy="27" rx="4" ry="14" transform="rotate(-10 36 27)" fill="#F0C9C2" stroke="none"/>' +
    '<ellipse cx="64" cy="27" rx="4" ry="14" transform="rotate(10 64 27)" fill="#F0C9C2" stroke="none"/>' +
    '<ellipse cx="50" cy="62" rx="26" ry="23" fill="#EFEAE2"/>' +
    '<circle cx="40" cy="58" r="3.2" fill="#454640" stroke="none"/><circle cx="60" cy="58" r="3.2" fill="#454640" stroke="none"/>' +
    '<path d="M46 68 L50 71 L54 68 Z" fill="#E8918F" stroke="none"/><path d="M50 71 V75" fill="none" stroke-width="2"/>') },
  { id: "tartaruga", nome: "Tartaruga", svg: adesivoSvg(
    '<ellipse cx="78" cy="56" rx="13" ry="11" fill="#9CC9A0"/>' +
    '<circle cx="82" cy="53" r="2.6" fill="#454640" stroke="none"/>' +
    '<ellipse cx="26" cy="68" rx="9" ry="7" fill="#9CC9A0"/><ellipse cx="62" cy="72" rx="9" ry="7" fill="#9CC9A0"/>' +
    '<path d="M14 58 Q32 28 60 34 Q80 40 76 60 Z" fill="#7E9B84"/>' +
    '<path d="M34 36 Q38 50 32 58 M52 33 Q52 48 50 59 M66 38 Q64 50 66 59" fill="none" stroke-width="2"/>') },
  { id: "pinguim", nome: "Pinguim", svg: adesivoSvg(
    '<ellipse cx="50" cy="54" rx="26" ry="32" fill="#3F4A52"/>' +
    '<ellipse cx="50" cy="60" rx="17" ry="24" fill="#FBF6EE"/>' +
    '<circle cx="42" cy="42" r="3.2" fill="#454640" stroke="none"/><circle cx="58" cy="42" r="3.2" fill="#454640" stroke="none"/>' +
    '<path d="M44 51 L50 57 L56 51 Z" fill="#F2A65A" stroke="none"/>' +
    '<ellipse cx="38" cy="88" rx="10" ry="5" fill="#F2A65A"/><ellipse cx="62" cy="88" rx="10" ry="5" fill="#F2A65A"/>') },
  { id: "baleia", nome: "Baleia", svg: adesivoSvg(
    '<path d="M52 20 Q50 10 46 6 M52 20 Q56 10 62 8" fill="none" stroke-width="4" stroke="#9EBBC0"/>' +
    '<path d="M14 58 Q22 34 52 34 Q78 34 84 52 L96 36 V76 L84 62 Q76 80 50 80 Q20 80 14 58 Z" fill="#7FA3AA"/>' +
    '<path d="M20 64 Q44 76 76 68" fill="none" stroke-width="2"/>' +
    '<circle cx="34" cy="52" r="3.2" fill="#454640" stroke="none"/>') },
  { id: "caracol", nome: "Caracol", svg: adesivoSvg(
    '<path d="M44 78 Q56 80 70 70 Q82 60 80 48" fill="none" stroke-width="9" stroke="#D8C3A5"/>' +
    '<circle cx="44" cy="62" r="24" fill="#D8A86E"/>' +
    '<path d="M44 62 m0 -18 a18 18 0 1 1 -12 31 a12 12 0 1 1 16 -20 a7 7 0 1 0 -8 10" fill="none" stroke-width="2.6"/>' +
    '<circle cx="82" cy="44" r="3" fill="#454640" stroke="none"/>' +
    '<path d="M80 48 L76 36 M84 46 L88 34" fill="none" stroke-width="2"/>') },
  { id: "joaninha", nome: "Joaninha", svg: adesivoSvg(
    '<ellipse cx="50" cy="56" rx="30" ry="26" fill="#D8705F"/>' +
    '<path d="M50 30 V82" fill="none"/>' +
    '<circle cx="36" cy="46" r="5" fill="#454640" stroke="none"/><circle cx="64" cy="46" r="5" fill="#454640" stroke="none"/>' +
    '<circle cx="34" cy="64" r="4.4" fill="#454640" stroke="none"/><circle cx="66" cy="64" r="4.4" fill="#454640" stroke="none"/>' +
    '<path d="M24 38 A26 26 0 0 1 76 38 Z" fill="#454640"/>' +
    '<path d="M40 26 L34 12 M60 26 L66 12" fill="none" stroke-width="2.4"/>' +
    '<circle cx="34" cy="12" r="3" fill="#454640" stroke="none"/><circle cx="66" cy="12" r="3" fill="#454640" stroke="none"/>') },
  { id: "libelula", nome: "Libélula", svg: adesivoSvg(
    '<ellipse cx="30" cy="36" rx="22" ry="8" transform="rotate(-14 30 36)" fill="#CFE3EA"/>' +
    '<ellipse cx="70" cy="36" rx="22" ry="8" transform="rotate(14 70 36)" fill="#CFE3EA"/>' +
    '<ellipse cx="32" cy="56" rx="18" ry="7" transform="rotate(12 32 56)" fill="#DCE9EF"/>' +
    '<ellipse cx="68" cy="56" rx="18" ry="7" transform="rotate(-12 68 56)" fill="#DCE9EF"/>' +
    '<rect x="46" y="22" width="8" height="62" rx="4" fill="#7FA3AA"/>' +
    '<circle cx="50" cy="20" r="9" fill="#6B8F96"/>' +
    '<circle cx="46" cy="18" r="2.4" fill="#454640" stroke="none"/><circle cx="54" cy="18" r="2.4" fill="#454640" stroke="none"/>') },
  { id: "ovelha", nome: "Ovelha", svg: adesivoSvg(
    '<g fill="#FBF6EE"><circle cx="30" cy="48" r="14"/><circle cx="34" cy="70" r="13"/><circle cx="52" cy="38" r="15"/>' +
    '<circle cx="70" cy="50" r="14"/><circle cx="60" cy="70" r="14"/><circle cx="48" cy="58" r="18"/></g>' +
    '<ellipse cx="50" cy="56" rx="13" ry="14" fill="#4A4F52"/>' +
    '<circle cx="45" cy="54" r="2.6" fill="#FBF6EE" stroke="none"/><circle cx="55" cy="54" r="2.6" fill="#FBF6EE" stroke="none"/>' +
    '<ellipse cx="34" cy="52" rx="7" ry="5" transform="rotate(-20 34 52)" fill="#4A4F52"/>' +
    '<ellipse cx="66" cy="52" rx="7" ry="5" transform="rotate(20 66 52)" fill="#4A4F52"/>') },
  { id: "coruja", nome: "Coruja", svg: adesivoSvg(
    '<path d="M50 18 Q80 24 78 52 Q76 82 50 86 Q24 82 22 52 Q20 24 50 18 Z" fill="#A98363"/>' +
    '<circle cx="38" cy="46" r="13" fill="#F3E7D6"/><circle cx="62" cy="46" r="13" fill="#F3E7D6"/>' +
    '<circle cx="38" cy="46" r="5.5" fill="#454640" stroke="none"/><circle cx="62" cy="46" r="5.5" fill="#454640" stroke="none"/>' +
    '<path d="M44 58 L50 66 L56 58 Z" fill="#F2A65A" stroke="none"/>' +
    '<path d="M32 72 Q50 80 68 72" fill="none" stroke-width="2"/>' +
    '<path d="M26 26 L34 34 M74 26 L66 34" fill="none" stroke-width="3"/>') },
  { id: "polvo", nome: "Polvo", svg: adesivoSvg(
    '<path d="M12 78 Q18 58 26 66 M30 82 Q32 60 40 68 M70 82 Q68 60 60 68 M88 78 Q82 58 74 66" fill="none" stroke-width="7" stroke="#C98BA8"/>' +
    '<path d="M22 60 Q22 24 50 24 Q78 24 78 60 Q62 72 50 72 Q38 72 22 60 Z" fill="#D89AB4"/>' +
    '<circle cx="40" cy="48" r="3.4" fill="#454640" stroke="none"/><circle cx="60" cy="48" r="3.4" fill="#454640" stroke="none"/>' +
    '<path d="M44 58 Q50 63 56 58" fill="none" stroke-width="2"/>') },
  /* ---------- plantas ---------- */
  { id: "folha", nome: "Folha", svg: adesivoSvg(
    '<path d="M50 88 Q46 56 68 30 Q86 14 88 16 Q90 46 72 66 Q58 82 50 88 Z" fill="#7E9B84"/>' +
    '<path d="M50 88 Q58 56 86 18" fill="none" stroke-width="2"/>') },
  { id: "ramo", nome: "Raminho", svg: adesivoSvg(
    '<path d="M50 90 V18" fill="none" stroke-width="3.4" stroke="#6FA37E"/>' +
    '<g fill="#9CC9A0"><ellipse cx="34" cy="34" rx="13" ry="7" transform="rotate(-24 34 34)"/>' +
    '<ellipse cx="66" cy="44" rx="13" ry="7" transform="rotate(24 66 44)"/>' +
    '<ellipse cx="34" cy="56" rx="13" ry="7" transform="rotate(-24 34 56)"/>' +
    '<ellipse cx="66" cy="68" rx="13" ry="7" transform="rotate(24 66 68)"/></g>') },
  { id: "monstera", nome: "Costela-de-adão", svg: adesivoSvg(
    '<path d="M50 92 Q50 72 46 58" fill="none" stroke-width="3.4" stroke="#6FA37E"/>' +
    '<path d="M46 60 Q12 54 14 34 Q16 12 46 10 Q78 10 84 32 Q90 54 46 60 Z" fill="#7E9B84"/>' +
    '<path d="M46 12 V58 M46 24 H20 M46 38 H16 M46 50 H24 M46 24 H74 M46 38 H80 M46 50 H70" fill="none" stroke-width="2.6" stroke="#FBF6EE"/>') },
  { id: "cacto", nome: "Cacto", svg: adesivoSvg(
    '<path d="M24 86 H76 L72 94 H28 Z" fill="#C98B6A"/>' +
    '<path d="M30 86 V62 Q30 52 40 52 Q46 52 46 62 V70" fill="none" stroke-width="12" stroke="#7E9B84"/>' +
    '<path d="M72 86 V54 Q72 42 62 42 Q56 42 56 52 V62" fill="none" stroke-width="12" stroke="#7E9B84"/>' +
    '<rect x="40" y="24" width="20" height="62" rx="10" fill="#8FAE95"/>' +
    '<circle cx="50" cy="20" r="7" fill="#E8918F"/>') },
  { id: "suculenta", nome: "Suculenta", svg: adesivoSvg(
    '<path d="M26 60 H74 L68 90 H32 Z" fill="#C98B6A"/>' +
    '<g fill="#9CC9A0"><ellipse cx="50" cy="26" rx="8" ry="16"/>' +
    '<ellipse cx="30" cy="40" rx="8" ry="16" transform="rotate(-42 30 40)"/>' +
    '<ellipse cx="70" cy="40" rx="8" ry="16" transform="rotate(42 70 40)"/>' +
    '<ellipse cx="38" cy="52" rx="7" ry="12" transform="rotate(-20 38 52)"/>' +
    '<ellipse cx="62" cy="52" rx="7" ry="12" transform="rotate(20 62 52)"/></g>') },
  { id: "cogumelo", nome: "Cogumelo", svg: adesivoSvg(
    '<path d="M40 56 Q38 80 34 88 H66 Q62 80 60 56 Z" fill="#F3E7D6"/>' +
    '<path d="M12 56 Q16 18 50 18 Q84 18 88 56 Z" fill="#C96A5E"/>' +
    '<g fill="#FBF6EE" stroke="none"><circle cx="34" cy="40" r="7"/><circle cx="60" cy="34" r="5.5"/>' +
    '<circle cx="70" cy="48" r="6"/><circle cx="46" cy="50" r="4.5"/></g>') },
  { id: "pinha", nome: "Pinha", svg: adesivoSvg(
    '<path d="M50 10 Q34 16 32 28 M50 10 Q66 16 68 28" fill="none" stroke-width="3" stroke="#6FA37E"/>' +
    '<path d="M50 92 Q22 70 24 44 Q26 22 50 22 Q74 22 76 44 Q78 70 50 92 Z" fill="#A98363"/>' +
    '<path d="M32 38 H68 M28 52 H72 M34 66 H66 M50 22 V92 M38 30 L44 44 L38 58 L44 72 M62 30 L56 44 L62 58 L56 72" fill="none" stroke-width="2"/>') },
  { id: "trevo", nome: "Trevo", svg: adesivoSvg(
    '<path d="M50 56 Q58 76 54 92" fill="none" stroke-width="3.4" stroke="#6FA37E"/>' +
    '<g fill="#8FAE95"><path d="M48 52 Q24 52 24 36 Q24 22 40 24 Q50 26 48 52 Z"/>' +
    '<path d="M52 52 Q76 52 76 36 Q76 22 60 24 Q50 26 52 52 Z"/>' +
    '<path d="M48 54 Q30 64 34 78 Q38 90 50 82 Q56 76 48 54 Z"/>' +
    '<path d="M52 54 Q70 64 66 78 Q62 90 50 82 Q44 76 52 54 Z"/></g>') },
  { id: "margarida", nome: "Margarida", svg: adesivoSvg(
    '<path d="M50 58 V92" fill="none" stroke-width="3.4" stroke="#6FA37E"/>' +
    '<ellipse cx="34" cy="76" rx="12" ry="6" transform="rotate(-22 34 76)" fill="#9CC9A0"/>' +
    '<g fill="#FBF6EE"><ellipse cx="50" cy="22" rx="7" ry="15"/><ellipse cx="50" cy="58" rx="7" ry="15"/>' +
    '<ellipse cx="32" cy="40" rx="15" ry="7"/><ellipse cx="68" cy="40" rx="15" ry="7"/>' +
    '<ellipse cx="37" cy="27" rx="7" ry="14" transform="rotate(-45 37 27)"/>' +
    '<ellipse cx="63" cy="53" rx="7" ry="14" transform="rotate(-45 63 53)"/>' +
    '<ellipse cx="63" cy="27" rx="7" ry="14" transform="rotate(45 63 27)"/>' +
    '<ellipse cx="37" cy="53" rx="7" ry="14" transform="rotate(45 37 53)"/></g>' +
    '<circle cx="50" cy="40" r="10" fill="#F5C945"/>') },
  { id: "tulipa", nome: "Tulipa", svg: adesivoSvg(
    '<path d="M50 50 V92" fill="none" stroke-width="3.4" stroke="#6FA37E"/>' +
    '<path d="M50 84 Q30 80 26 62 Q42 60 50 78" fill="#9CC9A0"/>' +
    '<path d="M26 34 Q26 16 34 12 Q40 24 50 24 Q60 24 66 12 Q74 16 74 34 Q74 56 50 58 Q26 56 26 34 Z" fill="#E09AA8"/>' +
    '<path d="M50 24 V58" fill="none" stroke-width="2"/>') },
  { id: "lavanda", nome: "Lavanda", svg: adesivoSvg(
    '<path d="M50 92 V46" fill="none" stroke-width="3.4" stroke="#6FA37E"/>' +
    '<g fill="#B8A8D8" stroke-width="2"><ellipse cx="50" cy="14" rx="6" ry="9"/>' +
    '<ellipse cx="40" cy="26" rx="6" ry="9"/><ellipse cx="60" cy="26" rx="6" ry="9"/>' +
    '<ellipse cx="50" cy="32" rx="6" ry="9"/><ellipse cx="39" cy="44" rx="6" ry="9"/>' +
    '<ellipse cx="61" cy="44" rx="6" ry="9"/><ellipse cx="50" cy="50" rx="6" ry="9"/></g>' +
    '<path d="M50 70 Q34 68 30 56 Q44 54 50 66" fill="#9CC9A0"/>') },
  { id: "dente", nome: "Dente-de-leão", svg: adesivoSvg(
    '<path d="M44 92 Q44 62 48 44" fill="none" stroke-width="3.4" stroke="#6FA37E"/>' +
    '<g fill="none" stroke-width="2" stroke="#A8AFA4">' +
    '<path d="M48 34 L48 10 M48 34 L30 18 M48 34 L66 18 M48 34 L26 34 M48 34 L70 34 M48 34 L30 50 M48 34 L66 50 M48 34 L38 12 M48 34 L58 12"/></g>' +
    '<circle cx="48" cy="34" r="6" fill="#E8E2D6"/>' +
    '<g fill="#F0ECE2" stroke="none"><circle cx="48" cy="10" r="3.4"/><circle cx="30" cy="18" r="3.4"/>' +
    '<circle cx="66" cy="18" r="3.4"/><circle cx="26" cy="34" r="3.4"/><circle cx="70" cy="34" r="3.4"/>' +
    '<circle cx="30" cy="50" r="3.4"/><circle cx="66" cy="50" r="3.4"/><circle cx="38" cy="12" r="3"/>' +
    '<circle cx="58" cy="12" r="3"/><circle cx="82" cy="24" r="3"/><circle cx="88" cy="44" r="2.6"/></g>') },
  { id: "vaso", nome: "Vasinho", svg: adesivoSvg(
    '<path d="M50 54 V36 M50 48 Q34 46 32 32 Q46 30 50 44 M50 44 Q54 28 68 28 Q68 44 50 50" fill="none" stroke-width="3" stroke="#7E9B84"/>' +
    '<path d="M24 56 H76 L68 90 H32 Z" fill="#D8A88E"/>' +
    '<rect x="20" y="48" width="60" height="10" rx="5" fill="#C98B6A"/>') },
  /* ---------- ceu e tempo ---------- */
  { id: "chuva", nome: "Chuva", svg: adesivoSvg(
    '<path d="M26 54 A13 13 0 0 1 28 28 A19 19 0 0 1 64 23 A16 16 0 0 1 75 54 Z" fill="#C6D7DE"/>' +
    '<g fill="#7FB0D8" stroke-width="2"><path d="M34 64 Q30 74 34 78 Q40 78 38 70 Z"/>' +
    '<path d="M52 68 Q48 78 52 82 Q58 82 56 74 Z"/><path d="M68 62 Q64 72 68 76 Q74 76 72 68 Z"/></g>') },
  { id: "gota", nome: "Gota", svg: adesivoSvg(
    '<path d="M50 12 Q78 48 78 62 Q78 86 50 86 Q22 86 22 62 Q22 48 50 12 Z" fill="#9EBBC0"/>' +
    '<path d="M38 64 Q38 76 48 78" fill="none" stroke-width="3" stroke="#E4EEF0"/>') },
  { id: "floco", nome: "Floco de neve", svg: adesivoSvg(
    '<g fill="none" stroke="#9EBBC0" stroke-width="4">' +
    '<path d="M50 10 V90 M15 30 L85 70 M15 70 L85 30"/>' +
    '<path d="M50 22 L42 30 M50 22 L58 30 M50 78 L42 70 M50 78 L58 70 M26 36 L26 46 M26 36 L36 34 M74 64 L74 54 M74 64 L64 66 M26 64 L36 66 M26 64 L26 54 M74 36 L64 34 M74 36 L74 46"/></g>') },
  { id: "montanha", nome: "Montanha", svg: adesivoSvg(
    '<circle cx="76" cy="24" r="9" fill="#F5C945"/>' +
    '<path d="M6 78 L34 32 L50 56 L62 38 L94 78 Z" fill="#8FA0A8"/>' +
    '<path d="M34 32 L44 48 Q38 44 32 48 Q28 44 24 48 Z" fill="#FBF6EE"/>' +
    '<path d="M62 38 L70 50 Q64 46 58 50 Z" fill="#FBF6EE"/>') },
  /* ---------- papelaria e casa ---------- */
  { id: "cafe", nome: "Café", svg: adesivoSvg(
    '<path d="M42 16 Q38 24 42 30 M52 14 Q48 22 52 28 M62 16 Q58 24 62 30" fill="none" stroke-width="2.6" stroke="#C6C0B6"/>' +
    '<path d="M74 48 Q90 48 90 60 Q90 72 74 72" fill="none" stroke-width="5" stroke="#C98B6A"/>' +
    '<path d="M20 40 H76 L70 84 H26 Z" fill="#E6DFD3"/>' +
    '<path d="M22 42 H74 L73 52 H23 Z" fill="#8A6A4F" stroke="none"/>' +
    '<path d="M20 40 H76 L70 84 H26 Z" fill="none"/>') },
  { id: "cha", nome: "Chá", svg: adesivoSvg(
    '<path d="M48 14 Q44 22 48 30 M60 16 Q56 24 60 32" fill="none" stroke-width="2.6" stroke="#C6C0B6"/>' +
    '<path d="M78 48 Q92 48 92 58 Q92 68 78 66" fill="none" stroke-width="5" stroke="#9EBBC0"/>' +
    '<path d="M22 42 Q22 76 50 76 Q78 76 78 42 Z" fill="#FBF6EE"/>' +
    '<path d="M28 46 Q30 62 50 62 Q70 62 72 46 Z" fill="#C8A86A" stroke="none"/>' +
    '<path d="M22 42 Q22 76 50 76 Q78 76 78 42 Z" fill="none"/>' +
    '<ellipse cx="50" cy="86" rx="30" ry="7" fill="#D8D3C8"/>') },
  { id: "livro", nome: "Livro", svg: adesivoSvg(
    '<path d="M50 28 Q34 18 12 22 V76 Q34 72 50 82 Q66 72 88 76 V22 Q66 18 50 28 Z" fill="#FBF6EE"/>' +
    '<path d="M12 22 Q34 18 50 28 V82 Q34 72 12 76 Z" fill="#E2DCD0" stroke="none"/>' +
    '<path d="M50 28 Q34 18 12 22 V76 Q34 72 50 82 Q66 72 88 76 V22 Q66 18 50 28 Z" fill="none"/>' +
    '<path d="M50 28 V82" fill="none"/>' +
    '<path d="M20 36 H40 M20 48 H40 M60 36 H80 M60 48 H80" fill="none" stroke-width="2" stroke="#B6B0A4"/>') },
  { id: "caderno", nome: "Caderno", svg: adesivoSvg(
    '<rect x="22" y="12" width="58" height="76" rx="5" fill="#E8B9A8"/>' +
    '<rect x="32" y="12" width="48" height="76" rx="5" fill="#FBF6EE"/>' +
    '<path d="M42 30 H70 M42 44 H70 M42 58 H62" fill="none" stroke-width="2.4" stroke="#C6C0B6"/>' +
    '<g stroke-width="3"><path d="M22 22 H34 M22 36 H34 M22 50 H34 M22 64 H34 M22 78 H34"/></g>') },
  { id: "lapis", nome: "Lápis", svg: adesivoSvg(
    '<path d="M18 86 L26 62 L72 16 L86 30 L40 76 Z" fill="#F2C87A"/>' +
    '<path d="M18 86 L26 62 L32 68 Z" fill="#F3E7D6"/>' +
    '<path d="M18 86 L22 74 L30 82 Z" fill="#454640" stroke="none"/>' +
    '<path d="M72 16 L86 30 L78 38 L64 24 Z" fill="#E08C7E"/>') },
  { id: "clipe", nome: "Clipe", svg: adesivoSvg(
    '<path d="M34 78 V34 A14 14 0 0 1 62 34 V76 A9 9 0 0 1 44 76 V40" fill="none" stroke-width="7" stroke="#9EBBC0"/>') },
  { id: "fita", nome: "Laço", svg: adesivoSvg(
    '<path d="M44 60 L30 90 M56 60 L70 90" fill="none" stroke-width="7" stroke="#C98BA0"/>' +
    '<path d="M50 62 Q24 62 20 44 Q18 28 34 28 Q48 28 50 56 Z" fill="#D8A0B2"/>' +
    '<path d="M50 62 Q76 62 80 44 Q82 28 66 28 Q52 28 50 56 Z" fill="#D8A0B2"/>' +
    '<circle cx="50" cy="60" r="9" fill="#E8B9C4"/>') },
  { id: "selo", nome: "Selo", svg: adesivoSvg(
    '<path d="M16 18 H84 V82 H16 Z" fill="#FBF6EE" stroke-dasharray="6 5"/>' +
    '<rect x="26" y="28" width="48" height="44" rx="3" fill="#B8C9D2"/>' +
    '<circle cx="62" cy="38" r="5" fill="#F5C945" stroke="none"/>' +
    '<path d="M26 64 L40 46 L50 58 L60 42 L74 64 Z" fill="#7E9B84" stroke="none"/>' +
    '<rect x="26" y="28" width="48" height="44" rx="3" fill="none"/>') },
  { id: "envelope", nome: "Envelope", svg: adesivoSvg(
    '<rect x="10" y="26" width="80" height="52" rx="5" fill="#F3E7D6"/>' +
    '<path d="M10 30 L50 58 L90 30" fill="none"/>' +
    '<path d="M10 74 L38 50 M90 74 L62 50" fill="none" stroke-width="2"/>') },
  { id: "oculos", nome: "Óculos", svg: adesivoSvg(
    '<circle cx="28" cy="54" r="18" fill="#DCE9EF"/><circle cx="72" cy="54" r="18" fill="#DCE9EF"/>' +
    '<path d="M46 52 Q50 46 54 52" fill="none"/>' +
    '<path d="M10 46 Q6 40 12 36 M90 46 Q94 40 88 36" fill="none" stroke-width="3"/>') },
  { id: "vela", nome: "Vela", svg: adesivoSvg(
    '<path d="M50 14 Q58 24 58 30 Q58 38 50 38 Q42 38 42 30 Q42 24 50 14 Z" fill="#F5C945"/>' +
    '<path d="M50 38 V44" fill="none" stroke-width="2"/>' +
    '<rect x="34" y="44" width="32" height="40" rx="4" fill="#F3E7D6"/>' +
    '<ellipse cx="50" cy="84" rx="26" ry="7" fill="#D8C3A5"/>') },
  { id: "chave", nome: "Chave", svg: adesivoSvg(
    '<path d="M44 50 L80 86" fill="none" stroke-width="8" stroke="#D8C3A5"/>' +
    '<path d="M62 68 L72 58 M72 78 L82 68" fill="none" stroke-width="6" stroke="#D8C3A5"/>' +
    '<circle cx="32" cy="38" r="18" fill="#D8C3A5"/><circle cx="32" cy="38" r="7" fill="#FBF6EE"/>') },
  { id: "relogio", nome: "Relógio", svg: adesivoSvg(
    '<path d="M38 14 L30 24 M62 14 L70 24" fill="none" stroke-width="5" stroke="#D8C3A5"/>' +
    '<circle cx="32" cy="18" r="7" fill="#D8C3A5"/><circle cx="68" cy="18" r="7" fill="#D8C3A5"/>' +
    '<circle cx="50" cy="54" r="34" fill="#F3E7D6"/><circle cx="50" cy="54" r="27" fill="#FBF6EE"/>' +
    '<path d="M50 54 V36 M50 54 L64 62" fill="none" stroke-width="3"/>' +
    '<circle cx="50" cy="54" r="3" fill="#454640" stroke="none"/>') },
  { id: "disco", nome: "Disco", svg: adesivoSvg(
    '<circle cx="50" cy="50" r="38" fill="#3F4A52"/>' +
    '<circle cx="50" cy="50" r="28" fill="none" stroke="#6A757C" stroke-width="1.6"/>' +
    '<circle cx="50" cy="50" r="21" fill="none" stroke="#6A757C" stroke-width="1.6"/>' +
    '<circle cx="50" cy="50" r="13" fill="#E8918F"/><circle cx="50" cy="50" r="3.4" fill="#FBF6EE" stroke="none"/>') },
  { id: "bule", nome: "Bule", svg: adesivoSvg(
    '<path d="M18 50 Q6 54 10 64 Q14 72 24 70" fill="none" stroke-width="5" stroke="#9EBBC0"/>' +
    '<path d="M78 52 Q92 54 92 64 Q92 74 78 72" fill="none" stroke-width="5" stroke="#9EBBC0"/>' +
    '<path d="M20 48 H80 Q84 76 68 84 H32 Q16 76 20 48 Z" fill="#9EBBC0"/>' +
    '<rect x="34" y="40" width="32" height="9" rx="4" fill="#7FA3AA"/>' +
    '<circle cx="50" cy="34" r="6" fill="#7FA3AA"/>') },
  { id: "casinha", nome: "Casinha", svg: adesivoSvg(
    '<path d="M22 50 V86 H78 V50 Z" fill="#F3E7D6"/>' +
    '<path d="M10 52 L50 16 L90 52 Z" fill="#C96A5E"/>' +
    '<rect x="42" y="62" width="18" height="24" rx="2" fill="#A98363"/>' +
    '<rect x="26" y="58" width="12" height="12" rx="2" fill="#B8C9D2"/>' +
    '<rect x="64" y="58" width="12" height="12" rx="2" fill="#B8C9D2"/>') },
  { id: "balao", nome: "Balão", svg: adesivoSvg(
    '<path d="M50 70 Q58 78 46 84 Q36 90 44 96" fill="none" stroke-width="2"/>' +
    '<path d="M46 62 H54 L50 70 Z" fill="#E8918F"/>' +
    '<path d="M50 62 Q24 50 24 34 Q24 14 50 14 Q76 14 76 34 Q76 50 50 62 Z" fill="#E8918F"/>') },
  { id: "concha", nome: "Concha", svg: adesivoSvg(
    '<path d="M50 84 Q12 72 14 42 Q16 16 50 16 Q84 16 86 42 Q88 72 50 84 Z" fill="#F0D6C4"/>' +
    '<path d="M50 84 V16 M50 84 Q30 60 28 24 M50 84 Q70 60 72 24 M50 84 Q38 56 40 18 M50 84 Q62 56 60 18" fill="none" stroke-width="2"/>') },
  { id: "mel", nome: "Mel", svg: adesivoSvg(
    '<path d="M38 30 V18 H62 V30" fill="none" stroke-width="3"/>' +
    '<path d="M30 30 H70 L74 44 H26 Z" fill="#E0A84E"/>' +
    '<path d="M26 44 H74 V84 Q50 92 26 84 Z" fill="#F2C87A"/>' +
    '<path d="M34 54 L40 60 L34 66 L40 72 M60 54 L54 60 L60 66 L54 72" fill="none" stroke-width="2.6"/>') },
  { id: "pedrinha", nome: "Pedrinha", svg: adesivoSvg(
    '<path d="M18 62 Q14 38 36 28 Q60 18 78 36 Q92 52 76 70 Q58 86 36 80 Q20 76 18 62 Z" fill="#B6BBBE"/>' +
    '<path d="M34 44 Q48 36 62 44" fill="none" stroke-width="2.4" stroke="#8A9094"/>' +
    '<path d="M30 58 Q50 50 70 60" fill="none" stroke-width="2.4" stroke="#8A9094"/>') },
  { id: "bussola", nome: "Bússola", svg: adesivoSvg(
    '<circle cx="50" cy="50" r="36" fill="#E6DFD3"/><circle cx="50" cy="50" r="28" fill="#FBF6EE"/>' +
    '<path d="M50 74 L42 50 L50 26 Z" fill="#DCE9EF" stroke="none"/>' +
    '<path d="M50 26 L58 50 L50 74 Z" fill="#C96A5E" stroke="none"/>' +
    '<path d="M50 26 L58 50 L50 74 L42 50 Z" fill="none"/>' +
    '<circle cx="50" cy="50" r="3" fill="#454640" stroke="none"/>') },
  { id: "barco", nome: "Barquinho", svg: adesivoSvg(
    '<path d="M50 14 V62" fill="none"/>' +
    '<path d="M50 20 L78 58 H50 Z" fill="#E8B9A8"/>' +
    '<path d="M46 26 L22 58 H46 Z" fill="#F3E7D6"/>' +
    '<path d="M12 62 H88 L76 84 H24 Z" fill="#A98363"/>' +
    '<path d="M8 92 Q22 86 36 92 Q50 98 64 92 Q78 86 92 92" fill="none" stroke-width="3" stroke="#9EBBC0"/>') },
  { id: "musica", nome: "Música", svg: adesivoSvg(
    '<path d="M38 74 V22 L74 14 V62" fill="none" stroke-width="4"/>' +
    '<path d="M38 36 L74 28" fill="none" stroke-width="4"/>' +
    '<ellipse cx="28" cy="76" rx="13" ry="10" transform="rotate(-18 28 76)" fill="#B8A8D8"/>' +
    '<ellipse cx="64" cy="64" rx="13" ry="10" transform="rotate(-18 64 64)" fill="#B8A8D8"/>') }
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
