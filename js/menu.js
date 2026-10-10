/* Enseada - o menu fixo de baixo, o mesmo em todas as telas.
   Fica num lugar so: para mudar o menu, muda aqui e vale para todas.
   Sao cards grandes, com desenho e nome escrito. A tela em que a pessoa esta
   fica em azul de enseada, em negrito, com borda grossa e aria-current; cor
   nunca e a unica pista.

   O ultimo card nao leva a lugar nenhum: liga e desliga o Modo Mini
   (Enseadinha). Ele diz o estado em palavra ("ligado" / "desligado") e usa
   aria-pressed. */

var ITENS_DO_MENU = [
  { arquivo: "index.html", texto: "Agora", nome: "Agora", icone: "M4 11 L12 4 L20 11 V20 H4 Z" },
  { arquivo: "ancoras.html", texto: "Âncoras", nome: "Minhas âncoras", icone: "M12 3 V19 M7 8 H17 M5 14 C5 18 9 20 12 20 C15 20 19 18 19 14" },
  { arquivo: "achar.html", texto: "Achar", nome: "Me ajuda a achar", icone: "M10 4 A6 6 0 1 0 10 16 A6 6 0 1 0 10 4 M14.5 14.5 L20 20" },
  { arquivo: "escrever.html", texto: "Escrever", nome: "Escrever", icone: "M4 20 L5 15 L16 4 L20 8 L9 19 Z M14 6 L18 10" },
  { arquivo: "desenhar.html", texto: "Desenhar", nome: "Desenhar", icone: "M3 16 C7 6 10 20 14 10 C16 5 19 8 21 6" },
  { arquivo: "fotos.html", tambem: ["album.html"], texto: "Fotos", nome: "Fotos e álbum", icone: "M3 7 H8 L10 5 H14 L16 7 H21 V19 H3 Z M12 9 A3.5 3.5 0 1 0 12 16 A3.5 3.5 0 1 0 12 9" },
  { arquivo: "jogos.html", texto: "Jogos", nome: "Jogos calmos", icone: "M5 5 H19 V19 H5 Z M9 9 H9.01 M15 9 H15.01 M12 12 H12.01 M9 15 H9.01 M15 15 H15.01" },
  { arquivo: "rede.html", texto: "Rede", nome: "Minha rede", icone: "M8 7 A3 3 0 1 0 8 13 A3 3 0 1 0 8 7 M16 9 A2.5 2.5 0 1 0 16 14 A2.5 2.5 0 1 0 16 9 M3 20 C3 16 5 15 8 15 C11 15 13 16 13 20 M14 20 C14 17.5 15 17 16 17 C18 17 19 18 20 20" },
  { arquivo: "ajuda.html", texto: "Ajuda", nome: "Ajuda", icone: "M4 7 H20 M4 12 H20 M4 17 H20 M9 5 V9 M15 10 V14 M8 15 V19" }
];

var ICONE_MINI = "M12 4 A4 4 0 1 0 12 12 A4 4 0 1 0 12 4 M5 20 C5 16 8 14 12 14 C16 14 19 16 19 20";

function arquivoDaTela(caminho) {
  var ultimo = String(caminho || "").split("/").pop();
  return ultimo === "" ? "index.html" : ultimo;
}

function desenharIcone(caminho) {
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "icone-menu");
  var p = document.createElementNS(ns, "path");
  p.setAttribute("d", caminho);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", "currentColor");
  p.setAttribute("stroke-width", "1.8");
  p.setAttribute("stroke-linecap", "round");
  p.setAttribute("stroke-linejoin", "round");
  svg.appendChild(p);
  return svg;
}

function montarMenu(caminho) {
  var atual = arquivoDaTela(caminho);
  var envoltorio = document.createElement("div");
  envoltorio.className = "menu-envoltorio";

  var alternar = document.createElement("button");
  alternar.type = "button";
  alternar.className = "menu-alternar";
  alternar.setAttribute("aria-expanded", "true");

  var nav = document.createElement("nav");
  nav.className = "menu-rodape";
  nav.setAttribute("aria-label", "Telas do Enseada");

  function atualizarBotao(recolhido) {
    alternar.textContent = recolhido ? "⌃" : "⌄";
    alternar.setAttribute("aria-label", recolhido ? "Mostrar navegação" : "Recolher navegação");
    alternar.setAttribute("aria-expanded", recolhido ? "false" : "true");
    nav.inert = recolhido;
    envoltorio.classList.toggle("recolhido", recolhido);
    document.body.classList.toggle("menu-recolhido", recolhido);
  }

  alternar.addEventListener("click", function () {
    atualizarBotao(!envoltorio.classList.contains("recolhido"));
  });

  ITENS_DO_MENU.forEach(function (item) {
    var link = document.createElement("a");
    link.href = item.arquivo;
    link.className = "card-menu";
    link.appendChild(desenharIcone(item.icone));
    var texto = document.createElement("span");
    texto.textContent = item.texto;
    link.appendChild(texto);
    link.setAttribute("aria-label", item.nome);
    if (item.arquivo === atual || (item.tambem || []).indexOf(atual) !== -1) {
      link.setAttribute("aria-current", "page");
    }
    nav.appendChild(link);
  });

  nav.appendChild(montarCardMini(atual));
  envoltorio.appendChild(alternar);
  envoltorio.appendChild(nav);
  document.body.appendChild(envoltorio);
  atualizarBotao(false);
}

function montarCardMini(atual) {
  var botao = document.createElement("button");
  botao.type = "button";
  botao.className = "card-menu";
  botao.id = "card-mini";
  botao.appendChild(desenharIcone(ICONE_MINI));
  var texto = document.createElement("span");
  botao.appendChild(texto);

  function dizer() {
    var ligado = typeof criarArmazenamento === "function" &&
      criarArmazenamento(window.localStorage).ler().ajustes.modo === "mini";
    botao.setAttribute("aria-pressed", ligado ? "true" : "false");
    texto.textContent = ligado ? "Mini ligado" : "Mini desligado";
    botao.setAttribute("aria-label",
      "Modo Mini, Enseadinha, para crianças. Agora está " + (ligado ? "ligado" : "desligado") + ". Toque para trocar.");
  }

  botao.addEventListener("click", function () {
    var ligado = botao.getAttribute("aria-pressed") === "true";
    guardarAjuste("modo", ligado ? "adulto" : "mini");
    dizer();
    /* A tela Me ajuda a achar muda de conteudo com o modo: recarrega. */
    if (atual === "achar.html" || atual === "ajuda.html") { window.location.reload(); }
  });

  dizer();
  return botao;
}

if (typeof document !== "undefined") {
  montarMenu(window.location.pathname);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ITENS_DO_MENU: ITENS_DO_MENU, arquivoDaTela: arquivoDaTela };
}
