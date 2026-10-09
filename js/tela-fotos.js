/* Enseada - a tela Fotos: registrar e guardar fotos so neste aparelho.
   Funciona sem internet. A foto passa por um canvas e volta como JPEG menor:
   isso tira a localizacao e os dados escondidos. Regras em js/fotos.js e
   gravacao pela porta unica js/armazenamento.js. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var recado = document.getElementById("recado-fotos");
  var lista = document.getElementById("lista-fotos");
  var apagando = null;

  function novoId() {
    return "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function carregar(arquivo) {
    if (window.createImageBitmap) {
      return window.createImageBitmap(arquivo, { imageOrientation: "from-image" }).catch(function () {
        return carregarPorImagem(arquivo);
      });
    }
    return carregarPorImagem(arquivo);
  }

  function carregarPorImagem(arquivo) {
    return new Promise(function (resolve, reject) {
      var endereco = URL.createObjectURL(arquivo);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(endereco); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(endereco); reject(new Error("imagem")); };
      img.src = endereco;
    });
  }

  function reduzir(fonte) {
    var larg = fonte.width || fonte.naturalWidth;
    var alt = fonte.height || fonte.naturalHeight;
    var t = tamanhoReduzido(larg, alt, FOTO_LADO_MAXIMO);
    var tela = document.createElement("canvas");
    tela.width = t.largura;
    tela.height = t.altura;
    var c = tela.getContext("2d");
    c.fillStyle = "#FFFFFF";
    c.fillRect(0, 0, t.largura, t.altura);
    c.drawImage(fonte, 0, 0, t.largura, t.altura);
    if (fonte.close) { fonte.close(); }
    return tela.toDataURL("image/jpeg", FOTO_QUALIDADE);
  }

  /* Guarda uma foto; devolve o texto do recado se algo impediu. */
  function guardarArquivo(arquivo) {
    var dados0 = armazem.ler();
    if (!podeGuardarMais(dados0.fotos, MAXIMO_DE_FOTOS)) {
      return Promise.resolve("O limite de " + MAXIMO_DE_FOTOS + " fotos foi atingido. Apague uma para guardar outra.");
    }
    return carregar(arquivo).then(function (fonte) {
      var foto = novaFoto(reduzir(fonte), novoId());
      if (!foto) { return "Não foi possível preparar essa foto."; }
      var dados = armazem.ler();
      dados.fotos.push(foto);
      return armazem.gravar(dados) ? "" : "Não há mais espaço neste aparelho. Apague uma foto e tente de novo.";
    }).catch(function () {
      return "Não foi possível abrir esse arquivo como foto.";
    });
  }

  function tratar(entrada) {
    var arquivos = Array.prototype.slice.call(entrada.files || []);
    entrada.value = "";
    if (arquivos.length === 0) { return; }
    recado.textContent = "Guardando…";
    var problema = "";
    arquivos.reduce(function (cadeia, arq) {
      return cadeia.then(function () {
        if (problema) { return null; }
        return guardarArquivo(arq).then(function (p) { problema = p; });
      });
    }, Promise.resolve()).then(function () {
      recado.textContent = problema || (arquivos.length === 1 ? "Foto guardada neste aparelho." : "Fotos guardadas neste aparelho.");
      desenhar();
    });
  }

  function desenhar() {
    var fotos = armazem.ler().fotos;
    lista.textContent = "";
    if (fotos.length === 0) {
      var vazio = document.createElement("p");
      vazio.className = "vazio";
      vazio.textContent = "Nenhuma foto guardada.";
      lista.appendChild(vazio);
      return;
    }
    fotos.forEach(function (f) {
      var cartao = document.createElement("div");
      cartao.className = "item";
      var img = document.createElement("img");
      img.className = "foto";
      img.alt = "Foto guardada";
      img.src = f.dados;
      cartao.appendChild(img);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "botao-simples";
      b.textContent = apagando === f.id ? "Apagar mesmo" : "Apagar esta foto";
      b.addEventListener("click", function () {
        if (apagando === f.id) {
          var dados = armazem.ler();
          dados.fotos = tirarFoto(dados.fotos, f.id);
          armazem.gravar(dados);
          apagando = null;
          recado.textContent = "A foto foi apagada.";
        } else {
          apagando = f.id;
          recado.textContent = "Isso apaga a foto deste aparelho. Não dá para desfazer.";
        }
        desenhar();
      });
      cartao.appendChild(b);
      lista.appendChild(cartao);
    });
  }

  var camera = document.getElementById("entrada-camera");
  var galeria = document.getElementById("entrada-galeria");
  document.getElementById("botao-camera").addEventListener("click", function () { camera.click(); });
  document.getElementById("botao-galeria").addEventListener("click", function () { galeria.click(); });
  camera.addEventListener("change", function () { tratar(camera); });
  galeria.addEventListener("change", function () { tratar(galeria); });

  desenhar();
}());
