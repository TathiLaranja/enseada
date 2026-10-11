/* Enseada - a tela do quebra-cabeca "Cantinho Tranquilo".
   Regras em js/quebracabeca.js. Aqui so desenha a mesa e escuta o toque.
   A peca se arrasta com o dedo, o mouse ou as setas; perto do lugar certo ela
   encaixa. Cada imagem ja vem com um nivel fixo. Sem cronometro, sem pontos,
   sem aviso de erro. No Modo Mini, so as imagens do nivel facil ficam disponiveis. */

(function () {
  /* Cinco imagens, cada uma com nivel embutido. Os gradientes sao fallback local. */
  var IMAGENS = [
    { id: "mar",     nome: "Mar ao entardecer",      bg: "url(public/images/quebra-cabeca.jpg)", nivelId: "chegar"    },
    { id: "gatinho", nome: "Gatinho aconchegante",   bg: "url(public/images/qc-gatinho.jpg)",   nivelId: "chegar"    },
    { id: "estrela", nome: "Praia com estrela do mar",bg: "url(public/images/qc-estrela.jpg)",  nivelId: "explorar"  },
    { id: "varanda", nome: "Varanda com vasos",       bg: "url(public/images/qc-varanda.jpg)",  nivelId: "permanecer"},
    { id: "conchas", nome: "Conchas na areia",        bg: "url(public/images/qc-conchas.jpg)",  nivelId: "permanecer"}
  ];

  var mesa = document.getElementById("mesa-quebra");
  var recado = document.getElementById("recado-quebra");
  var elImagens = document.getElementById("imagens-quebra");

  /* Modo Mini: so as imagens do nivel facil ficam disponiveis. */
  var modoMini = typeof criarArmazenamento === "function" &&
    criarArmazenamento(window.localStorage).ler().ajustes.modo === "mini";

  var imagemIdx = 0;
  var estado = null;
  var escolhida = null;

  function imagemAtual() { return IMAGENS[imagemIdx] || IMAGENS[0]; }
  function bgAtual() { return imagemAtual().bg; }
  function nivelAtual() { return qcNivel(imagemAtual().nivelId); }

  /* ---------- seletor de imagens ---------- */

  function imagensDisponiveis() {
    return modoMini ? IMAGENS.filter(function (img) { return img.nivelId === "chegar"; }) : IMAGENS;
  }

  function desenharImagens() {
    elImagens.textContent = "";
    var lista = imagensDisponiveis();
    lista.forEach(function (img, i) {
      var idxReal = IMAGENS.indexOf(img);
      var n = qcNivel(img.nivelId);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "botao-simples botao-imagem-quebra";
      b.textContent = img.nome + " · " + (n.colunas * n.linhas) + " peças";
      b.setAttribute("aria-pressed", idxReal === imagemIdx ? "true" : "false");
      b.style.backgroundImage = img.bg;
      b.addEventListener("click", function () { imagemIdx = idxReal; desenharImagens(); recomecar(); });
      elImagens.appendChild(b);
    });
    var img = imagemAtual();
    var n = nivelAtual();
    document.getElementById("imagem-atual-quebra").textContent =
      "Agora: " + img.nome + " · " + (n.colunas * n.linhas) + " peças (" + n.nome + ").";
  }

  function recomecar() {
    estado = qcNovo(imagemAtual().nivelId, Math.random);
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

    function soltar() {
      if (!arrastando) { return; }
      /* Usa a posicao da peca ja calculada pelo ultimo pointermove, evitando
         erro de coordenadas quando a pagina rolou durante o arrasto. */
      var p = estado.pecas.filter(function (q) { return q.id === id; })[0];
      arrastando = null;
      el.classList.remove("arrastando");
      estado = qcTrazerParaFrente(qcSoltar(estado, id, p.x, p.y), id);
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
  recomecar();
}());
