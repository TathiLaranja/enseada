/* Enseada - a tela do quebra-cabeca "Cantinho Tranquilo".
   Regras em js/quebracabeca.js. Aqui so desenha a mesa e escuta o toque.
   A peca se arrasta com o dedo, o mouse ou as setas; perto do lugar certo ela
   encaixa. Sem cronometro, sem pontos, sem aviso de erro. A pessoa escolhe
   entre 5 imagens (paisagens calmas) e 3 niveis de dificuldade.
   No Modo Mini, so o nivel facil (12 pecas) fica disponivel. */

(function () {
  /* Cinco imagens/fundos calmos. Os gradientes sao locais, sem rede. */
  var IMAGENS = [
    { id: "mar",        nome: "Mar ao entardecer",  bg: "url(public/images/quebra-cabeca.jpg)" },
    { id: "praia",      nome: "Praia clara",         bg: "linear-gradient(160deg,#E8C5A0 0%,#F2DDB5 25%,#95C5A8 50%,#7AB5C0 75%,#5A95B0 100%)" },
    { id: "campo",      nome: "Campo verde",         bg: "linear-gradient(to bottom,#C0D4E0 0%,#D8E8D0 35%,#A8C8A0 55%,#90B898 100%)" },
    { id: "nevoa",      nome: "Névoa suave",         bg: "linear-gradient(150deg,#D0D8E8 0%,#C8D0E0 30%,#B8C8D8 55%,#D0C8B8 80%,#C8B8A8 100%)" },
    { id: "entardecer", nome: "Entardecer lilás",    bg: "linear-gradient(to bottom,#D8C0D0 0%,#B8B0C8 30%,#98B0C8 60%,#88A8B8 100%)" }
  ];

  var mesa = document.getElementById("mesa-quebra");
  var recado = document.getElementById("recado-quebra");
  var elNiveis = document.getElementById("niveis-quebra");
  var elImagens = document.getElementById("imagens-quebra");

  /* Modo Mini: so o nivel facil fica disponivel. */
  var modoMini = typeof criarArmazenamento === "function" &&
    criarArmazenamento(window.localStorage).ler().ajustes.modo === "mini";

  var nivelId = QC_NIVEIS[0].id;
  var imagemIdx = 0;
  var estado = null;
  var escolhida = null;

  function imagemAtual() { return IMAGENS[imagemIdx] || IMAGENS[0]; }
  function bgAtual() { return imagemAtual().bg; }

  /* ---------- seletores ---------- */

  function desenharImagens() {
    elImagens.textContent = "";
    IMAGENS.forEach(function (img, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "botao-simples botao-imagem-quebra";
      b.textContent = img.nome;
      b.setAttribute("aria-pressed", i === imagemIdx ? "true" : "false");
      b.style.backgroundImage = img.bg;
      b.addEventListener("click", function () { imagemIdx = i; desenharImagens(); recomecar(); });
      elImagens.appendChild(b);
    });
    document.getElementById("imagem-atual-quebra").textContent =
      "Imagem agora: " + imagemAtual().nome + ".";
  }

  function desenharNiveis() {
    elNiveis.textContent = "";
    var niveis = modoMini ? [QC_NIVEIS[0]] : QC_NIVEIS;
    niveis.forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "botao-simples";
      b.textContent = n.nome + " · " + (n.colunas * n.linhas) + " peças";
      b.setAttribute("aria-pressed", n.id === nivelId ? "true" : "false");
      b.addEventListener("click", function () { nivelId = n.id; desenharNiveis(); recomecar(); });
      elNiveis.appendChild(b);
    });
    var n = qcNivel(nivelId);
    document.getElementById("nivel-atual-quebra").textContent =
      "Nível agora: " + n.nome + ", " + (n.colunas * n.linhas) + " peças.";
  }

  function recomecar() {
    estado = qcNovo(nivelId, Math.random);
    escolhida = null;
    recado.textContent = "";
    desenhar();
  }

  /* ---------- renderizacao da mesa ---------- */

  function pecaEl(id) {
    return mesa.querySelector('[data-id="' + id + '"]');
  }

  function posicionar(el, p) {
    el.style.left = (p.x * 100) + "%";
    el.style.top = (p.y / QC_MESA_ALTURA * 100) + "%";
  }

  function desenhar() {
    mesa.textContent = "";
    mesa.style.aspectRatio = "1 / " + QC_MESA_ALTURA;

    var quadro = document.createElement("div");
    quadro.className = "quadro-quebra";
    quadro.style.height = (100 / QC_MESA_ALTURA) + "%";
    quadro.style.setProperty("--imagem", bgAtual());
    quadro.setAttribute("aria-hidden", "true");
    mesa.appendChild(quadro);

    var bandeja = document.createElement("div");
    bandeja.className = "bandeja-quebra";
    bandeja.style.top = (QC_BANDEJA_TOPO / QC_MESA_ALTURA * 100) + "%";
    bandeja.style.height = ((QC_MESA_ALTURA - QC_BANDEJA_TOPO) / QC_MESA_ALTURA * 100) + "%";
    bandeja.setAttribute("aria-hidden", "true");
    mesa.appendChild(bandeja);

    estado.pecas.forEach(function (p) {
      var el = document.createElement("div");
      el.className = "peca-quebra" + (p.encaixada ? " encaixada" : "");
      el.setAttribute("data-id", p.id);
      el.style.width = (100 / estado.colunas) + "%";
      el.style.height = (100 / estado.linhas / QC_MESA_ALTURA) + "%";
      el.style.backgroundImage = bgAtual();
      el.style.backgroundSize = (estado.colunas * 100) + "% " + (estado.linhas * 100) + "%";
      el.style.backgroundPosition =
        (estado.colunas > 1 ? p.col / (estado.colunas - 1) * 100 : 0) + "% " +
        (estado.linhas > 1 ? p.row / (estado.linhas - 1) * 100 : 0) + "%";
      posicionar(el, p);
      el.setAttribute("role", "button");
      el.setAttribute("aria-label",
        "Peça, coluna " + (p.col + 1) + " linha " + (p.row + 1) +
        (p.encaixada ? ", no lugar" : ", solta. Arraste ou use as setas."));
      if (p.encaixada) {
        el.setAttribute("aria-disabled", "true");
      } else {
        el.tabIndex = 0;
        ligarArrasto(el, p.id);
      }
      mesa.appendChild(el);
    });

    if (qcCompleto(estado)) {
      recado.textContent = "O quadro está completo.";
      mesa.classList.add("completa");
    } else {
      mesa.classList.remove("completa");
    }
  }

  /* Leva a tela junto quando o dedo chega perto da borda, para a peca poder
     ir da bandeja ao quadro sem soltar. Sem animacao: so rola a pagina. */
  function rolarSePerto(clientY) {
    var menu = document.querySelector(".menu-rodape");
    var fundo = window.innerHeight - (menu ? menu.getBoundingClientRect().height : 0) - 40;
    if (clientY > fundo) { window.scrollBy(0, 14); }
    else if (clientY < 60) { window.scrollBy(0, -14); }
  }

  function ligarArrasto(el, id) {
    var arrastando = null;
    var ultimo = null;

    function pontoNaMesa(e) {
      var caixa = mesa.getBoundingClientRect();
      return { x: (e.clientX - caixa.left) / caixa.width, y: (e.clientY - caixa.top) / caixa.width };
    }

    function acompanhar() {
      if (!arrastando) { return; }
      var caixa = mesa.getBoundingClientRect();
      var pt = { x: (ultimo.clientX - caixa.left) / caixa.width, y: (ultimo.clientY - caixa.top) / caixa.width };
      estado = qcMover(estado, id, pt.x - arrastando.dx, pt.y - arrastando.dy);
      posicionar(el, estado.pecas.filter(function (p) { return p.id === id; })[0]);
    }

    el.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      /* Nao se troca o elemento de lugar no meio do arrasto: isso solta o dedo.
         A peca fica por cima pela classe "arrastando"; a ordem muda ao soltar. */
      var p = estado.pecas.filter(function (q) { return q.id === id; })[0];
      var pt = pontoNaMesa(e);
      arrastando = { dx: pt.x - p.x, dy: pt.y - p.y };
      ultimo = e;
      el.classList.add("arrastando");
    });

    el.addEventListener("pointermove", function (e) {
      if (!arrastando) { return; }
      ultimo = e;
      rolarSePerto(e.clientY);
      acompanhar();
    });

    function soltar(e) {
      if (!arrastando) { return; }
      var caixa = mesa.getBoundingClientRect();
      var pt = { x: (e.clientX - caixa.left) / caixa.width, y: (e.clientY - caixa.top) / caixa.width };
      var x = pt.x - arrastando.dx, y = pt.y - arrastando.dy;
      arrastando = null;
      el.classList.remove("arrastando");
      estado = qcTrazerParaFrente(qcSoltar(estado, id, x, y), id);
      desenhar();
    }
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", function () {
      if (!arrastando) { return; }
      arrastando = null;
      el.classList.remove("arrastando");
      desenhar();
    });

    /* Teclado: setas movem a peca; Enter tenta encaixar onde ela esta. */
    el.addEventListener("keydown", function (e) {
      var passo = e.shiftKey ? 0.08 : 0.025;
      var dx = e.key === "ArrowLeft" ? -passo : e.key === "ArrowRight" ? passo : 0;
      var dy = e.key === "ArrowUp" ? -passo : e.key === "ArrowDown" ? passo : 0;
      var p = estado.pecas.filter(function (q) { return q.id === id; })[0];
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        estado = qcSoltar(estado, id, p.x, p.y);
        var depois = estado.pecas.filter(function (q) { return q.id === id; })[0];
        desenhar();
        if (!depois.encaixada) { var novo = pecaEl(id); if (novo) { novo.focus(); } }
        return;
      }
      if (!dx && !dy) { return; }
      e.preventDefault();
      estado = qcMover(estado, id, p.x + dx, p.y + dy);
      posicionar(el, estado.pecas.filter(function (q) { return q.id === id; })[0]);
      el.scrollIntoView({ block: "nearest" });
    });
  }

  document.getElementById("ajuda-quebra").addEventListener("click", function () {
    var r = qcAjudar(estado, Math.random);
    if (!r.id) { recado.textContent = "O quadro já está completo."; return; }
    estado = r.estado;
    desenhar();
    if (!qcCompleto(estado)) { recado.textContent = "Uma peça foi encaixada."; }
  });

  document.getElementById("reiniciar-quebra").addEventListener("click", recomecar);

  desenharImagens();
  desenharNiveis();
  recomecar();
}());
