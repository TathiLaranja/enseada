/* Enseada - o menu fixo de baixo, o mesmo em todas as telas.
   Fica num lugar so: para mudar o menu, muda aqui e vale para todas.
   A tela em que a pessoa esta aparece em negrito, sublinhada e com a palavra
   "(aqui)" para leitor de tela; cor nunca e a unica pista. */

var ITENS_DO_MENU = [
  { arquivo: "index.html", texto: "Agora", nome: "Agora" },
  { arquivo: "ancoras.html", texto: "Âncoras", nome: "Minhas âncoras" },
  { arquivo: "achar.html", texto: "Achar", nome: "Me ajuda a achar" },
  { arquivo: "escrever.html", texto: "Escrever", nome: "Escrever" },
  { arquivo: "desenhar.html", texto: "Desenhar", nome: "Desenhar" },
  { arquivo: "jogos.html", texto: "Jogos", nome: "Jogos calmos" },
  { arquivo: "rede.html", texto: "Rede", nome: "Minha rede" },
  { arquivo: "ajuda.html", texto: "Ajuda", nome: "Ajuda" }
];

function arquivoDaTela(caminho) {
  var ultimo = String(caminho || "").split("/").pop();
  return ultimo === "" ? "index.html" : ultimo;
}

function montarMenu(caminho) {
  var atual = arquivoDaTela(caminho);
  var nav = document.createElement("nav");
  nav.className = "menu-rodape";
  nav.setAttribute("aria-label", "Telas do Enseada");

  ITENS_DO_MENU.forEach(function (item) {
    var link = document.createElement("a");
    link.href = item.arquivo;
    link.textContent = item.texto;
    link.setAttribute("aria-label", item.nome);
    if (item.arquivo === atual) {
      link.setAttribute("aria-current", "page");
    }
    nav.appendChild(link);
  });

  document.body.appendChild(nav);
}

if (typeof document !== "undefined") {
  montarMenu(window.location.pathname);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ITENS_DO_MENU: ITENS_DO_MENU, arquivoDaTela: arquivoDaTela };
}
