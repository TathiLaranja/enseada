/* Enseada - a tela Me ajuda a achar no Modo Mini (Enseadinha).
   Uma pergunta por vez, com um desenho grande, e tres jeitos de responder:
   falar para um adulto escrever, escrever do jeito dela, ou desenhar.
   Pular e voltar sao livres. Sem ortografia conferida (sem sublinhado de
   erro), sem nota, sem contagem. Regras em js/mini.js. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  if (armazem.ler().ajustes.modo !== "mini") { return; }

  var tela = document.getElementById("tela");
  document.querySelector(".topo h1").textContent = "Enseadinha";

  var i = 0;
  var terminou = false;

  /* Desenhos fixos do proprio app, so com as cores do tema. */
  var DESENHOS = {
    brincar: '<circle cx="60" cy="60" r="38" fill="var(--pessego)" stroke="var(--texto)" stroke-width="3"/><path d="M22 60 Q60 36 98 60 M22 60 Q60 84 98 60" fill="none" stroke="var(--texto)" stroke-width="3"/>',
    rir: '<circle cx="38" cy="60" r="26" fill="var(--restinga)" stroke="var(--texto)" stroke-width="3"/><circle cx="84" cy="60" r="26" fill="var(--lavanda)" stroke="var(--texto)" stroke-width="3"/><circle cx="30" cy="54" r="3" fill="var(--texto)"/><circle cx="46" cy="54" r="3" fill="var(--texto)"/><circle cx="76" cy="54" r="3" fill="var(--texto)"/><circle cx="92" cy="54" r="3" fill="var(--texto)"/><path d="M28 68 Q38 80 48 68 M74 68 Q84 80 94 68" fill="none" stroke="var(--texto)" stroke-width="3" stroke-linecap="round"/>',
    musica: '<ellipse cx="44" cy="86" rx="16" ry="12" fill="var(--lavanda)" stroke="var(--texto)" stroke-width="3"/><path d="M58 84 V26 L92 36 V50 L58 42" fill="var(--lavanda)" stroke="var(--texto)" stroke-width="3" stroke-linejoin="round"/>',
    calmo: '<path d="M30 80 A20 20 0 0 1 34 42 A26 26 0 0 1 84 38 A20 20 0 0 1 92 80 Z" fill="var(--destaque)" stroke="var(--texto)" stroke-width="3" stroke-linejoin="round"/>',
    lugar: '<path d="M16 58 L60 20 L104 58" fill="none" stroke="var(--texto)" stroke-width="3" stroke-linejoin="round"/><rect x="26" y="56" width="68" height="46" fill="var(--restinga)" stroke="var(--texto)" stroke-width="3"/><rect x="52" y="74" width="16" height="28" fill="var(--pessego)" stroke="var(--texto)" stroke-width="3"/>',
    abraco: '<path d="M60 100 C20 70 14 44 32 32 C46 24 58 32 60 42 C62 32 74 24 88 32 C106 44 100 70 60 100 Z" fill="var(--pessego)" stroke="var(--texto)" stroke-width="3" stroke-linejoin="round"/>'
  };

  function desenho(id) {
    var d = document.createElement("div");
    d.className = "mini-desenho";
    d.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' + (DESENHOS[id] || "") + "</svg>";
    return d;
  }

  function botao(texto, classe, aoApertar) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = classe;
    b.textContent = texto;
    b.addEventListener("click", aoApertar);
    return b;
  }

  function mostrarPergunta() {
    var p = MINI_PERGUNTAS[i];
    tela.textContent = "";

    var intro = document.createElement("p");
    intro.className = "explica";
    intro.textContent = "Modo Mini, para crianças a partir de 3 anos. Um adulto pode ficar por perto.";
    tela.appendChild(intro);

    tela.appendChild(desenho(p.id));

    var pergunta = document.createElement("p");
    pergunta.className = "pergunta mini-pergunta";
    pergunta.textContent = p.texto;
    tela.appendChild(pergunta);

    var campo = document.createElement("div");
    campo.className = "campo";
    var rotulo = document.createElement("label");
    rotulo.setAttribute("for", "resposta-mini");
    rotulo.textContent = "Sua resposta";
    var ajuda = document.createElement("span");
    ajuda.className = "ajuda-campo";
    ajuda.textContent = "Pode falar e um adulto escreve. Pode escrever do seu jeito. Não tem certo nem errado.";
    var area = document.createElement("textarea");
    area.id = "resposta-mini";
    area.spellcheck = false;
    area.autocomplete = "off";
    area.setAttribute("autocapitalize", "off");
    area.setAttribute("autocorrect", "off");
    area.value = armazem.ler().mini[p.id] || "";
    area.addEventListener("input", function () {
      armazem.mudar(function (d) { d.mini = miniResponder(d.mini, p.id, area.value); return d; });
    });
    campo.appendChild(rotulo);
    campo.appendChild(ajuda);
    campo.appendChild(area);
    tela.appendChild(campo);

    var desenhar = document.createElement("a");
    desenhar.className = "botao-simples";
    desenhar.href = "desenhar.html";
    desenhar.textContent = "Desenhar a resposta";
    tela.appendChild(desenhar);

    var ultima = i === MINI_PERGUNTAS.length - 1;
    tela.appendChild(botao(ultima ? "Terminei" : "Próxima pergunta", "botao", function () {
      if (ultima) { terminou = true; } else { i++; }
      mostrar();
    }));

    var fileira = document.createElement("div");
    fileira.className = "botao-fileira";
    if (i > 0) { fileira.appendChild(botao("Voltar", "botao-simples", function () { i--; mostrar(); })); }
    if (!ultima) { fileira.appendChild(botao("Pular", "botao-simples", function () { i++; mostrar(); })); }
    tela.appendChild(fileira);
  }

  function mostrarFim() {
    tela.textContent = "";
    var titulo = document.createElement("p");
    titulo.className = "pergunta mini-pergunta";
    titulo.textContent = "Prontinho!";
    tela.appendChild(titulo);

    var feitas = miniRespondidas(armazem.ler().mini);
    if (feitas.length === 0) {
      var vazio = document.createElement("p");
      vazio.className = "vazio";
      vazio.textContent = "Nenhuma resposta guardada. Tudo bem.";
      tela.appendChild(vazio);
    } else {
      var intro = document.createElement("p");
      intro.className = "explica";
      intro.textContent = "Isto é o que você disse:";
      tela.appendChild(intro);
      feitas.forEach(function (f) {
        var bloco = document.createElement("div");
        bloco.className = "resposta-anotada";
        var q = document.createElement("p");
        q.className = "passo";
        q.textContent = f.pergunta;
        var r = document.createElement("p");
        r.textContent = f.resposta;
        bloco.appendChild(q);
        bloco.appendChild(r);
        tela.appendChild(bloco);
      });
    }

    tela.appendChild(botao("Começar de novo", "botao-simples", function () { i = 0; terminou = false; mostrar(); }));
    var agora = document.createElement("a");
    agora.className = "botao-simples";
    agora.href = "index.html";
    agora.textContent = "Ir para a tela Agora";
    tela.appendChild(agora);
  }

  function mostrar() {
    if (terminou) { mostrarFim(); } else { mostrarPergunta(); }
    window.scrollTo(0, 0);
  }

  mostrar();
}());
