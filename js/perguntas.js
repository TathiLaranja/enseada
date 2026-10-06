/* Pouso - o texto das perguntas do roteiro.
   Separado da logica de proposito: mudar uma palavra aqui nao mexe em codigo.
   As perguntas sao as do documento, sem acrescimo.
   Nenhuma delas sugere resposta nem oferece exemplo de ancora. */

var ABERTURA_UM = "Liste tudo que você já fez na vida e parou de fazer.";

var AJUDA_ABERTURA_UM = "Esporte, curso, instrumento, artesanato, dança, hobby, qualquer coisa. Sem filtro e sem julgar se era bom. Uma por linha.";

var ABERTURA_DOIS = "O que você já faz hoje, que você nunca contou como algo que te ajuda?";

var AJUDA_ABERTURA_DOIS = "O que você faz sem perceber quando está inquieta, o que você deixa sempre à mão, o que você reassiste ou relê sem motivo, o que você faz quando não consegue dormir. Uma por linha.";

var MEMORIA_UNICA = "Lembra de uma vez que você estava travada e saiu? O que você estava fazendo na hora?";

var AJUDA_MEMORIA_UNICA = "Uma só já serve.";

var ESCOLHER_ITEM = "Qual destes você quer olhar de perto?";

var AJUDA_ESCOLHER_ITEM = "São as suas próprias linhas. Dá para voltar e olhar outro depois.";

var MECANISMO = [
  "Suas mãos estavam ocupadas?",
  "Seu corpo estava parado ou se movendo?",
  "Tinha palavra envolvida — letra, legenda, texto — ou era sem palavra?",
  "Tinha som? O som ajudava ou incomodava?",
  "Era algo que você já conhecia de cor, ou era novo cada vez?",
  "Tinha regra clara e você via progresso?",
  "Tinha gente por perto, ou você estava sozinha?",
  "Durava minutos ou horas?",
  "Você escolhia o ritmo, ou o ritmo vinha de fora?",
  "Depois disso, sua cabeça ficava mais quieta?"
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ABERTURA_UM: ABERTURA_UM,
    AJUDA_ABERTURA_UM: AJUDA_ABERTURA_UM,
    ABERTURA_DOIS: ABERTURA_DOIS,
    AJUDA_ABERTURA_DOIS: AJUDA_ABERTURA_DOIS,
    MEMORIA_UNICA: MEMORIA_UNICA,
    AJUDA_MEMORIA_UNICA: AJUDA_MEMORIA_UNICA,
    ESCOLHER_ITEM: ESCOLHER_ITEM,
    AJUDA_ESCOLHER_ITEM: AJUDA_ESCOLHER_ITEM,
    MECANISMO: MECANISMO
  };
}
