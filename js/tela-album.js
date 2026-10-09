/* Enseada - a tela do Album de Retratos (scrapbook).
   Regras em js/album.js, desenhos dos adesivos em js/adesivos.js e gravacao
   pela porta unica js/armazenamento.js.
   Cada foto vira uma polaroid presa com fita adesiva (foto quadrada + moldura
   + espaco para uma anotacao). Polaroids e adesivos se arrastam com o dedo,
   com o mouse ou com as setas do teclado. Salva sozinho a cada mudanca e baixa
   a pagina montada como imagem PNG. Funciona sem internet e nada sai do
   aparelho. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var abas = document.getElementById("abas-paginas");
  var mural = document.getElementById("mural");
  var recado = document.getElementById("recado-album");
  var btnFrente = document.getElementById("trazer-frente");
  var btnTirar = document.getElementById("tirar-polaroid");
  var btnMenor = document.getElementById("adesivo-menor");
  var btnMaior = document.getElementById("adesivo-maior");

  var LADO_DA_FOTO = 640;
  var QUALIDADE = 0.7;
  var COR_DA_PAGINA = "#FAF8F5";
  var COR_DO_CARTAO = "#FFFDF9";
  var COR_DA_NOTA = "#454640";

  function novoId() {
    return "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  var album = armazem.ler().album;
  if (!album) {
    album = albumNovo(novoId);
    guardar();
  }
  var paginaId = album.paginas[0].id;
  var escolhida = null;
  var tirando = false;

  function guardar() {
    var dados = armazem.ler();
    dados.album = album;
    return armazem.gravar(dados);
  }

  function paginaAtual() {
    return album.paginas.filter(function (p) { return p.id === paginaId; })[0];
  }

  function buscar(id) {
    var achado = albumBuscar(paginaAtual(), id);
    return achado ? achado.item : null;
  }

  function dizerFalha() {
    recado.textContent = "Não há mais espaço neste aparelho. Tire alguma foto do álbum ou das Fotos.";
  }

  /* ---------- abas das paginas ---------- */
  function desenharAbas() {
    abas.textContent = "";
    album.paginas.forEach(function (p, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "botao-aba" + (p.id === paginaId ? " ativa" : "");
      b.setAttribute("aria-pressed", p.id === paginaId ? "true" : "false");
      b.textContent = "Página " + (n + 1);
      b.addEventListener("click", function () {
        paginaId = p.id;
        escolher(null);
        recado.textContent = "";
        desenhar();
      });
      abas.appendChild(b);
    });
  }

  document.getElementById("nova-pagina").addEventListener("click", function () {
    album = albumAdicionarPagina(album, novoId());
    paginaId = album.paginas[album.paginas.length - 1].id;
    escolher(null);
    if (!guardar()) { dizerFalha(); } else { recado.textContent = "Página nova criada."; }
    desenhar();
  });

  /* ---------- mural ---------- */
  function escolher(id) {
    escolhida = id;
    tirando = false;
    btnTirar.textContent = "Tirar da página";
    var achado = id ? albumBuscar(paginaAtual(), id) : null;
    btnFrente.disabled = !achado;
    btnTirar.disabled = !achado;
    btnMenor.disabled = !achado || achado.tipo !== "adesivo";
    btnMaior.disabled = !achado || achado.tipo !== "adesivo";
    Array.prototype.forEach.call(mural.children, function (c) {
      var esta = c.getAttribute("data-id") === id;
      c.classList.toggle("escolhida", esta);
      c.setAttribute("aria-pressed", esta ? "true" : "false");
    });
  }

  function aplicarPosicao(el, q, tipo) {
    el.style.left = (q.x * 100) + "%";
    el.style.top = (q.y * 100) + "%";
    el.style.transform = "rotate(" + q.giro + "deg)";
    if (tipo === "adesivo") { el.style.width = (q.tam * 100) + "%"; }
  }

  function criarPolaroid(q) {
    var el = document.createElement("div");
    el.className = "polaroid";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-pressed", "false");
    el.setAttribute("data-id", q.id);
    el.setAttribute("aria-label", "Polaroid" + (q.nota ? ": " + q.nota : "") + ". Toque para escolher; arraste ou use as setas para mover.");
    aplicarPosicao(el, q, "polaroid");

    var foto = document.createElement("img");
    foto.className = "polaroid-foto";
    foto.alt = "";
    foto.draggable = false;
    foto.src = q.foto;
    el.appendChild(foto);

    /* Fita adesiva no topo: so enfeite (a cor e um dos quatro tons da paleta). */
    var fita = document.createElement("span");
    fita.className = "fita";
    fita.setAttribute("data-fita", String(q.fita || 0));
    fita.setAttribute("aria-hidden", "true");
    fita.style.transform = "translateX(-50%) rotate(" + (-q.giro * 1.5 - 2) + "deg)";
    el.appendChild(fita);

    var nota = document.createElement("input");
    nota.type = "text";
    nota.className = "polaroid-nota";
    nota.maxLength = ALBUM_TAMANHO_DA_NOTA;
    nota.autocomplete = "off";
    nota.setAttribute("aria-label", "Anotação da polaroid (opcional)");
    nota.value = q.nota;
    nota.addEventListener("input", function () {
      album = albumAnotar(album, paginaId, q.id, nota.value);
      if (!guardar()) { dizerFalha(); }
    });
    /* Escrever na anotacao nao pode virar arrastar. */
    nota.addEventListener("pointerdown", function (e) { e.stopPropagation(); escolher(q.id); });
    el.appendChild(nota);

    ligarArrasto(el, q.id, "polaroid");
    return el;
  }

  function criarAdesivo(a) {
    var desenho = adesivoPorId(a.tipo);
    if (!desenho) { return null; }
    var el = document.createElement("div");
    el.className = "adesivo";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-pressed", "false");
    el.setAttribute("data-id", a.id);
    el.setAttribute("aria-label", "Adesivo " + desenho.nome + ". Toque para escolher; arraste ou use as setas para mover.");
    aplicarPosicao(el, a, "adesivo");

    var img = document.createElement("img");
    img.alt = "";
    img.draggable = false;
    img.src = adesivoEndereco(a.tipo);
    el.appendChild(img);

    ligarArrasto(el, a.id, "adesivo");
    return el;
  }

  /* Arrasto por toque, mouse e teclado, igual para polaroid e adesivo. */
  function ligarArrasto(el, id, tipo) {
    var arrastando = null;

    el.addEventListener("pointerdown", function (e) {
      if (e.target.tagName === "INPUT") { return; }
      e.preventDefault();
      escolher(id);
      el.setPointerCapture(e.pointerId);
      var atual = buscar(id);
      arrastando = { px: e.clientX, py: e.clientY, x: atual.x, y: atual.y };
      el.classList.add("arrastando");
    });

    el.addEventListener("pointermove", function (e) {
      if (!arrastando) { return; }
      var caixa = mural.getBoundingClientRect();
      album = albumMover(album, paginaId, id,
        arrastando.x + (e.clientX - arrastando.px) / caixa.width,
        arrastando.y + (e.clientY - arrastando.py) / caixa.height);
      aplicarPosicao(el, buscar(id), tipo);
    });

    function soltar() {
      if (!arrastando) { return; }
      arrastando = null;
      el.classList.remove("arrastando");
      if (!guardar()) { dizerFalha(); }
    }
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", soltar);

    /* Teclado: setas movem o item; Shift anda mais; Enter escolhe. */
    el.addEventListener("keydown", function (e) {
      if (e.target !== el) { return; }
      var passo = e.shiftKey ? 0.08 : 0.02;
      var dx = e.key === "ArrowLeft" ? -passo : e.key === "ArrowRight" ? passo : 0;
      var dy = e.key === "ArrowUp" ? -passo : e.key === "ArrowDown" ? passo : 0;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolher(id); return; }
      if (!dx && !dy) { return; }
      e.preventDefault();
      escolher(id);
      var atual = buscar(id);
      album = albumMover(album, paginaId, id, atual.x + dx, atual.y + dy);
      aplicarPosicao(el, buscar(id), tipo);
      if (!guardar()) { dizerFalha(); }
    });
  }

  function desenhar() {
    desenharAbas();
    mural.textContent = "";
    var pagina = paginaAtual();
    mural.setAttribute("aria-label", "Página " + (album.paginas.indexOf(pagina) + 1) + " do álbum");
    if (pagina.polaroids.length === 0 && pagina.adesivos.length === 0) {
      var vazio = document.createElement("p");
      vazio.className = "mural-vazio";
      vazio.textContent = "Página em branco. Adicione uma foto ou um adesivo.";
      mural.appendChild(vazio);
    }
    pagina.polaroids.forEach(function (q) { mural.appendChild(criarPolaroid(q)); });
    pagina.adesivos.forEach(function (a) {
      var el = criarAdesivo(a);
      if (el) { mural.appendChild(el); }
    });
    escolher(escolhida && albumBuscar(pagina, escolhida) ? escolhida : null);
  }

  btnFrente.addEventListener("click", function () {
    if (!escolhida) { return; }
    album = albumTrazerParaFrente(album, paginaId, escolhida);
    if (!guardar()) { dizerFalha(); }
    recado.textContent = "Está na frente dos outros.";
    desenhar();
  });

  btnTirar.addEventListener("click", function () {
    if (!escolhida) { return; }
    if (!tirando) {
      tirando = true;
      btnTirar.textContent = "Tirar mesmo";
      recado.textContent = "Isso tira da página. Não dá para desfazer.";
      return;
    }
    album = albumTirar(album, paginaId, escolhida);
    escolhida = null;
    guardar();
    recado.textContent = "Foi tirado da página.";
    desenhar();
  });

  function mudarTamanho(sentido) {
    if (!escolhida) { return; }
    album = albumRedimensionarAdesivo(album, paginaId, escolhida, sentido);
    if (!guardar()) { dizerFalha(); }
    desenhar();
  }
  btnMenor.addEventListener("click", function () { mudarTamanho(-1); });
  btnMaior.addEventListener("click", function () { mudarTamanho(1); });

  /* ---------- gaveta de adesivos ---------- */
  var gaveta = document.getElementById("gaveta-adesivos");
  ADESIVOS.forEach(function (d) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "adesivo-da-gaveta";
    b.setAttribute("aria-label", "Pôr o adesivo " + d.nome + " na página");
    var img = document.createElement("img");
    img.alt = "";
    img.draggable = false;
    img.src = adesivoEndereco(d.id);
    var nome = document.createElement("span");
    nome.textContent = d.nome;
    b.appendChild(img);
    b.appendChild(nome);
    b.addEventListener("click", function () {
      if (!albumPodeAdicionarAdesivo(album)) {
        recado.textContent = "O álbum chegou ao limite de " + ALBUM_MAXIMO_DE_ADESIVOS + " adesivos. Tire algum para pôr outro.";
        return;
      }
      var id = novoId();
      var giro = Math.round((Math.random() * 16 - 8) * 10) / 10;
      var antes = album;
      album = albumAdicionarAdesivo(album, paginaId, id, d.id, giro);
      if (!guardar()) { album = antes; dizerFalha(); return; }
      escolhida = id;
      recado.textContent = "Adesivo na página: " + d.nome + ". Arraste para onde quiser.";
      desenhar();
      /* Se a pagina esta fora da tela, traz para a vista (sem animacao). */
      mural.scrollIntoView({ block: "nearest" });
    });
    gaveta.appendChild(b);
  });

  /* ---------- adicionar foto ---------- */
  function carregar(arquivo) {
    if (window.createImageBitmap) {
      return window.createImageBitmap(arquivo, { imageOrientation: "from-image" }).catch(function () { return viaImagem(arquivo); });
    }
    return viaImagem(arquivo);
  }

  function viaImagem(arquivo) {
    return new Promise(function (resolve, reject) {
      var endereco = URL.createObjectURL(arquivo);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(endereco); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(endereco); reject(new Error("imagem")); };
      img.src = endereco;
    });
  }

  /* Reduz e regrava como JPEG: o arquivo fica pequeno e perde a localizacao. */
  function reduzir(fonte) {
    var larg = fonte.width || fonte.naturalWidth;
    var alt = fonte.height || fonte.naturalHeight;
    var t = tamanhoReduzido(larg, alt, LADO_DA_FOTO);
    var tela = document.createElement("canvas");
    tela.width = t.largura;
    tela.height = t.altura;
    var c = tela.getContext("2d");
    c.fillStyle = "#FFFFFF";
    c.fillRect(0, 0, t.largura, t.altura);
    c.drawImage(fonte, 0, 0, t.largura, t.altura);
    if (fonte.close) { fonte.close(); }
    return tela.toDataURL("image/jpeg", QUALIDADE);
  }

  var entrada = document.getElementById("entrada-foto");
  document.getElementById("adicionar-foto").addEventListener("click", function () {
    if (!albumPodeAdicionar(album)) {
      recado.textContent = "O álbum chegou ao limite de " + ALBUM_MAXIMO_DE_POLAROIDS + " polaroids. Tire alguma para pôr outra.";
      return;
    }
    entrada.click();
  });

  entrada.addEventListener("change", function () {
    var arquivo = entrada.files && entrada.files[0];
    entrada.value = "";
    if (!arquivo) { return; }
    recado.textContent = "Montando a polaroid…";
    carregar(arquivo).then(function (fonte) {
      var dados = reduzir(fonte);
      var id = novoId();
      var giro = Math.round((Math.random() * 8 - 4) * 10) / 10;
      var fita = Math.floor(Math.random() * ALBUM_CORES_DA_FITA.length);
      var antes = album;
      album = albumAdicionarPolaroid(album, paginaId, id, dados, giro, fita);
      if (!guardar()) {
        album = antes;
        dizerFalha();
        return;
      }
      escolhida = id;
      recado.textContent = "Polaroid guardada. Arraste para onde quiser.";
      desenhar();
    }).catch(function () {
      recado.textContent = "Não foi possível abrir esse arquivo como foto.";
    });
  });

  /* ---------- baixar a pagina como imagem ---------- */
  function carregarImagem(endereco) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("imagem")); };
      img.src = endereco;
    });
  }

  /* Fita adesiva: tira semitransparente com as pontas em dente de serra. */
  function desenharFita(c, largura, altura, cor) {
    var dente = altura / 5;
    c.save();
    c.globalAlpha = 0.86;
    c.fillStyle = cor;
    c.beginPath();
    c.moveTo(-largura / 2, -altura / 2);
    c.lineTo(largura / 2, -altura / 2);
    for (var i = 0; i < 5; i++) { c.lineTo(largura / 2 - (i % 2 === 0 ? dente : 0), -altura / 2 + (i + 0.5) * dente + dente / 2); }
    c.lineTo(largura / 2, altura / 2);
    c.lineTo(-largura / 2, altura / 2);
    for (var j = 4; j >= 0; j--) { c.lineTo(-largura / 2 + (j % 2 === 0 ? dente : 0), -altura / 2 + (j + 0.5) * dente + dente / 2); }
    c.closePath();
    c.fill();
    c.restore();
  }

  /* Pagina em 1200 x 1600, igual ao mural: mesmo fundo, moldura, fita, adesivos e posicoes. */
  function montarImagem(pagina) {
    var L = 1200, A = 1600;
    var tela = document.createElement("canvas");
    tela.width = L;
    tela.height = A;
    var c = tela.getContext("2d");
    c.fillStyle = COR_DA_PAGINA;
    c.fillRect(0, 0, L, A);

    var fonte = (document.fonts && document.fonts.load) ? document.fonts.load('32px "Atkinson Hyperlegible"') : Promise.resolve();
    var fotos = pagina.polaroids.map(function (q) { return carregarImagem(q.foto); });
    var desenhos = pagina.adesivos.map(function (a) {
      return adesivoPorId(a.tipo) ? carregarImagem(adesivoEndereco(a.tipo)) : Promise.resolve(null);
    });

    return fonte.catch(function () {}).then(function () {
      return Promise.all([Promise.all(fotos), Promise.all(desenhos)]);
    }).then(function (res) {
      var imagens = res[0], figuras = res[1];

      pagina.polaroids.forEach(function (q, i) {
        var img = imagens[i];
        var cl = POLAROID_LARGURA * L;
        var al = cl * POLAROID_PROPORCAO;
        var margem = 0.06 * cl;
        var lado = 0.88 * cl;
        c.save();
        c.translate(q.x * L + cl / 2, q.y * A + al / 2);
        c.rotate(q.giro * Math.PI / 180);
        c.shadowColor = "rgba(0,0,0,0.30)";
        c.shadowBlur = 18;
        c.shadowOffsetY = 6;
        c.fillStyle = COR_DO_CARTAO;
        c.fillRect(-cl / 2, -al / 2, cl, al);
        c.shadowColor = "transparent";
        c.strokeStyle = "#D8D3C8";
        c.lineWidth = 2;
        c.strokeRect(-cl / 2, -al / 2, cl, al);
        var r = albumRecorteQuadrado(img.naturalWidth, img.naturalHeight);
        c.drawImage(img, r.x, r.y, r.lado, r.lado, -cl / 2 + margem, -al / 2 + margem, lado, lado);
        if (q.nota) {
          var topo = -al / 2 + margem + lado;
          c.fillStyle = COR_DA_NOTA;
          c.font = Math.round(0.075 * cl) + 'px "Atkinson Hyperlegible", "Trebuchet MS", sans-serif';
          c.textBaseline = "middle";
          c.fillText(q.nota, -cl / 2 + margem, (topo + al / 2) / 2, lado);
        }
        c.save();
        c.translate(0, -al / 2);
        c.rotate((-q.giro * 1.5 - 2) * Math.PI / 180);
        desenharFita(c, 0.34 * cl, 0.1 * cl, ALBUM_CORES_DA_FITA[q.fita || 0]);
        c.restore();
        c.restore();
      });

      pagina.adesivos.forEach(function (a, i) {
        var fig = figuras[i];
        if (!fig) { return; }
        var lado = a.tam * L;
        c.save();
        c.translate(a.x * L + lado / 2, a.y * A + lado / 2);
        c.rotate(a.giro * Math.PI / 180);
        c.drawImage(fig, -lado / 2, -lado / 2, lado, lado);
        c.restore();
      });

      return new Promise(function (resolve) { tela.toBlob(resolve, "image/png"); });
    });
  }

  document.getElementById("baixar-pagina").addEventListener("click", function () {
    var pagina = paginaAtual();
    if (pagina.polaroids.length === 0 && pagina.adesivos.length === 0) {
      recado.textContent = "A página está em branco. Adicione uma foto ou um adesivo primeiro.";
      return;
    }
    recado.textContent = "Preparando a imagem…";
    montarImagem(pagina).then(function (blob) {
      if (!blob) { recado.textContent = "Não foi possível preparar a imagem."; return; }
      var endereco = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = endereco;
      link.download = "album-pagina-" + (album.paginas.indexOf(pagina) + 1) + ".png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(endereco);
      recado.textContent = "A imagem foi para a pasta de downloads do aparelho.";
    }).catch(function () {
      recado.textContent = "Não foi possível preparar a imagem.";
    });
  });

  desenhar();
}());
