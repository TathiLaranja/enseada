/* Enseada - a tela do Album de Retratos.
   Regras em js/album.js; gravacao pela porta unica js/armazenamento.js.
   Cada foto vira uma polaroid (foto quadrada + moldura + espaco para uma
   anotacao). Arrastar com o dedo, com o mouse ou com as setas do teclado.
   Salva sozinho a cada mudanca e baixa a pagina montada como imagem PNG.
   Funciona sem internet e nada sai do aparelho. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var abas = document.getElementById("abas-paginas");
  var mural = document.getElementById("mural");
  var recado = document.getElementById("recado-album");
  var btnFrente = document.getElementById("trazer-frente");
  var btnTirar = document.getElementById("tirar-polaroid");

  var LADO_DA_FOTO = 640;
  var QUALIDADE = 0.7;
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
    btnFrente.disabled = id === null;
    btnTirar.disabled = id === null;
    Array.prototype.forEach.call(mural.children, function (c) {
      var esta = c.getAttribute("data-id") === id;
      c.classList.toggle("escolhida", esta);
      c.setAttribute("aria-pressed", esta ? "true" : "false");
    });
  }

  function aplicarPosicao(el, q) {
    el.style.left = (q.x * 100) + "%";
    el.style.top = (q.y * 100) + "%";
    el.style.transform = "rotate(" + q.giro + "deg)";
  }

  function criarPolaroid(q) {
    var el = document.createElement("div");
    el.className = "polaroid";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-pressed", "false");
    el.setAttribute("data-id", q.id);
    el.setAttribute("aria-label", "Polaroid" + (q.nota ? ": " + q.nota : "") + ". Toque para escolher; arraste ou use as setas para mover.");
    aplicarPosicao(el, q);

    var foto = document.createElement("img");
    foto.className = "polaroid-foto";
    foto.alt = "";
    foto.draggable = false;
    foto.src = q.foto;
    el.appendChild(foto);

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

    ligarArrasto(el, q);
    return el;
  }

  function ligarArrasto(el, q) {
    var arrastando = null;

    el.addEventListener("pointerdown", function (e) {
      if (e.target.tagName === "INPUT") { return; }
      e.preventDefault();
      escolher(q.id);
      el.setPointerCapture(e.pointerId);
      var atual = paginaAtual().polaroids.filter(function (p) { return p.id === q.id; })[0];
      arrastando = { px: e.clientX, py: e.clientY, x: atual.x, y: atual.y };
      el.classList.add("arrastando");
    });

    el.addEventListener("pointermove", function (e) {
      if (!arrastando) { return; }
      var caixa = mural.getBoundingClientRect();
      var novoX = arrastando.x + (e.clientX - arrastando.px) / caixa.width;
      var novoY = arrastando.y + (e.clientY - arrastando.py) / caixa.height;
      album = albumMover(album, paginaId, q.id, novoX, novoY);
      var m = paginaAtual().polaroids.filter(function (p) { return p.id === q.id; })[0];
      aplicarPosicao(el, m);
    });

    function soltar() {
      if (!arrastando) { return; }
      arrastando = null;
      el.classList.remove("arrastando");
      if (!guardar()) { dizerFalha(); }
    }
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", soltar);

    /* Teclado: setas movem a polaroid escolhida; Shift anda mais. */
    el.addEventListener("keydown", function (e) {
      if (e.target !== el) { return; }
      var passo = e.shiftKey ? 0.08 : 0.02;
      var dx = e.key === "ArrowLeft" ? -passo : e.key === "ArrowRight" ? passo : 0;
      var dy = e.key === "ArrowUp" ? -passo : e.key === "ArrowDown" ? passo : 0;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolher(q.id); return; }
      if (!dx && !dy) { return; }
      e.preventDefault();
      escolher(q.id);
      var atual = paginaAtual().polaroids.filter(function (p) { return p.id === q.id; })[0];
      album = albumMover(album, paginaId, q.id, atual.x + dx, atual.y + dy);
      aplicarPosicao(el, paginaAtual().polaroids.filter(function (p) { return p.id === q.id; })[0]);
      if (!guardar()) { dizerFalha(); }
    });
  }

  function desenhar() {
    desenharAbas();
    mural.textContent = "";
    var pagina = paginaAtual();
    mural.setAttribute("aria-label", "Página " + (album.paginas.indexOf(pagina) + 1) + " do álbum");
    if (pagina.polaroids.length === 0) {
      var vazio = document.createElement("p");
      vazio.className = "mural-vazio";
      vazio.textContent = "Página em branco. Adicione uma foto.";
      mural.appendChild(vazio);
    }
    pagina.polaroids.forEach(function (q) { mural.appendChild(criarPolaroid(q)); });
    escolher(escolhida && pagina.polaroids.some(function (q) { return q.id === escolhida; }) ? escolhida : null);
  }

  btnFrente.addEventListener("click", function () {
    if (!escolhida) { return; }
    album = albumTrazerParaFrente(album, paginaId, escolhida);
    if (!guardar()) { dizerFalha(); }
    recado.textContent = "A polaroid está na frente das outras.";
    desenhar();
  });

  btnTirar.addEventListener("click", function () {
    if (!escolhida) { return; }
    if (!tirando) {
      tirando = true;
      btnTirar.textContent = "Tirar mesmo";
      recado.textContent = "Isso tira a polaroid da página. Não dá para desfazer.";
      return;
    }
    album = albumTirarPolaroid(album, paginaId, escolhida);
    escolhida = null;
    guardar();
    recado.textContent = "A polaroid foi tirada da página.";
    desenhar();
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
      var antes = album;
      album = albumAdicionarPolaroid(album, paginaId, id, dados, giro);
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
  function carregarFoto(dados) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("foto")); };
      img.src = dados;
    });
  }

  function cor(variavel) {
    return getComputedStyle(document.documentElement).getPropertyValue(variavel).trim();
  }

  /* Pagina em 1200 x 1600, igual ao mural: mesmo fundo, mesma moldura, mesmas posicoes. */
  function montarImagem(pagina) {
    var L = 1200, A = 1600;
    var tela = document.createElement("canvas");
    tela.width = L;
    tela.height = A;
    var c = tela.getContext("2d");
    c.fillStyle = cor("--restinga") || "#A5B09A";
    c.fillRect(0, 0, L, A);

    var ate = (document.fonts && document.fonts.load) ? document.fonts.load('32px "Atkinson Hyperlegible"') : Promise.resolve();
    return ate.catch(function () {}).then(function () {
      return Promise.all(pagina.polaroids.map(function (q) { return carregarFoto(q.foto); }));
    }).then(function (imagens) {
      pagina.polaroids.forEach(function (q, i) {
        var img = imagens[i];
        var cl = POLAROID_LARGURA * L;
        var al = cl * POLAROID_PROPORCAO;
        var margem = 0.06 * cl;
        var lado = 0.88 * cl;
        c.save();
        c.translate(q.x * L + cl / 2, q.y * A + al / 2);
        c.rotate(q.giro * Math.PI / 180);
        c.shadowColor = "rgba(0,0,0,0.28)";
        c.shadowBlur = 18;
        c.shadowOffsetY = 6;
        c.fillStyle = COR_DO_CARTAO;
        c.fillRect(-cl / 2, -al / 2, cl, al);
        c.shadowColor = "transparent";
        var r = albumRecorteQuadrado(img.naturalWidth, img.naturalHeight);
        c.drawImage(img, r.x, r.y, r.lado, r.lado, -cl / 2 + margem, -al / 2 + margem, lado, lado);
        if (q.nota) {
          var topo = -al / 2 + margem + lado;
          c.fillStyle = COR_DA_NOTA;
          c.font = Math.round(0.075 * cl) + 'px "Atkinson Hyperlegible", "Trebuchet MS", sans-serif';
          c.textBaseline = "middle";
          c.fillText(q.nota, -cl / 2 + margem, (topo + al / 2) / 2, lado);
        }
        c.restore();
      });
      return new Promise(function (resolve) { tela.toBlob(resolve, "image/png"); });
    });
  }

  document.getElementById("baixar-pagina").addEventListener("click", function () {
    var pagina = paginaAtual();
    if (pagina.polaroids.length === 0) {
      recado.textContent = "A página está em branco. Adicione uma foto primeiro.";
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
