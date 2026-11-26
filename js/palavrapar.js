/* Enseada - regras da Memoria de palavras (funcoes puras, sem tela).
   E o jogo da memoria sem figura nenhuma: cada par e uma palavra e a frase
   que descreve ela. Vira duas cartas, le as duas, e ou casam ou voltam.
   Como tudo e texto, o leitor de tela joga inteiro.
   Sem cronometro, sem pontuacao e sem derrota: so acaba quando acha tudo. */

var PALAVRAPAR_PARES = 6;

/* Embaralha sem alterar a lista recebida. */
function palavraparEmbaralhar(lista, sorteio) {
  var r = typeof sorteio === "function" ? sorteio : Math.random;
  var saida = lista.slice();
  for (var i = saida.length - 1; i > 0; i--) {
    var j = Math.floor(r() * (i + 1));
    var t = saida[i]; saida[i] = saida[j]; saida[j] = t;
  }
  return saida;
}

/* Monta o jogo: `quantidade` pares, cada um virando duas cartas. */
function palavraparNovo(banco, quantidade, sorteio) {
  var r = typeof sorteio === "function" ? sorteio : Math.random;
  var quantos = Math.min(quantidade || PALAVRAPAR_PARES, banco.length);
  var escolhidos = palavraparEmbaralhar(banco, r).slice(0, quantos);
  var cartas = [];
  escolhidos.forEach(function (p, n) {
    cartas.push({ id: "p" + n, par: n, tipo: "palavra", texto: p.resposta });
    cartas.push({ id: "d" + n, par: n, tipo: "dica", texto: p.dica });
  });
  return { cartas: palavraparEmbaralhar(cartas, r), abertas: [], achados: [] };
}

function palavraparCarta(estado, id) {
  var achada = null;
  estado.cartas.forEach(function (c) { if (c.id === id) { achada = c; } });
  return achada;
}

function palavraparJaAchada(estado, id) {
  var c = palavraparCarta(estado, id);
  return !!c && estado.achados.indexOf(c.par) !== -1;
}

/* Vira uma carta. Carta ja achada, ja aberta, ou a terceira da vez, nao faz
   nada: duas abertas tem de ser resolvidas antes. */
function palavraparVirar(estado, id) {
  if (!palavraparCarta(estado, id)) { return estado; }
  if (estado.abertas.length >= 2) { return estado; }
  if (estado.abertas.indexOf(id) !== -1) { return estado; }
  if (palavraparJaAchada(estado, id)) { return estado; }
  return { cartas: estado.cartas, achados: estado.achados,
    abertas: estado.abertas.concat([id]) };
}

function palavraparCasaram(estado) {
  if (estado.abertas.length !== 2) { return false; }
  var a = palavraparCarta(estado, estado.abertas[0]);
  var b = palavraparCarta(estado, estado.abertas[1]);
  /* Par e uma palavra com a frase dela: duas palavras nao casam. */
  return a.par === b.par && a.tipo !== b.tipo;
}

/* Fecha a vez: guarda o par se casou, e de todo jeito esvazia as abertas. */
function palavraparResolver(estado) {
  if (estado.abertas.length !== 2) { return estado; }
  var casou = palavraparCasaram(estado);
  var a = palavraparCarta(estado, estado.abertas[0]);
  return {
    cartas: estado.cartas,
    achados: casou ? estado.achados.concat([a.par]) : estado.achados,
    abertas: []
  };
}

function palavraparCompleto(estado) {
  return estado.achados.length * 2 === estado.cartas.length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PALAVRAPAR_PARES: PALAVRAPAR_PARES,
    palavraparEmbaralhar: palavraparEmbaralhar,
    palavraparNovo: palavraparNovo,
    palavraparCarta: palavraparCarta,
    palavraparJaAchada: palavraparJaAchada,
    palavraparVirar: palavraparVirar,
    palavraparCasaram: palavraparCasaram,
    palavraparResolver: palavraparResolver,
    palavraparCompleto: palavraparCompleto
  };
}
