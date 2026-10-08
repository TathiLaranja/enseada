/* Enseada - a tela Jogos calmos: jogo da memoria.
   Regras em js/memoria.js. Aqui so desenha as cartas e escuta o toque.
   Estado de carta e dito em palavra, nunca so em cor. */

(function () {
  var jogo = novoJogo(Math.random);
  var area = document.getElementById("cartas");
  var recado = document.getElementById("recado-jogo");

  function desenhar() {
    area.textContent = "";
    jogo.cartas.forEach(function (palavra, i) {
      var achada = jogo.achadas.indexOf(i) !== -1;
      var aberta = jogo.viradas.indexOf(i) !== -1;
      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "carta";

      if (achada) {
        botao.setAttribute("data-estado", "achada");
        botao.textContent = palavra + " (par)";
        botao.setAttribute("aria-label", palavra + ", par achado");
        botao.disabled = true;
      } else if (aberta) {
        botao.setAttribute("data-estado", "aberta");
        botao.textContent = palavra;
        botao.setAttribute("aria-label", palavra + ", carta virada");
      } else {
        botao.textContent = "Virar";
        botao.setAttribute("aria-label", "Carta fechada, tocar para virar");
      }

      botao.addEventListener("click", function () {
        jogo = tocar(jogo, i);
        desenhar();
        var proxima = area.children[i];
        if (proxima && !proxima.disabled) { proxima.focus(); }
      });
      area.appendChild(botao);
    });

    if (terminou(jogo)) {
      recado.textContent = "Todos os pares foram achados.";
    } else if (jogo.viradas.length === 2) {
      recado.textContent = "Não são iguais. Toque em outra carta quando quiser.";
    } else {
      recado.textContent = "";
    }
  }

  document.getElementById("botao-embaralhar").addEventListener("click", function () {
    jogo = novoJogo(Math.random);
    desenhar();
  });

  desenhar();
}());
