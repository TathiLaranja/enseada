/* Enseada - regras das fotos (funcoes puras, sem tela e sem gravacao).
   A foto e reduzida e regravada como JPEG no proprio aparelho, o que apaga a
   localizacao e os outros dados escondidos da foto original. Nada e enviado. */

var FOTO_LADO_MAXIMO = 900;
var FOTO_QUALIDADE = 0.72;

/* Novo tamanho: o lado maior vira no maximo `maximo`; foto pequena nao cresce. */
function tamanhoReduzido(largura, altura, maximo) {
  var maior = Math.max(largura, altura);
  if (maior <= maximo) { return { largura: largura, altura: altura }; }
  var f = maximo / maior;
  return { largura: Math.max(1, Math.round(largura * f)), altura: Math.max(1, Math.round(altura * f)) };
}

function podeGuardarMais(lista, maximo) {
  return lista.length < maximo;
}

function novaFoto(dados, id) {
  if (typeof dados !== "string" || !/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(dados)) { return null; }
  return { id: id, dados: dados };
}

function tirarFoto(lista, id) {
  return lista.filter(function (f) { return f.id !== id; });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FOTO_LADO_MAXIMO: FOTO_LADO_MAXIMO,
    FOTO_QUALIDADE: FOTO_QUALIDADE,
    tamanhoReduzido: tamanhoReduzido,
    podeGuardarMais: podeGuardarMais,
    novaFoto: novaFoto,
    tirarFoto: tirarFoto
  };
}
