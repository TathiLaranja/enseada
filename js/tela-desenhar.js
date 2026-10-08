/* Enseada - a tela Desenhar: traco e borracha num canvas.
   O desenho e guardado como tracos (pontos de 0 a 1), nao como imagem. Assim
   ele se ajusta ao tamanho da tela e ganha as cores do tema que estiver
   ligado. Sem biblioteca, sem rede. */

(function () {
  var LIMITE_DE_PONTOS = 20000;
  var LARGURA_TRACO = 3;
  var LARGURA_BORRACHA = 26;

  var armazem = criarArmazenamento(window.localStorage);
  var canvas = document.getElementById("tela-desenho");
  var ctx = canvas.getContext("2d");
  var recado = document.getElementById("recado-desenho");
  var botaoTraco = document.getElementById("ferramenta-traco");
  var botaoApagar = document.getElementById("ferramenta-apagar");
  var botaoLimpar = document.getElementById("botao-limpar");

  var tracos = armazem.ler().desenho;
  var apagando = false;
  var atual = null;

  function totalDePontos() {
    return tracos.reduce(function (soma, t) { return soma + t.pontos.length; }, 0);
  }

  function ajustarTamanho() {
    var escala = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * escala));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * escala));
    redesenhar();
  }

  function desenharTraco(t) {
    var escala = window.devicePixelRatio || 1;
    var cor = getComputedStyle(document.documentElement).getPropertyValue("--texto").trim() || "#1F7268";
    ctx.globalCompositeOperation = t.apagar ? "destination-out" : "source-over";
    ctx.strokeStyle = cor;
    ctx.fillStyle = cor;
    ctx.lineWidth = (t.apagar ? LARGURA_BORRACHA : LARGURA_TRACO) * escala;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    var w = canvas.width;
    var h = canvas.height;
    ctx.beginPath();
    ctx.moveTo(t.pontos[0][0] * w, t.pontos[0][1] * h);
    if (t.pontos.length === 1) {
      /* Um toque sem arrastar vira um ponto. */
      ctx.lineTo(t.pontos[0][0] * w + 0.01, t.pontos[0][1] * h);
    }
    for (var i = 1; i < t.pontos.length; i++) {
      ctx.lineTo(t.pontos[i][0] * w, t.pontos[i][1] * h);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }

  function redesenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tracos.forEach(desenharTraco);
  }

  function guardar() {
    if (totalDePontos() > LIMITE_DE_PONTOS) {
      recado.textContent = "O desenho ficou grande demais para guardar. Ele continua aqui até você sair da tela.";
      return;
    }
    var dados = armazem.ler();
    dados.desenho = tracos;
    var ok = armazem.gravar(dados);
    recado.textContent = ok ? "" : "Não foi possível guardar neste aparelho.";
  }

  function ponto(evento) {
    var caixa = canvas.getBoundingClientRect();
    var x = (evento.clientX - caixa.left) / caixa.width;
    var y = (evento.clientY - caixa.top) / caixa.height;
    return [Math.round(Math.min(1, Math.max(0, x)) * 10000) / 10000,
            Math.round(Math.min(1, Math.max(0, y)) * 10000) / 10000];
  }

  canvas.addEventListener("pointerdown", function (evento) {
    evento.preventDefault();
    canvas.setPointerCapture(evento.pointerId);
    atual = { apagar: apagando, pontos: [ponto(evento)] };
    tracos.push(atual);
    desenharTraco(atual);
    desfazerConfirmacao();
  });

  canvas.addEventListener("pointermove", function (evento) {
    if (!atual) { return; }
    atual.pontos.push(ponto(evento));
    redesenhar();
  });

  function soltar() {
    if (!atual) { return; }
    atual = null;
    guardar();
  }
  canvas.addEventListener("pointerup", soltar);
  canvas.addEventListener("pointercancel", soltar);

  function dizerFerramenta() {
    botaoTraco.setAttribute("aria-pressed", apagando ? "false" : "true");
    botaoApagar.setAttribute("aria-pressed", apagando ? "true" : "false");
    document.getElementById("ferramenta-atual").textContent =
      "Agora está: " + (apagando ? "apagar." : "traço.");
  }

  botaoTraco.addEventListener("click", function () { apagando = false; dizerFerramenta(); });
  botaoApagar.addEventListener("click", function () { apagando = true; dizerFerramenta(); });

  function desfazerConfirmacao() {
    botaoLimpar.removeAttribute("data-confirmar");
    botaoLimpar.textContent = "Limpar o desenho";
  }

  botaoLimpar.addEventListener("click", function () {
    if (botaoLimpar.getAttribute("data-confirmar") === "sim") {
      tracos = [];
      armazem.mudar(function (d) {
        d.desenho = [];
        return d;
      });
      redesenhar();
      desfazerConfirmacao();
      recado.textContent = "A tela está em branco.";
      return;
    }
    botaoLimpar.setAttribute("data-confirmar", "sim");
    botaoLimpar.textContent = "Limpar mesmo";
    recado.textContent = "Isso apaga o desenho inteiro. Não dá para desfazer.";
  });

  window.addEventListener("resize", ajustarTamanho);
  dizerFerramenta();
  ajustarTamanho();
}());
