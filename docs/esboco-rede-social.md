# Esboço de uma rede social a partir do Enseada

Pedido pela Tathi em 26/11/2026. Ponto de partida: o Enseada como ele está
hoje. Isto é um esboço para decidir, não um plano de obra.

---

## 1. A verdade que decide tudo

**Rede social não cabe dentro do Enseada.** O princípio 3 do projeto diz
"nada sai do aparelho: sem conta, sem login, sem servidor". Pessoa falar com
pessoa exige exatamente as três coisas. Não há arranjo técnico que contorne
isso: ou o app guarda e transmite, ou não há rede.

Então a decisão não é "como faço o Enseada virar rede", e sim:

> **Um produto novo, separado, que herda os valores e o desenho do Enseada,
> e não o contrário.** O Enseada continua como está, offline e inteiro.

O nome, o visual, a fonte, a paleta e as regras de calma podem ser os mesmos.
A promessa de privacidade, não.

---

## 2. O que o Enseada já tem que quase nenhuma rede tem

Isto é o ativo real, e é de onde o produto novo deve nascer:

| O que existe | Por que vale |
| --- | --- |
| Âncoras escritas pela própria pessoa | Conteúdo curto, útil e sem performance |
| Sem contador, sem sequência, sem data de uso | Não há máquina de engajamento |
| "Entrar, resolver, sair" em 40 segundos | O oposto de feed infinito |
| Modo baixo estímulo desde a primeira abertura | Acessível a quem nenhuma rede atende |
| Regra de honestidade: nunca prometer benefício | Protege juridicamente e eticamente |
| Levar e trazer âncoras por arquivo (já pronto) | É a versão offline da rede inteira |

O último item é o mais importante: **a funcionalidade de compartilhar âncoras
por arquivo já é a rede, só que sem servidor.** O produto novo é isso, com o
arquivo trocado automaticamente.

---

## 3. A ideia central

**Não é um feed de pessoas. É uma biblioteca de âncoras.**

Numa rede comum, o conteúdo é a pessoa: quem ela é, o que ela está fazendo,
quantos a seguem. Aqui o conteúdo é **o que funcionou para alguém**, solto da
pessoa que escreveu.

Alguém em recaída de insônia não quer conhecer gente. Quer saber o que a
outra pessoa faz às três da manhã. Isso é a âncora, e ela cabe em duas linhas.

---

## 4. Três formatos possíveis, do mais seguro ao mais arriscado

### Formato A — Biblioteca de âncoras (recomendado para começar)

Pessoas enviam âncoras. Passam por moderação. Outras pessoas procuram por
situação e trazem para o app delas, onde viram âncora própria e editável.

- **Não tem**: perfil, seguidor, curtida, comentário, mensagem, contador.
- **Tem**: enviar, procurar por situação, trazer para mim, denunciar.
- Interação entre pessoas: **nenhuma.** É uma biblioteca, não uma praça.
- Risco de abuso: baixo. Não há como atacar alguém se não há alguém.
- Custo de moderação: existe, mas é fila de texto curto, não conversa ao vivo.

### Formato B — Duplas

Duas pessoas que já se conhecem trocam âncoras entre si, por convite, sem
espaço público. É o "levar e trazer" de hoje, automatizado.

- Risco: médio. Não há público, mas há um canal privado entre duas pessoas,
  e canal privado é onde acontece coerção e abuso sem testemunha.
- Exige: bloquear, sair, denunciar, e guardar o mínimo para apurar denúncia —
  o que já obriga a guardar conteúdo.

### Formato C — Rede aberta

Perfis, feed, resposta. **Não recomendo**, e não por timidez: cada peça que a
torna "rede de verdade" é uma peça que o Enseada tirou de propósito. Feed
infinito, notificação que puxa de volta, curtida e contador são exatamente o
que o princípio 1 existe para evitar. Construir isso é construir outro app com
valores opostos usando o mesmo nome.

---

## 5. O que NUNCA pode ser copiado das redes

Lista curta e inegociável, qualquer que seja o formato:

1. Feed infinito e rolagem sem fim.
2. Notificação cuja função é trazer a pessoa de volta.
3. Curtida, visualização, número de seguidores, qualquer contador público.
4. Sequência ("você usou 7 dias seguidos").
5. Algoritmo de recomendação que decide o que ela vê.
6. Vermelho na interface, animação, pop-up.

Tudo isso é máquina de prender. O Enseada existe porque a pessoa sai dele.

---

## 6. Conta sem identidade

Rede precisa saber "é a mesma pessoa de ontem?". Não precisa saber **quem**.

- Chave gerada no aparelho na primeira abertura. Sem e-mail, sem telefone,
  sem nome, sem foto.
- Recuperação: um código de 12 palavras que a pessoa guarda. Perdeu, perdeu —
  e isso é dito antes, com todas as letras.
- O servidor guarda: a chave pública, as âncoras enviadas, a data de envio.
  Nada mais.
- Nada liga a chave a um aparelho, a um IP guardado ou a um login social.

**Risco honesto**: sem e-mail não há como avisar de nada, e não há suporte
para quem perde o código. Em troca, não há base de dados de pessoas com
transtorno mental para vazar. A troca vale.

---

## 7. O problema que decide se isto existe: moderação

Um espaço onde pessoas em sofrimento escrevem umas para as outras atrai, sem
exceção, conteúdo que incentiva automutilação, jejum e suicídio. Não é
hipótese: é o histórico de todo app desse tipo.

Então:

- **Toda âncora passa por moderação antes de aparecer.** Nada entra ao vivo.
- Moderação humana, com apoio de filtro automático — não o contrário.
- Isso custa dinheiro por âncora e não escala sozinho. É o maior custo do
  produto, maior que servidor.
- Sem orçamento de moderação, **não lançar.** Lançar sem isso é publicar um
  canal de incentivo com a marca dela em cima.

Também obrigatório: botão de denúncia visível, resposta a denúncia com prazo,
e uma tela de emergência (que o Enseada já tem em Ajuda).

---

## 8. Legal — o que precisa estar resolvido antes da primeira linha de código

- **LGPD art. 11**: âncora num app de saúde mental pode ser dado pessoal
  sensível, mesmo sem nome. Exige base legal específica e consentimento
  destacado.
- **LGPD art. 14 e ECA**: o Enseada tem o Modo Mini, para crianças a partir
  de 3 anos. Uma rede **não pode** aceitar menor de idade sem consentimento
  dos pais. O mais simples e honesto: a rede é 18+, e isso a separa de vez
  do Enseadinha.
- **Encarregado de dados (DPO)** nomeado e publicado.
- **Termos de uso e política de privacidade** escritos por advogado, não por
  modelo pronto.
- **Posicionamento**: continua não sendo serviço de saúde. Isso fica mais
  difícil de sustentar quando pessoas aconselham pessoas — e é exatamente
  por isso que o Formato A, sem interação, é o mais defensável.
- **Lojas**: conteúdo gerado por usuário exige, nas regras da Apple e do
  Google, filtro, denúncia, bloqueio e contato do responsável. Sem isso o app
  é recusado.

---

## 9. Como ficaria por dentro

Mantendo o que já se sabe fazer:

- **Frente**: o mesmo HTML, CSS e JavaScript puro, a mesma fonte Atkinson
  Hyperlegible servida de dentro, a mesma paleta. PWA.
- **Servidor**: uma API pequena. Três rotas bastam para o Formato A —
  enviar âncora, procurar âncora, denunciar âncora.
- **Banco**: uma tabela de âncoras (texto, situação, data, estado de
  moderação) e uma de chaves públicas. Sem tabela de "usuários".
- **Sem log de IP** além do mínimo que a lei exige, e com prazo de descarte
  escrito.
- **Hospedagem**: Cloudflare, que ela já usa nos outros dois produtos.

O app do Enseada continua funcionando sem internet. A rede é uma tela a mais,
que só funciona online e diz isso.

---

## 10. Por onde começar, se começar

1. Decidir o formato (A, B ou C). Sem isso nada mais importa.
2. Conversar com o advogado — a conversa que já está pendente no Enseada,
   agora com um motivo maior.
3. Orçar a moderação. Se não fechar, para aqui, e o "levar e trazer por
   arquivo" que já existe continua sendo a resposta.
4. Só então: desenhar as três telas e escrever a API.

**Recomendação**: Formato A. É o único que pode ser construído sem trair o
que o Enseada diz na primeira tela, e é o único cujo custo de moderação cabe
numa pessoa só.

---

## 11. O que já está pronto e serve de ensaio

O "Compartilhar minhas âncoras" e o "Trazer âncoras de um arquivo", entregues
hoje, são o Formato A sem servidor. Dá para usar isso com pessoas reais, de
graça, e descobrir antes de gastar:

- As pessoas querem mesmo âncoras de desconhecidos?
- O que elas escrevem precisa de moderação de verdade?
- Duas linhas bastam, ou falta contexto?

Se a resposta for não, a rede não precisa existir — e descobrir isso custou
um arquivo .json.
