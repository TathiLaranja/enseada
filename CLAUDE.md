# Enseada — contexto para o Claude Code

PWA local de âncoras pessoais. Tudo no aparelho, sem conta e sem servidor.
Nome: Enseada. Pedido de marca depositado no INPI — depósito não é concessão,
então nada de anunciar marca registrada enquanto o registro não sair.
Falta conferir domínio e Play Store.

## Posicionamento (decide tudo)

Ferramenta de organização e autoconhecimento. **Não é serviço de saúde.**
O app organiza, guarda, pergunta e lembra. Não interpreta, não mede e não
promete resultado.

## Três princípios

1. **Entrar, resolver, sair.** Sucesso é a pessoa sair do app em 40 segundos.
   Nada no app serve para prender ninguém.
2. **Tudo é escrito pela pessoa.** O app nunca sugere uma âncora que ela não
   escreveu. Isso quebra por fora do campo de texto: placeholder com exemplo,
   lista vazia que sugere, peso já marcado, resumo do roteiro usando palavra do
   quadro de mecanismos. O quadro de mecanismos é referência interna e **nunca
   aparece para a pessoa**.
3. **Nada sai do aparelho.** Sem conta, sem login, sem servidor, sem
   sincronização. Funciona sem internet.

## Regras técnicas absolutas

- HTML, CSS e JavaScript puro. Sem framework, sem build, sem npm.
- Tudo em `localStorage`, pela única porta que é `js/armazenamento.js`.
- **Zero requisição externa.** Nenhuma API, nenhuma chave, nenhum analytics,
  nenhuma fonte de CDN. Fonte vai dentro do projeto.
- Service worker com **cache primeiro**. Sem bloco de push e sem notificação.
- Web Audio para o som (já em `js/som.js`), canvas para o desenho, sudoku
  gerado em JS.

## Modo baixo estímulo (já na primeira abertura, não é ajuste escondido)

- Uma coisa por tela. Uma pergunta, uma lista, um botão grande.
- Três cores por tema, no máximo: fundo, texto e um tom de destaque.
  Saturação baixa. Nem preto puro, nem branco puro.
- **Nenhum vermelho na interface**, nem para erro, nem para aviso. Única
  exceção: as cores de tinta do Desenhar (js/paleta.js), que são da pessoa.
- Cor nunca carrega significado sozinha: sempre junto com palavra.
- Sem animação. `prefers-reduced-motion` respeitado e, fora dele, nada anima.
- Claro e escuro: o Modo Baixo Estímulo liga só por escolha da pessoa (Ajuda).
- Botões que dizem o que fazem ("Guardar uma âncora", não "Vamos lá").
- Texto curto, sem metáfora. Nada de "respire e deixe a calma fluir".
- Atkinson Hyperlegible, tamanho ajustável, servida de dentro do projeto.
- Nenhum pop-up, banner, pedido de avaliação ou convite para assinar.
- **Nenhum contador, nenhuma sequência, nenhuma data de uso.** Âncora dormente
  não é falha: sai da lista sem explicação e volta quando ela quiser.

## Regra de honestidade (não negociável)

A pesquisa não sustenta quase nenhuma das ideias. O app **nunca** anuncia
benefício comprovado, em tela nenhuma, nem em loja, nem em divulgação.
Oferecer, nunca prometer. O ruído, quando entrar, leva aviso de volume.

## Paleta em uso (css/tema.css)

Proporção: **70% base neutra, 25% cores de expressão, 5% azul de enseada.**

| | Claro | Escuro (Baixo Estímulo) |
| --- | --- | --- |
| Fundo (Marfim) | `#FAF8F5` | `#25272B` |
| Texto (grafite quente) | `#454640` | `#E6E1D8` |
| Pêssego suave | `#E8B9A8` | `#D9A593` |
| Verde de restinga | `#A5B09A` | `#9BA68F` |
| Lavanda de neblina | `#B8B0C8` | `#A9A1BC` |
| Azul de enseada (destaque e seleção) | `#9EBBC0` | `#7FA3AA` |

O azul é claro demais para contorno (1,8:1): ele só preenche a seleção, que
também leva borda grossa e negrito. Contorno usa `--contorno` (3:1 ou mais).
Texto sobre bloco colorido usa `--texto-no-bloco`.

## Como trabalhar aqui

1. Responder em português do Brasil, simples e direto.
2. Mexer o MÍNIMO necessário. Não reescrever arquivo que funciona.
3. Quando houver algo para conferir, a **conferência vem primeiro**, sozinha,
   com o número da linha, e só depois os passos.
4. Nunca mandar "troque este trecho por aquele". Sempre o arquivo inteiro.
5. Teste de verdade: Node puro (`sh teste/executar.sh`), sem biblioteca, com
   prova de mutação — quebrar a regra de propósito e confirmar que o teste
   acusa. Teste de tela no navegador quando mexer em tela.
6. Antes de decidir cor ou aparência, mostrar as opções para a Tathi escolher.
7. Commit descreve o DEFEITO ou a decisão, não só a mudança.

## Modo Mini (Enseadinha)

Escolha de modo de uso (Adulto ou Mini), na Ajuda e no último card do menu.
Só a tela Me ajuda a achar muda: perguntas de até 6 palavras, uma por tela, com
desenho, para crianças a partir de 3 anos. Sem certo e sem errado, sem nota, sem
sublinhado de ortografia, sem resposta pronta. A criança fala (um adulto escreve),
escreve do jeito dela ou desenha. O roteiro dos adultos fica como está.

## Fotos

Ficam em `localStorage` pela porta única, reduzidas (lado maior 900 px) e
regravadas como JPEG, o que apaga a localização. Teto de 12 fotos. Só JPEG em
data URL é aceito na leitura.

## Álbum de retratos (scrapbook)

Aberto pela tela Fotos (o card Fotos do menu fica marcado nas duas). Começa com
3 páginas e a pessoa acrescenta quantas quiser. A página é uma folha em Marfim
`#FAF8F5` fixo (igual nos dois temas e na imagem baixada). Cada foto vira uma
polaroid (foto quadrada + moldura + anotação opcional) presa com uma fita
adesiva de um dos quatro tons da paleta. A polaroid tem tamanho próprio
(de 24% a 70% da largura da página, passo de 6%), inclina até 30° para cada
lado e a foto se enquadra dentro da moldura (`fx` e `fy`, 0,5 é o meio, a
mesma conta do `object-position` e do recorte da imagem baixada). Foto nova
nasce numa vaga livre, calculada pelo tamanho dela, para não empilhar. Há uma gaveta de 70 adesivos em vetor (bichos, plantas, céu,
papelaria e casa), sem cor "de menino" ou "de menina", em traço de ilustração
de caderno e não de desenho infantil: formas chapadas, cores da paleta e rosto
só nos bichos. A gaveta rola dentro dela mesma, senão engole a página. Polaroids e adesivos se arrastam por toque, mouse ou setas; adesivos
ficam sempre por cima das polaroids.

**Tela de dedo e tela de mouse não têm os mesmos botões.** Em `pointer: coarse`
dois dedos em QUALQUER lugar da página mudam o tamanho (pinça) e a inclinação (giro) do item escolhido — exigir os dois dedos dentro do cartão não funciona, a polaroide é estreita demais num celular, e os
cinco botões de tamanho e inclinação somem — num celular eles comiam o espaço
do álbum. Quem quiser os botões de volta tem o "Prefiro os botões". No mouse é
o contrário: os botões aparecem e o aviso do dedo, não. O gatilho é o tipo de
tela, NUNCA app contra navegador: o navegador do celular também é tela de dedo.
Trazer para a frente, Tirar da página, Ajustar a foto dentro, Adicionar foto,
Compartilhar e Baixar aparecem sempre. Posição guardada como
fração da página. Salva sozinho em `localStorage` (teto de 30 polaroids e 80
adesivos; fotos de 640 px em JPEG) e baixa a página como PNG de 1200 x 1600.
Tem também Compartilhar, igual ao do Desenhar: `navigator.share` com o arquivo,
conferindo `canShare` antes; sem Web Share, cai no baixar. A imagem só sai do
aparelho quando a pessoa toca e escolhe para quem mandar.

## Jogos para quem não enxerga

Quatro, todos na tela Jogos, sem aba separada "para cego" — aparecem para
todo mundo. Somem no Modo Mini, porque dependem de ler e escrever.

| Jogo | Como funciona sem ver |
| --- | --- |
| Anagrama | Letras fora de ordem, lidas com vírgula entre elas; resposta digitada |
| Forca sem forca | Sem boneco, sem contagem de erro e sem perder; cada tecla diz no rótulo se já foi tentada e se está na palavra |
| Memória de palavras | Pares de palavra e a frase que descreve ela; carta fechada, aberta e casada dizem isso no rótulo |
| Memória sonora | Pares de notas; é o único que depende de ouvir |

Os três primeiros usam o banco das Palavras Cruzadas. A Memória sonora
reaproveita as regras da Memória de palavras (`js/palavrapar.js`).

## O texto da pessoa sai do app

A tela Escrever tem Compartilhar e Baixar como arquivo de texto, antes do
Apagar. Mesmo desenho do Desenhar e do Álbum: `navigator.share` conferindo
`canShare` antes, e sem Web Share cai no baixar. Folha em branco não gera
arquivo. O texto é dela e tem de poder sair sem passar por servidor nenhum.

## Levar e trazer âncoras (js/levar.js)

É o mais perto de "rede" que o Enseada chega sem trair o que promete.
Em Minhas âncoras, **Compartilhar minhas âncoras** gera um pacote que leva
**só as âncoras** — sem o que ela escreveu, sem fotos, sem álbum e sem os ids
do aparelho dela. Em Ajuda, **Trazer âncoras de um arquivo** aceita esse
pacote ou o arquivo inteiro que a própria Ajuda baixa, e **só acrescenta**:
nunca apaga, nunca sobrescreve, âncora repetida é ignorada (comparando sem
espaço e sem caixa) e a trazida chega ativa, com id novo. Arquivo que não for
reconhecido é recusado inteiro. Sem servidor, sem conta, sem nada guardado
fora dos dois aparelhos.

## Som (js/som.js)

O app passou a ter som, e ele obedece a três regras:

1. **Som nunca informa sozinho.** Todo som tem o texto equivalente na tela.
   A Memória sonora é um jogo de ouvido, como Pequenos Tesouros é de vista;
   quem não ouve tem a Memória de palavras, que é o mesmo jogo em texto.
2. **Nunca toca sozinho.** O `AudioContext` só nasce depois de um toque da
   pessoa, atrás do aviso de volume.
3. **Volume e duração com teto no código**, não na boa vontade de quem chama:
   `SOM_VOLUME_MAXIMO` 0,18 e nota de no máximo 2 segundos.

Tudo gerado em Web Audio no próprio aparelho: nenhum arquivo de áudio,
nenhuma rede.

## O que ainda falta

- Ruído de fundo em Web Audio (o `js/som.js` já existe e tem o teto de volume).
- Lembretes por arquivo `.ics`, que é o caminho sem servidor. Falta testar
  se importa limpo no iOS e no Android.
- Ícone: o desenho novo (gota de orvalho na folha) está em assets/icon.png e nos
  quatro PNGs de icones/. Falta a Tathi aprovar antes de ir para a loja.
- Conversa com advogado antes de abrir ao público (LGPD art. 14 e ECA).
