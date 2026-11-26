/* Enseada - a tela da Memoria sonora. Usa as regras da memoria de palavras
   (js/palavrapar.js) e o som de js/som.js. Nao grava nada.

   Este jogo e de ouvido, como Pequenos Tesouros e de vista: casar notas.
   Por isso ele e OPCIONAL e so comeca depois de a pessoa tocar em comecar,
   com o aviso de volume na frente. Quem nao ouve tem a Memoria de palavras,
   que e o mesmo jogo em texto.

   Mesmo aqui o som nunca e a unica informacao do APP: cada carta tocada
   tambem vira recado escrito, e a carta casada diz o nome da nota. */

document.addEventListener("DOMContentLoaded", function () {
  var painel = document.getElementById("painel-somemoria");
  if (!painel) { return; }

  var aviso = document.getElementById("aviso-somemoria");
  var btnComecar = document.getElementById("comecar-somemoria");
  var jogo = document.getElementById("jogo-somemoria");
  var grade = document.getElementById("grade-somemoria");
  var recado = document.getElementById("recado-somemoria");
  var btnOutra = document.getElementById("outra-somemoria");

  var estado = null;
  var esperando = false;
  var contexto = null;

  function notaDaCarta(carta) {
    return somNotaPorId(carta.texto);
  }

  function tocar(carta) {
    var nota = notaDaCarta(carta);
    if (!nota) { return; }
    contexto = contexto || somContexto(window);
    somTocarNota(contexto, nota.hz, 0.7, SOM_VOLUME_PADRAO);
  }

  function desenhar() {
    grade.textContent = "";
    estado.cartas.forEach(function (carta, i) {
      var casada = estado.achados.indexOf(carta.par) !== -1;
      var aberta = estado.abertas.indexOf(carta.id) !== -1;
      var nota = notaDaCarta(carta);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carta-som" + (casada ? " casada" : "") + (aberta ? " aberta" : "");
      /* A carta casada mostra o nome da nota: o som nao fica sendo a unica
         marca de que aquele par ja foi resolvido. */
      b.textContent = casada ? nota.nome : String(i + 1);
      b.setAttribute("aria-label", casada
        ? "Carta " + (i + 1) + ", casada, nota " + nota.nome
        : aberta
          ? "Carta " + (i + 1) + ", tocando. Toque de novo para ouvir outra vez."
          : "Carta " + (i + 1) + ", fechada. Toque para ouvir o som dela.");
      b.disabled = casada;
      b.addEventListener("click", function () { escolher(carta, i + 1); });
      grade.appendChild(b);
    });
  }

  function escolher(carta, n) {
    if (esperando) { return; }
    /* Carta ja aberta: so repete o som, sem mexer no jogo. */
    if (estado.abertas.indexOf(carta.id) !== -1) {
      tocar(carta);
      recado.textContent = "Carta " + n + ", de novo.";
      return;
    }
    var antes = estado;
    estado = palavraparVirar(estado, carta.id);
    if (estado === antes) { return; }
    tocar(carta);
    desenhar();

    if (estado.abertas.length < 2) {
      recado.textContent = "Carta " + n + " tocou. Agora escolha outra.";
      return;
    }

    var casou = palavraparCasaram(estado);
    var a = palavraparCarta(estado, estado.abertas[0]);
    recado.textContent = casou
      ? "Casou: as duas são " + notaDaCarta(a).nome + "."
      : "Sons diferentes. As duas voltam.";

    esperando = true;
    window.setTimeout(function () {
      estado = palavraparResolver(estado);
      esperando = false;
      desenhar();
      if (palavraparCompleto(estado)) {
        recado.textContent = "Achou todos os pares. Toque em Outro jogo quando quiser.";
      }
    }, casou ? 900 : 1800);
  }

  function nova() {
    var banco = SOM_NOTAS.slice(0, 6).map(function (n) {
      return { resposta: n.id, dica: n.id };
    });
    estado = palavraparNovo(banco, banco.length);
    esperando = false;
    recado.textContent = "Jogo novo, com " + banco.length +
      " pares de sons. Toque numa carta para ouvir.";
    desenhar();
  }

  btnComecar.addEventListener("click", function () {
    /* So aqui o som pode nascer: depois do aviso e de um toque da pessoa. */
    contexto = somContexto(window);
    aviso.hidden = true;
    btnComecar.hidden = true;
    jogo.hidden = false;
    nova();
  });

  btnOutra.addEventListener("click", nova);
});
