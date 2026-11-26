/* Enseada - levar e trazer (funcoes puras, sem tela e sem gravacao).

   Isto e o mais perto de "rede" que o Enseada chega sem trair o que promete:
   a pessoa leva as ancoras dela num arquivo e a outra traz esse arquivo para
   dentro do app dela. Nao ha servidor, nao ha conta e nao ha nada guardado
   fora dos dois aparelhos.

   Tres regras que mandam aqui:
   1. Trazer NUNCA apaga e NUNCA sobrescreve. So acrescenta.
   2. O pacote de compartilhar leva SO as ancoras. O que ela escreveu, as
      fotos e o album nunca vao junto por engano.
   3. Arquivo estranho nao entra: o que nao for reconhecido e recusado
      inteiro, em vez de entrar pela metade. */

var LEVAR_VERSAO = 1;
var LEVAR_APP = "Enseada";

function levarTexto(v) {
  return typeof v === "string" ? v : "";
}

/* Duas ancoras sao a mesma se dizem a mesma coisa, ignorando espaco e caixa. */
function levarChave(a) {
  /* Cada campo e limpo ANTES de juntar: limpar depois deixa o espaco que
     sobrou colado no separador e duas ancoras iguais passam por diferentes. */
  function limpo(t) { return levarTexto(t).toLowerCase().replace(/\s+/g, " ").trim(); }
  return limpo(a.oQueE) + "\u0000" + limpo(a.oQueFaz);
}

function levarAncoraValida(a) {
  return !!a && typeof a === "object" &&
    typeof a.oQueE === "string" && a.oQueE.trim() !== "";
}

/* O pacote que sai para outra pessoa: so ancoras, nada mais. */
function levarPacoteDeAncoras(ancoras) {
  return {
    app: LEVAR_APP,
    versao: LEVAR_VERSAO,
    tipo: "ancoras",
    ancoras: (ancoras || []).filter(levarAncoraValida).map(function (a) {
      return {
        oQueE: a.oQueE,
        oQueFaz: levarTexto(a.oQueFaz),
        link: levarTexto(a.link),
        peso: a.peso === "pesada" ? "pesada" : "leve"
      };
    })
  };
}

/* Le o arquivo trazido. Serve tanto o pacote de ancoras quanto o arquivo
   inteiro que a Ajuda ja baixava. Qualquer outra coisa devolve null. */
function levarLer(texto) {
  var bruto;
  try { bruto = JSON.parse(texto); } catch (erro) { return null; }
  if (!bruto || typeof bruto !== "object") { return null; }

  if (Array.isArray(bruto.ancoras)) {
    var daLista = bruto.ancoras.filter(levarAncoraValida);
    return daLista.length > 0 ? { ancoras: daLista } : null;
  }
  return null;
}

/* Junta o que veio com o que ja existe. Nunca apaga, nunca sobrescreve e
   nunca repete: ancora igual a uma que ja esta la e simplesmente ignorada. */
function levarJuntar(atuais, trazidas, novoId) {
  var lista = (atuais || []).slice();
  var vistas = {};
  lista.forEach(function (a) { vistas[levarChave(a)] = true; });

  (trazidas || []).filter(levarAncoraValida).forEach(function (a) {
    var chave = levarChave(a);
    if (vistas[chave]) { return; }
    vistas[chave] = true;
    lista.push({
      id: novoId(),
      oQueE: a.oQueE,
      oQueFaz: levarTexto(a.oQueFaz),
      link: levarTexto(a.link),
      peso: a.peso === "pesada" ? "pesada" : "leve",
      estado: "ativa"
    });
  });
  return lista;
}

/* Quantas entrariam de verdade, para poder dizer antes de mexer em nada. */
function levarQuantasNovas(atuais, trazidas) {
  return levarJuntar(atuais, trazidas, function () { return "x"; }).length -
    (atuais || []).length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LEVAR_VERSAO: LEVAR_VERSAO,
    LEVAR_APP: LEVAR_APP,
    levarChave: levarChave,
    levarAncoraValida: levarAncoraValida,
    levarPacoteDeAncoras: levarPacoteDeAncoras,
    levarLer: levarLer,
    levarJuntar: levarJuntar,
    levarQuantasNovas: levarQuantasNovas
  };
}
