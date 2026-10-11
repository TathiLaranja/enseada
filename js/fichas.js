/* Enseada - as fichas redondas do jogo da memoria "Pequenos Tesouros".
   Todas saem de UMA imagem (public/images/jogo-memoria.jpg): cada ficha e um
   recorte circular dessa folha, guardado aqui como centro e raio em pixels da
   imagem. Nenhum arquivo por ficha e nada vem da rede.
   A folha original tem duas fichas iguais (o camundongo); so uma entra. */

var FICHAS_IMAGEM = "public/images/jogo-memoria.jpg";
var FICHAS_LARGURA = 1079;
var FICHAS_ALTURA = 1080;
var FICHAS_RAIO = 82;

var FICHAS = [
  { id: "beterraba", nome: "beterraba", cx: 196, cy: 138 },
  { id: "bolota", nome: "folha de carvalho com bolota", cx: 374, cy: 126 },
  { id: "casinha", nome: "casinha de passarinho", cx: 556, cy: 128 },
  { id: "lagarta", nome: "lagarta", cx: 750, cy: 138 },
  { id: "libelula", nome: "libélula", cx: 936, cy: 132 },
  { id: "limoes", nome: "limões", cx: 184, cy: 326 },
  { id: "borboleta", nome: "borboleta", cx: 376, cy: 318 },
  { id: "ourico", nome: "ouriço", cx: 558, cy: 320 },
  { id: "miosotis", nome: "flores azuis", cx: 756, cy: 322 },
  { id: "amanita", nome: "cogumelo vermelho", cx: 938, cy: 328 },
  { id: "coelho", nome: "coelhinho", cx: 180, cy: 530 },
  { id: "pisco", nome: "passarinho com minhoca", cx: 372, cy: 518 },
  { id: "framboesas", nome: "framboesas", cx: 558, cy: 502 },
  { id: "camundongo", nome: "camundongo", cx: 740, cy: 516 },
  { id: "caracol", nome: "caracol", cx: 928, cy: 506 },
  { id: "cogumelo", nome: "cogumelo marrom", cx: 156, cy: 726 },
  { id: "regador", nome: "regador", cx: 346, cy: 712 },
  { id: "formiga", nome: "formiga", cx: 538, cy: 712 },
  { id: "laranjas", nome: "cogumelos laranja", cx: 734, cy: 722 },
  { id: "gafanhoto", nome: "gafanhoto", cx: 942, cy: 708 },
  { id: "abelha", nome: "abelha", cx: 182, cy: 912 },
  { id: "joaninha", nome: "joaninha no trevo", cx: 344, cy: 906 },
  { id: "margaridas", nome: "margaridas", cx: 722, cy: 906 },
  { id: "esquilo", nome: "esquilo", cx: 914, cy: 896 }
];

/* Colecoes: cada partida usa fichas de UM tema, para as cartas combinarem entre si
   e a pessoa se acostumar com o conjunto. O sorteio escolhe quais do tema entram. */
var FICHAS_PARES_POR_PARTIDA = 8;

var FICHAS_TEMAS = [
  { id: "bichinhos", nome: "Bichinhos", fichas: ["borboleta", "ourico", "coelho", "pisco", "camundongo", "caracol", "formiga", "gafanhoto", "abelha", "joaninha", "esquilo", "lagarta", "libelula"] },
  { id: "jardim", nome: "Jardim e horta", fichas: ["beterraba", "bolota", "limoes", "miosotis", "framboesas", "margaridas", "amanita", "cogumelo", "laranjas", "regador", "casinha"] },
  { id: "misturado", nome: "Tudo misturado", fichas: null }
];

function fichasDoTema(temaId) {
  var tema = FICHAS_TEMAS.filter(function (t) { return t.id === temaId; })[0] || FICHAS_TEMAS[0];
  if (!tema.fichas) { return FICHAS.map(function (f) { return f.id; }); }
  return tema.fichas.slice();
}

function fichaPorId(id) {
  for (var i = 0; i < FICHAS.length; i++) { if (FICHAS[i].id === id) { return FICHAS[i]; } }
  return null;
}

/* Estilo CSS que mostra so a ficha, qualquer que seja o tamanho do quadrado:
   tudo em porcentagem do proprio quadrado, entao serve em qualquer tela. */
function fichaEstilo(ficha) {
  var lado = 2 * FICHAS_RAIO;
  return {
    backgroundImage: "url(" + FICHAS_IMAGEM + ")",
    backgroundSize: ((FICHAS_LARGURA / lado) * 100).toFixed(2) + "% " + ((FICHAS_ALTURA / lado) * 100).toFixed(2) + "%",
    backgroundPosition: (((ficha.cx - FICHAS_RAIO) / (FICHAS_LARGURA - lado)) * 100).toFixed(2) + "% " +
      (((ficha.cy - FICHAS_RAIO) / (FICHAS_ALTURA - lado)) * 100).toFixed(2) + "%"
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FICHAS: FICHAS,
    FICHAS_IMAGEM: FICHAS_IMAGEM,
    FICHAS_LARGURA: FICHAS_LARGURA,
    FICHAS_ALTURA: FICHAS_ALTURA,
    FICHAS_RAIO: FICHAS_RAIO,
    FICHAS_TEMAS: FICHAS_TEMAS,
    FICHAS_PARES_POR_PARTIDA: FICHAS_PARES_POR_PARTIDA,
    fichasDoTema: fichasDoTema,
    fichaPorId: fichaPorId,
    fichaEstilo: fichaEstilo
  };
}
