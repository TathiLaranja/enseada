/* Pouso - a logica do roteiro "Me ajuda a achar".
   Funcoes puras: recebem o estado, devolvem um estado novo. Nao gravam nada
   e nao tocam em tela.

   A regra que manda aqui: o app so devolve as palavras dela. Nenhuma funcao
   deste arquivo acrescenta uma palavra que a pessoa nao escreveu. A unica
   coisa que o app escreve sao as perguntas - e elas estao em perguntas.js. */

var ETAPAS = ["abertura1", "abertura2", "memoria", "escolher", "mecanismo", "fim"];

function linhas(texto) {
  if (typeof texto !== "string") { return []; }
  return texto.split("\n").map(function (l) {
    return l.replace(/^[-*•\s]+/, "").trim();
  }).filter(function (l) { return l !== ""; });
}

function iniciar() {
  return {
    etapa: "abertura1",
    indice: 0,
    abertura1: "",
    abertura2: "",
    memoria: "",
    itens: [],
    itemEscolhido: "",
    mecanismo: []
  };
}

function copiar(estado) {
  return JSON.parse(JSON.stringify(estado));
}

/* As duas aberturas vieram curtas? Entao desce para a memoria unica.
   Curto aqui e menos de tres linhas somando as duas. */
function veioCurto(estado) {
  return linhas(estado.abertura1).length + linhas(estado.abertura2).length < 3;
}

function listaDeItens(estado) {
  var tudo = linhas(estado.abertura1)
    .concat(linhas(estado.abertura2))
    .concat(linhas(estado.memoria));
  var vistos = [];
  return tudo.filter(function (item) {
    var chave = item.toLowerCase();
    if (vistos.indexOf(chave) !== -1) { return false; }
    vistos.push(chave);
    return true;
  });
}

function avancar(estado) {
  var novo = copiar(estado);
  if (novo.etapa === "abertura1") {
    novo.etapa = "abertura2";
    return novo;
  }
  if (novo.etapa === "abertura2") {
    novo.etapa = veioCurto(novo) ? "memoria" : "escolher";
    novo.itens = listaDeItens(novo);
    return novo;
  }
  if (novo.etapa === "memoria") {
    novo.etapa = "escolher";
    novo.itens = listaDeItens(novo);
    return novo;
  }
  if (novo.etapa === "escolher") {
    novo.etapa = "mecanismo";
    novo.indice = 0;
    return novo;
  }
  if (novo.etapa === "mecanismo") {
    if (novo.indice + 1 >= 10) {
      novo.etapa = "fim";
      return novo;
    }
    novo.indice = novo.indice + 1;
    return novo;
  }
  return novo;
}

function responder(estado, texto) {
  var novo = copiar(estado);
  var valor = typeof texto === "string" ? texto.trim() : "";

  if (novo.etapa === "abertura1") { novo.abertura1 = valor; }
  else if (novo.etapa === "abertura2") { novo.abertura2 = valor; }
  else if (novo.etapa === "memoria") { novo.memoria = valor; }
  else if (novo.etapa === "escolher") { novo.itemEscolhido = valor; }
  else if (novo.etapa === "mecanismo") { novo.mecanismo[novo.indice] = valor; }

  return avancar(novo);
}

/* Pular existe em toda pergunta e nao guarda nada. */
function pular(estado) {
  var novo = copiar(estado);
  if (novo.etapa === "mecanismo") { novo.mecanismo[novo.indice] = ""; }
  return avancar(novo);
}

function voltar(estado) {
  var novo = copiar(estado);
  if (novo.etapa === "mecanismo" && novo.indice > 0) {
    novo.indice = novo.indice - 1;
    return novo;
  }
  var posicao = ETAPAS.indexOf(novo.etapa);
  if (posicao > 0) {
    novo.etapa = ETAPAS[posicao - 1];
    if (novo.etapa === "memoria" && !veioCurto(novo)) { novo.etapa = "abertura2"; }
    if (novo.etapa === "mecanismo") { novo.indice = 9; }
  }
  return novo;
}

/* O que a pessoa de fato respondeu nas dez perguntas, sem as puladas. */
function respostasDadas(estado) {
  var dadas = [];
  for (var i = 0; i < 10; i++) {
    var r = estado.mecanismo[i];
    if (typeof r === "string" && r.trim() !== "") { dadas.push(r.trim()); }
  }
  return dadas;
}

/* A devolutiva. Repete o que ela disse e para ai.
   Se ela pulou tudo, nao existe devolutiva: o app nao inventa uma. */
function montarDevolutiva(estado) {
  var dadas = respostasDadas(estado);
  if (dadas.length === 0) { return null; }
  return {
    item: estado.itemEscolhido,
    palavras: dadas
  };
}

/* O rascunho que vai para a tela de cadastro, com o campo "o que isso faz em
   voce" ja preenchido com as palavras que ela acabou de usar. */
function rascunhoDeAncora(estado) {
  var dadas = respostasDadas(estado);
  return {
    oQueE: estado.itemEscolhido || "",
    oQueFaz: dadas.join(". ")
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ETAPAS: ETAPAS,
    linhas: linhas,
    iniciar: iniciar,
    veioCurto: veioCurto,
    listaDeItens: listaDeItens,
    avancar: avancar,
    responder: responder,
    pular: pular,
    voltar: voltar,
    respostasDadas: respostasDadas,
    montarDevolutiva: montarDevolutiva,
    rascunhoDeAncora: rascunhoDeAncora
  };
}
