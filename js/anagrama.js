/* Enseada - regras do Anagrama (funcoes puras, sem tela e sem gravacao).
   Uma palavra por vez, com as letras fora de ordem e uma dica de texto.
   Sem cronometro, sem pontuacao e sem derrota: errar nao tira nada, so diz
   que ainda nao e essa. Quem trava pede dica, que revela a proxima letra.
   O jogo e todo de texto, entao funciona inteiro com leitor de tela. */

/* Tira acento e deixa maiusculo: a pessoa pode escrever do jeito dela. */
function anagramaNormalizar(texto) {
  return String(texto || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toUpperCase().replace(/[^A-Z]/g, "");
}

/* Embaralha as letras. Se o sorteio devolver a propria palavra, troca duas de
   lugar: entregar a resposta pronta nao e anagrama nenhum. */
function anagramaEmbaralhar(palavra, sorteio) {
  var r = typeof sorteio === "function" ? sorteio : Math.random;
  var letras = anagramaNormalizar(palavra).split("");
  for (var i = letras.length - 1; i > 0; i--) {
    var j = Math.floor(r() * (i + 1));
    var t = letras[i]; letras[i] = letras[j]; letras[j] = t;
  }
  var original = anagramaNormalizar(palavra);
  if (letras.join("") === original && original.length > 1) {
    var a = 0, b = original.length - 1;
    while (a < b && letras[a] === letras[b]) { b--; }
    if (a < b) { var x = letras[a]; letras[a] = letras[b]; letras[b] = x; }
  }
  return letras;
}

/* Palavra nova do banco. Devolve o estado inteiro do jogo. */
function anagramaNovo(banco, sorteio) {
  var r = typeof sorteio === "function" ? sorteio : Math.random;
  var item = banco[Math.floor(r() * banco.length)];
  return {
    resposta: anagramaNormalizar(item.resposta),
    dica: item.dica,
    letras: anagramaEmbaralhar(item.resposta, r),
    reveladas: 0
  };
}

/* Quantas letras do comeco ja foram reveladas por dica. */
function anagramaDica(estado) {
  if (estado.reveladas >= estado.resposta.length) { return estado; }
  return {
    resposta: estado.resposta, dica: estado.dica, letras: estado.letras,
    reveladas: estado.reveladas + 1
  };
}

/* O que aparece na tela e no leitor: letras reveladas e o resto em branco. */
function anagramaPista(estado) {
  var saida = [];
  for (var i = 0; i < estado.resposta.length; i++) {
    saida.push(i < estado.reveladas ? estado.resposta[i] : "_");
  }
  return saida.join(" ");
}

function anagramaConferir(estado, tentativa) {
  return anagramaNormalizar(tentativa) === estado.resposta;
}

/* Quando a dica revela tudo, a palavra esta entregue e o jogo acabou. */
function anagramaCerto(estado, tentativa) {
  return anagramaConferir(estado, tentativa) ||
    estado.reveladas >= estado.resposta.length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    anagramaNormalizar: anagramaNormalizar,
    anagramaEmbaralhar: anagramaEmbaralhar,
    anagramaNovo: anagramaNovo,
    anagramaDica: anagramaDica,
    anagramaPista: anagramaPista,
    anagramaConferir: anagramaConferir,
    anagramaCerto: anagramaCerto
  };
}
