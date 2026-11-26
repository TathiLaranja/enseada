# Rede social com a base do Enseada

26/11/2026 — Tathiane Laranja

Uma rede social nova, construída sobre a arquitetura, o layout e a filosofia
do Enseada — para pessoas que nenhuma rede atende hoje. O Enseada continua
existindo exatamente como está: offline, sem conta, sem servidor. Este é
outro produto, com outro nome.

---

## O que é

Uma rede onde pessoas neurodivergentes e com deficiência mostram uma às
outras **o que funcionou para elas se acalmarem**, sem serem geridas por um
algoritmo. O Enseada entra como base
pronta: a pilha técnica, o desenho, a paleta, a fonte, o modo baixo estímulo
e a regra de não prender ninguém.

O que não vem junto são os três princípios que só valiam para um app offline.
Esta rede tem conta, tem login e tem servidor, porque pessoa falar com pessoa
exige isso. Não é o Enseada mudando de ideia: é um segundo produto, com outro
nome, construído sobre o primeiro.

Para que serve, em uma frase: **é o Enseada com companhia.** O Enseada é onde
a pessoa guarda o que a acalma; aqui ela mostra isso para outras, e vê o que
acalma as outras.

E para que **não** serve, que é igualmente importante: **não é lugar de
desabafar dor.** Não é grupo de apoio, não é ouvidoria, não é diário de
sofrimento. Quem precisa disso precisa de gente de verdade, e a tela de
emergência diz onde encontrar.

Duas frases decidem o resto do documento:

> **Aqui a pessoa escolhe tudo que ela vê, e nada escolhe por ela.**
>
> **Aqui se mostra o que ajudou, não o que doeu.**

---

## O que vem do Enseada, pronto

Isto não é inspiração: é código, desenho e decisão já tomados e já testados.

| O que | Como entra na rede |
| --- | --- |
| HTML, CSS e JavaScript puro, PWA | Mesma pilha. Instala no celular, abre no navegador, uma base de código só |
| Paleta, Atkinson Hyperlegible, tamanho de letra ajustável | Iguais, servidas de dentro do projeto |
| Modo baixo estímulo desde a primeira abertura | Igual, e continua sendo o padrão, não um ajuste escondido |
| Nenhum vermelho, nenhuma animação, nenhum pop-up | Regra mantida, inclusive para notificação e erro |
| Uma coisa por tela, botão que diz o que faz | Regra mantida em todas as telas novas |
| Sem contador, sem sequência, sem data de uso | Regra mantida, e agora vale para curtida e seguidor também |
| Entrar, resolver, sair | Vira o oposto de feed infinito: a sessão tem fim |
| Som nunca informa sozinho, com teto de volume | Regra mantida, e passa a valer para notificação |
| Leitor de tela, teclado e gesto já resolvidos | Base da acessibilidade, não um remendo no fim |
| Regra de honestidade: nunca prometer benefício | Mantida, e fica mais necessária quando há gente aconselhando gente |

O ganho real é tempo: a parte mais difícil de um app acessível e calmo —
decidir como ele se comporta — já está decidida e escrita.

---

## O que muda, e o que isso obriga

Três coisas mudam, e nenhuma é negociável para quem quer conversar:
**conta, login e servidor.** O que isso obriga a assumir, com todas as letras:

- O dado sai do aparelho e fica guardado. Pode vazar, pode ser pedido por
  ordem judicial e pode ser perdido num erro de operação. Dizer o contrário
  seria mentira.
- Alguém responde por ele. Isso tem nome legal (encarregado de dados) e tem
  custo.
- Existe conteúdo escrito por desconhecidos. Isso exige moderação, e
  moderação custa mais que servidor.
- O app passa a depender de internet. A tela que depende disso diz isso, e
  não finge estar carregando.

A resposta honesta a esses quatro pontos não é esconder: é **guardar o mínimo
possível**, para que um vazamento tenha pouco a vazar. O resto do documento
é, em boa parte, isso.

---

## Sem algoritmo: a pessoa escolhe

A regra: **nada aparece para a pessoa que ela não tenha pedido.** Não existe
"para você", não existe sugestão de amizade, não existe ordenação por
relevância.

Como ela encontra, então:

1. **Salas por assunto**, de uma lista fechada e curta, escrita por quem
   cuida do app. Ela entra e sai quando quer. Sem hashtag livre, que vira
   porta de entrada de qualquer coisa.
2. **Ordem do mais novo para o mais antigo**, dentro da sala, e só isso.
   Nenhum critério oculto.
3. **Busca por palavra**, quando ela procura alguma coisa de propósito.
4. **Pessoas que ela escolheu acompanhar**, uma a uma, sem número de
   seguidores aparecendo para ninguém.

E a sessão **acaba**. Quando ela chega no que já tinha lido, a tela diz que
acabou e oferece sair. Não carrega mais nada, nem com rolagem, nem com puxar
para baixo. Esse único detalhe é o que separa esta rede de todas as outras:
o feed infinito não é um recurso, é o mecanismo.

Quem decide o ritmo também é ela: escolhe de quanto em quanto tempo quer ver
coisa nova, e o padrão é **uma vez por dia**, não tempo real.

---

## O que se publica

Três coisas, e todas são coisas que a pessoa faz dentro do próprio app:

| O que | Quanto tempo fica | De onde sai |
| --- | --- | --- |
| Texto | Fica, até ela apagar | A tela Escrever: um poema, um recado, o que ela quiser |
| Desenho | Fica, até ela apagar | A tela Desenhar |
| Foto | **24 horas, sempre** | A tela Fotos e o álbum de retratos |

Nada de vídeo e nada de áudio tocando dentro do app.

### Música: o link, e só o link

Dá para dizer o que está ouvindo. A pessoa cola o endereço da música
(Spotify, Deezer, YouTube, Apple Music, Bandcamp) e escreve com as palavras
dela o que é: artista e nome.

O app **não** põe o tocador na tela, **não** toca nada e **não** busca nada
no site da música. Aparece o texto que ela escreveu e um botão que abre no
aplicativo de música dela, fora da rede.

Três motivos, todos do mesmo princípio:

- O tocador embutido é um rastreador do Spotify ou do Google dentro do app, e
  isso está proibido na lista do que não existe.
- O tocador toca sozinho e não segue nenhuma regra de acessibilidade da casa.
- Buscar o nome da música no site deles seria uma requisição externa por cada
  publicação. A pessoa escrever o nome custa dois segundos e mantém a rede
  sem tráfego para fora.

Só endereço dessas casas conhecidas é aceito. Campo de link livre vira, em
uma semana, porta de golpe e de propaganda.

### O tom: o que vale e o que não é aqui

O conteúdo é **o que acalmou você hoje**, concreto e seu. Não é conselho, não
é frase de efeito e não é dor.

| Vale | Não é aqui |
| --- | --- |
| "Lavar louça com a janela aberta me tirou do lugar hoje" | "Hoje foi horrível, não aguento mais" |
| O desenho que ela fez para se acalmar | O desenho do que está doendo |
| A foto do céu que ela parou para olhar | A foto do ferimento, do remédio, do hospital |
| A música que ela pôs para se regular | A música como recado para alguém |
| "Funciona para mim" | "Você tem que", "basta querer", "escolha ser feliz" |

Duas linhas que não podem ser cruzadas, nos dois sentidos:

- **Não é lugar de desabafar dor.** Quem precisa disso precisa de gente, e a
  tela de emergência diz onde encontrar.
- **Não é coach.** Nada de promessa, nada de receita, nada de "se você
  quiser, você consegue". Isso é a regra de honestidade do Enseada valendo
  aqui: oferecer, nunca prometer. Positividade forçada machuca pessoa
  neurodivergente tanto quanto desabafo em cima de desabafo.

O meio entre as duas é estreito de propósito, e tem nome: **a pessoa conta o
que ela fez, não o que você deveria fazer.**

### Por que a foto some em 24 horas

Não é moda de story: é proteção, e muda o comportamento de quem publica e de
quem vê.

- **Não vira acervo.** Nada do rosto, do corpo ou da casa de ninguém fica
  guardado para sempre num servidor.
- **Não vira fórum de comentário.** O que some em um dia não acumula
  discussão em cima.
- **Não vira comparação.** Sem histórico de fotos, não há perfil bonito para
  competir com.
- **Reduz o que pode vazar.** O que não está guardado não vaza.

A diferença para o story do Instagram está no que NÃO vem junto: aqui não há
quem viu, nem quantos viram, nem responder na foto. Ela some e pronto.

### Descrição escrita é obrigatória

Foto e desenho **não publicam sem uma descrição escrita.** Não é campo
opcional, não é sugestão: o botão de publicar fica desligado até ela escrever.

É o que separa esta rede de todas as outras na acessibilidade. Em qualquer
rede comum, imagem sem descrição é parede para quem não enxerga, e a
descrição é sempre opcional, então quase ninguém escreve. Aqui é regra do
produto. Isso dá um pouco mais de trabalho para publicar, e esse é o preço de
uma rede onde pessoa cega consegue participar de verdade.

---

## Acessibilidade total é o produto

Nas outras redes a acessibilidade é um ajuste no fim. Aqui ela é a razão de
existir, e isso muda o que se constrói primeiro.

| Quem | O que a rede faz |
| --- | --- |
| Cega ou baixa visão | Tudo é texto, toda tela andada por leitor de tela e por teclado; tamanho de letra ajustável; nenhuma informação só por cor |
| Surda | Nada depende de som; notificação sempre escrita |
| TDAH | Sessão com fim, sem rolagem infinita, sem notificação que puxa de volta, ritmo escolhido pela pessoa |
| Autista | Modo baixo estímulo padrão, sem animação, linguagem literal, nenhuma metáfora, regra escrita para cada tela |
| Deficiência motora | Alvo mínimo de 44 px, teclado completo, nenhum gesto obrigatório, nenhum tempo para responder |
| Deficiência intelectual | Texto simples, uma coisa por tela, botão que diz o que faz |
| Crise de ansiedade ou pânico | Nenhuma contagem, nenhum "visto às", nenhuma pressão de responder |

Duas regras que vêm junto e são duras de cumprir, mas decidem tudo:

1. **Nada tem prazo.** Nenhum conteúdo expira, nenhuma mensagem some, nenhuma
   tela corre contra o relógio.
2. **Nada diz se a pessoa estava online, leu ou demorou.** A pressão de
   responder é o que faz gente ansiosa abandonar rede.

---

## Conta com o mínimo de identidade

A rede precisa saber que é a mesma pessoa de ontem. Não precisa saber **quem**
ela é.

**O servidor guarda:** um apelido escolhido por ela, uma senha (ou chave do
próprio aparelho), os textos que ela publicou, e as salas que ela escolheu.

**O servidor não guarda:** nome real, foto, telefone, data de nascimento além
de "tem 18 anos", contatos da agenda, localização, histórico de navegação,
nada de rede social de terceiro e nenhum rastreador.

Um e-mail é pedido e fica **opcional**: serve só para recuperar a senha. Quem
não dá recebe um código de recuperação para guardar, e o app avisa, antes,
que perdeu o código perdeu a conta.

Isso tem um custo honesto: sem e-mail não há como avisar de nada nem socorrer
quem esquece. Em troca, não existe um banco de dados ligando nome, rosto e
sofrimento de ninguém. A troca vale.

---

## O que não existe, e não é negociável

Cada item desta lista é uma peça que as redes usam para prender gente. Se
alguma voltar, o produto virou o que ele existe para não ser.

1. Rolagem infinita e carregamento automático.
2. Curtida, coração, voto, qualquer métrica pública de aprovação.
3. Número de seguidores, de visualizações ou de respostas, para quem quer que
   seja.
4. Sequência de dias, medalha, nível, troféu.
5. Notificação cuja função é trazer a pessoa de volta.
6. Recomendação de conteúdo, de sala ou de gente.
7. "Online agora", "visto às", "digitando", quem viu a sua foto.
8. Anúncio e qualquer rastreador de terceiro.
9. Impulsionar, destacar ou pagar para aparecer mais.
10. Vídeo, áudio e reel.

A lista entra nos termos de uso, não só na cabeça de quem programa: vira
promessa que dá para cobrar.

A foto que some em 24 horas não entra nesta lista, e a diferença importa: ela
some para proteger quem publicou, não para criar pressa em quem vê. Sem
contador de visualização e sem resposta na foto, não sobra nada do mecanismo
do story.

---

## As regras, lidas e aceitas antes de entrar

Antes da primeira tela da rede, uma tela de regras. Não uma caixinha no
rodapé: a tela inteira, em texto simples, que precisa ser rolada até o fim
para o botão "Li e concordo" ligar. As regras ficam depois no menu, sempre, e
quem quiser relê sem procurar.

A tela diz, nesta ordem: **o que esta rede é**, **o que ela não é** e **o que
dá banimento.**

### O que dá banimento imediato

Vale igual para foto, desenho e texto. Não tem aviso, não tem segunda
chance, não tem advertência:

1. Nudez e qualquer conteúdo sexual.
2. Morte, ferimento, sangue, corpo machucado.
3. Automutilação, jejum, suicídio — mostrar, ensinar ou incentivar.
4. Ataque a uma pessoa ou a um grupo: ofensa, ameaça, perseguição,
   capacitismo, racismo, LGBTfobia.
5. Foto de outra pessoa sem que ela saiba.
6. Dado de contato de alguém, inclusive o próprio, exposto para desconhecido.
7. Venda, propaganda e corrente.

A pessoa banida perde a conta e o que publicou sai do ar. Isso é dito na tela
de regras, com essas palavras, antes de ela entrar — nada disso pode ser
surpresa depois.

### O que não é aqui, e não dá banimento

Separado de propósito do banimento, porque não é falta: é lugar errado.

Desabafo de dor, pedido de socorro, discussão, conselho de coach e frase de
autoajuda saem do ar, e a pessoa recebe um recado curto, sem bronca, dizendo
por que aquilo não fica e para onde ir — a tela de emergência, se for
socorro.

Nunca com a palavra "violação", nunca com advertência, nunca com punição.
Quem estava mal e escreveu não pode sair dali se sentindo repreendida.

---

## Moderação: o maior custo

Mesmo sendo uma rede do que acalma, ela reúne gente que está em dia ruim — e
todo lugar assim atrai conteúdo que incentiva automutilação, jejum e
suicídio. Não é hipótese: é o histórico de todo app do tipo, e é o motivo de
vários terem fechado. A regra do tom reduz muito isso, mas não dispensa
moderação.

O que o projeto precisa ter, desde o primeiro dia:

- **Denunciar visível em tudo** — texto, desenho, foto e música — com
  resposta em prazo escrito.
- **Bloquear e silenciar**, sem a outra pessoa saber.
- **Filtro automático** de palavra de risco no texto e de nudez na imagem,
  que manda para fila humana — nunca que decide sozinho o banimento.
- **Fila humana de verdade**, com gente responsável olhando.
- **Tela de emergência** com quem ligar, que o Enseada já tem na Ajuda.

A foto que some em 24 horas **não** facilita a moderação, facilita o
contrário: dá um dia para agir e depois a prova sumiu. Por isso, duas
decisões junto:

- A foto passa pelo filtro automático **antes** de aparecer para alguém.
- Foto denunciada **fica guardada** fora da rede até a denúncia ser decidida,
  mesmo depois das 24 horas. Isso vai escrito nas regras e na política de
  privacidade.

### Moderação sem dinheiro

O filtro automático sai de graça, e nem toca no servidor:

- **Palavra de risco no texto**: uma lista de palavras conferida numa Edge
  Function. Custo zero.
- **Nudez na imagem**: um modelo aberto que roda **no próprio navegador** da
  pessoa, antes de a foto subir. Se acusar, a foto nem sai do aparelho. Custo
  zero e nada trafegado.

O filtro de navegador se engana e dá para burlar com um app modificado, então
ele pega descuido, não quem quer fazer mal de propósito. É por isso que a
fila humana existe.

A fila humana é a única parte que não tem versão grátis comprada. A versão
grátis dela é **gente**: você, no começo, e depois algumas pessoas de
confiança da própria rede, com um botão de esconder na hora e sem poder de
banir sozinhas.

Isso só funciona com uma condição, e ela é a regra de ouro do projeto:

> **A rede cresce até onde as pessoas que moderam de graça dão conta, e para
> ali.**

Não é limitação temporária: é como ela fica. Entrada por convite, e quando a
fila de denúncia atrasar, fecha convite novo até desatolar. Rede pequena que
dá conta vale mais que rede grande sem ninguém olhando — e, para o que ela
serve (não se sentir sozinha), pequena já resolve.

---

## Legal, antes da primeira linha de código

A base é a mesma do Cruzar Vagas, que já foi montada assim: política de
privacidade, termos, direito de baixar os próprios dados e função de excluir
a conta de verdade. Não se começa do zero, se copia a estrutura e se ajusta
ao que muda aqui.

| Item | No Cruzar Vagas | O que muda nesta rede |
| --- | --- | --- |
| Política de privacidade e termos | Já existem | Acrescentar conteúdo escrito por gente e a foto de 24 horas |
| Excluir a conta | Função `excluir-conta` pronta | Igual, apagando também o que a pessoa publicou |
| Baixar os próprios dados | Pendente lá também | Fazer uma vez e usar nos dois |
| Encarregado de dados (DPO) | A nomear | O mesmo nome serve para os dois produtos |

O que é novo e não existe no Cruzar Vagas:

- **LGPD art. 11.** Texto sobre a própria saúde mental é dado pessoal
  sensível, mesmo sem nome junto. Exige base legal específica e consentimento
  destacado, não enterrado nos termos — a tela de regras resolve isso, se for
  escrita direito.
- **Idade.** A rede é 18+. Isso a separa de vez do Enseadinha e evita o ECA e
  o art. 14, que exigem consentimento de quem tem a guarda.
- **Foto denunciada guardada depois das 24 horas.** Tem de estar escrito, com
  prazo de descarte.
- **Posicionamento.** Continua não sendo serviço de saúde, e isso fica mais
  difícil de sustentar quando pessoas aconselham pessoas: o aviso aparece na
  própria sala, não só no rodapé.
- **Lojas.** Apple e Google exigem, para conteúdo escrito por usuário:
  filtro, denúncia, bloqueio e contato do responsável. Sem os quatro o app é
  recusado.

A conversa com advogado que já estava pendente no Enseada passa a ser o
primeiro item do cronograma, não o último — e serve para os três produtos de
uma vez.

---

## Arquitetura, com o que ela já sabe

A vantagem escondida: o back que esta rede precisa é **exatamente o que o
Cruzar Vagas e o Claquete Box já usam.** Não é tecnologia nova para aprender.

| Camada | O que usar | Plano grátis dá conta? |
| --- | --- | --- |
| Frente | HTML, CSS e JS puro, PWA | Sim |
| Hospedagem da frente | Cloudflare Pages | Sim, com banda sem teto |
| Conta e login | Supabase Auth | Sim, para rede pequena |
| Banco | Postgres do Supabase, com RLS por linha | Sim, até o teto de espaço do plano |
| Regras de servidor | Edge Functions do Supabase | Sim |
| Foto de 24 horas | Cloudflare R2 | Sim, e a saída de dado não é cobrada |
| Apagar foto vencida | Tarefa marcada no próprio banco | Sim |
| Filtro de nudez | Modelo aberto rodando no navegador | Sim, não usa servidor |
| Segredos | Secrets do Supabase, nunca em arquivo | Sim |

O banco cabe em cinco tabelas: pessoas, salas, textos, denúncias e bloqueios.
A RLS faz o trabalho pesado de privacidade dentro do próprio banco, que é
onde você já sabe mexer.

Três decisões técnicas que seguram a conta em zero:

- **A foto é reduzida no próprio celular antes de subir**, com o código que o
  Enseada já tem. Foto de 900 px em JPEG dá dezenas de KB, não megabytes.
- **A foto vive 24 horas.** O espaço guardado nunca cresce: no pior dia, é um
  dia de fotos.
- **Texto e desenho são leves.** Desenho é vetor ou PNG pequeno, não vídeo.

E as regras do Enseada continuam: **sem framework** e **sem CDN** — a fonte e
tudo o mais servidos de dentro do projeto.

**O que conferir antes de começar:** os tetos de plano grátis mudam de ano
para ano. Os números do Supabase e da Cloudflare têm de ser conferidos no
dia, e é deles que sai o tamanho máximo da rede.

---

## Custo zero, de verdade

A rede tem de ser de graça para quem usa **e** para quem mantém. Isso é
possível, com uma condição escrita com todas as letras.

O que sai de graça, hoje, nos planos gratuitos que você já usa:

| Custo | Como fica em zero |
| --- | --- |
| Hospedagem | Cloudflare Pages, plano grátis |
| Banco e login | Supabase, plano grátis |
| Foto | R2 da Cloudflare, e some em 24 horas |
| Filtro de nudez | Roda no navegador da pessoa |
| Filtro de palavra | Lista conferida numa Edge Function |
| Domínio | O único gasto de verdade: uns R$ 40 por ano, ou um subdomínio de um que você já tem |

O que **não** sai de graça em dinheiro nenhum é a fila humana de denúncia.
Ela sai de graça em tempo, e tempo também acaba. Daí a condição:

> **O tamanho da rede é o tamanho que as pessoas que moderam de graça dão
> conta.**

Isso significa, na prática: entrada por convite, nenhum crescimento buscado,
nenhuma divulgação paga, e convite fechado sempre que a fila atrasar. Uma
rede de algumas centenas de pessoas cabe em plano grátis e numa pessoa
moderando. Uma de dezenas de milhares não cabe em nenhum dos dois, e tentar é
como os outros apps do tipo quebraram.

O que **nunca** pode pagar a conta, se um dia ela precisar ser paga: anúncio,
dado de ninguém, lugar no que a pessoa vê, destaque e selo. Se chegar nesse
ponto, a saída honesta é doação ou assinatura de quem puder — nunca anúncio.

---

## Primeiro passo

Antes de escrever uma linha:

1. **Escolher o nome.** Separado do Enseada, que continua sendo o app offline.
2. **Conversar com o advogado.** A pendência que já existe, agora com motivo
   maior.
3. **Fazer a conta da moderação.** Se não fechar, o projeto para aqui, e isso
   é uma resposta legítima.

Depois disso, a primeira versão é pequena de propósito: entrar, escolher
sala, escrever, ler o que é novo, denunciar, bloquear, sair. Nada além.

**E dá para ensaiar de graça, hoje.** O Enseada já tem "Compartilhar minhas
âncoras" e "Trazer âncoras de um arquivo": isso é a rede inteira, sem
servidor, trocando arquivo à mão. Use com pessoas reais e descubra antes de
gastar:

- As pessoas querem mesmo ler o que desconhecidos escrevem?
- O que elas escrevem precisa de moderação de verdade, ou foi tranquilo?
- Texto curto basta, ou falta contexto?

Se a resposta for não, a rede não precisa existir — e descobrir isso custou
um arquivo.
