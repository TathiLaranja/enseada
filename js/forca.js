/* Enseada - regras da Forca sem forca (funcoes puras, sem tela e sem gravacao).
   E a forca de sempre, menos a forca: nao ha boneco, nao ha numero de erros e
   nao ha perder. A pessoa chuta letra ate descobrir a palavra, no tempo dela.
   A letra errada so entra na lista de letras ja tentadas, para nao repetir.
   Tudo e texto, entao o jogo funciona inteiro com leitor de tela. */

var FORCA_ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function forcaNormalizar(texto) {
  return String(texto || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toUpperCase().replace(/[^A-Z]/g, "");
}

function forcaNova(banco, sorteio) {
  var r = typeof sorteio === "function" ? sorteio : Math.random;
  var item = banco[Math.floor(r() * banco.length)];
  return { resposta: forcaNormalizar(item.resposta), dica: item.dica, tentadas: [] };
}

/* Chuta uma letra. Letra repetida ou coisa que nao e letra nao muda nada. */
function forcaTentar(estado, letra) {
  var l = forcaNormalizar(letra);
  if (l.length !== 1) { return estado; }
  if (estado.tentadas.indexOf(l) !== -1) { return estado; }
  return {
    resposta: estado.resposta, dica: estado.dica,
    tentadas: estado.tentadas.concat([l])
  };
}

function forcaTemLetra(estado, letra) {
  return estado.resposta.indexOf(forcaNormalizar(letra)) !== -1;
}

/* Letras ja tentadas que estao na palavra, e as que nao estao. */
function forcaCertas(estado) {
  return estado.tentadas.filter(function (l) { return forcaTemLetra(estado, l); });
}

function forcaErradas(estado) {
  return estado.tentadas.filter(function (l) { return !forcaTemLetra(estado, l); });
}

function forcaPista(estado) {
  return estado.resposta.split("").map(function (l) {
    return estado.tentadas.indexOf(l) !== -1 ? l : "_";
  }).join(" ");
}

function forcaAcertou(estado) {
  return estado.resposta.split("").every(function (l) {
    return estado.tentadas.indexOf(l) !== -1;
  });
}

/* A dica revela uma letra que ainda falta, a primeira da esquerda. */
function forcaDica(estado) {
  var i;
  for (i = 0; i < estado.resposta.length; i++) {
    if (estado.tentadas.indexOf(estado.resposta[i]) === -1) {
      return forcaTentar(estado, estado.resposta[i]);
    }
  }
  return estado;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FORCA_ALFABETO: FORCA_ALFABETO,
    forcaNormalizar: forcaNormalizar,
    forcaNova: forcaNova,
    forcaTentar: forcaTentar,
    forcaTemLetra: forcaTemLetra,
    forcaCertas: forcaCertas,
    forcaErradas: forcaErradas,
    forcaPista: forcaPista,
    forcaAcertou: forcaAcertou,
    forcaDica: forcaDica
  };
}
