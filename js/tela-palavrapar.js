/* Enseada - a tela da Memoria de palavras. Regras em js/palavrapar.js, banco
   em js/cruzadas.js. Nao grava nada.
   Nenhuma figura: a carta fechada diz "Carta 3, fechada" e a aberta le o
   proprio texto, entao o leitor de tela joga inteiro. A carta casada fica
   aberta e diz "casada" no rotulo, porque a cor sozinha nao informa. */

document.addEventListener("DOMContentLoaded", function () {
  var painel = document.getElementById("painel-palavrapar");
  if (!painel) { return; }

  var grade = document.getElementById("grade-palavrapar");
  var recado = document.getElementById("recado-palavrapar");
  var btnOutra = document.getElementById("outra-palavrapar");

  var estado = null;
  var esperando = false;

  /* A frase do banco ja termina em ponto e a palavra nao: sem isto sai
     "Lugar onde se mora..", com dois pontos finais. */
  function comPonto(texto) {
    return /[.!?]$/.test(texto) ? texto : texto + ".";
  }

  function rotulo(carta, n, aberta, casada) {
    if (casada) { return "Carta " + n + ", casada: " + carta.texto; }
    if (aberta) { return "Carta " + n + ", aberta: " + carta.texto; }
    return "Carta " + n + ", fechada";
  }

  function desenhar() {
    grade.textContent = "";
    estado.cartas.forEach(function (carta, i) {
      var casada = estado.achados.indexOf(carta.par) !== -1;
      var aberta = estado.abertas.indexOf(carta.id) !== -1;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carta-palavra" +
        (casada ? " casada" : "") + (aberta ? " aberta" : "");
      b.textContent = (casada || aberta) ? carta.texto : "Carta " + (i + 1);
      b.setAttribute("aria-label", rotulo(carta, i + 1, aberta, casada));
      b.disabled = casada;
      b.addEventListener("click", function () { virar(carta.id, i + 1); });
      grade.appendChild(b);
    });
  }

  function virar(id, n) {
    if (esperando) { return; }
    var antes = estado;
    estado = palavraparVirar(estado, id);
    if (estado === antes) { return; }
    var carta = palavraparCarta(estado, id);
    desenhar();

    if (estado.abertas.length < 2) {
      recado.textContent = "Carta " + n + ": " + comPonto(carta.texto);
      return;
    }

    var casou = palavraparCasaram(estado);
    var a = palavraparCarta(estado, estado.abertas[0]);
    var b = palavraparCarta(estado, estado.abertas[1]);
    recado.textContent = casou
      ? "Casou: " + a.texto + " com " + b.texto
      : comPonto(a.texto) + " " + comPonto(b.texto) + " Não são um par, as duas voltam.";

    /* Tempo so para dar de ler as duas; errar nao tira nada. */
    esperando = true;
    window.setTimeout(function () {
      estado = palavraparResolver(estado);
      esperando = false;
      desenhar();
      if (palavraparCompleto(estado)) {
        recado.textContent = "Achou todos os pares. Toque em Outro jogo quando quiser.";
      }
    }, casou ? 900 : 2200);
  }

  function nova() {
    estado = palavraparNovo(CRUZADAS_BANCO, PALAVRAPAR_PARES);
    esperando = false;
    recado.textContent = "Jogo novo, com " + (estado.cartas.length / 2) +
      " pares. Cada palavra casa com a frase que descreve ela.";
    desenhar();
  }

  btnOutra.addEventListener("click", nova);
  nova();
});
