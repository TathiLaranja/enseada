# Enseada

Um lugar onde a pessoa guarda o que já sabe que a ajuda, e alcança com um toque
na hora em que não consegue pensar. Para quem ainda não sabe, tem um roteiro de
perguntas que ajuda a descobrir.

O nome é **Enseada**. O pedido de registro da marca foi depositado no INPI.
Depósito não é concessão: o registro ainda pode ser indeferido ou receber
oposição, e isso leva meses. Falta conferir domínio livre e nome livre na
Play Store.

## O que ele é, e o que ele não é

É ferramenta de organização e autoconhecimento. **Não é serviço de saúde.**
O app organiza, guarda, pergunta e lembra. Não interpreta, não mede e não
promete resultado. Nenhuma tela, nenhum texto de loja e nenhuma divulgação
anuncia benefício comprovado, porque a pesquisa não sustenta.

## Três princípios

1. **Entrar, resolver, sair.** Sucesso é a pessoa sair do app em 40 segundos.
2. **Tudo é escrito pela pessoa.** O app nunca sugere uma âncora que ela não escreveu.
3. **Nada sai do aparelho.** Sem conta, sem login, sem servidor, sem sincronização.

## Como rodar na sua máquina

Não precisa instalar nada. É HTML, CSS e JavaScript puro, sem build e sem npm.

```
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

Abrir o arquivo direto com clique duplo (`file://`) não serve: o service worker
só liga em `http://` ou `https://`.

## Como rodar os testes

```
sh teste/executar.sh
```

São testes em Node puro, com `node:assert` e nenhuma dependência.
A prova de mutação é manual: quebre a regra de propósito no código e confirme
que o teste acusa. As quatro últimas provas feitas estão no histórico de commits.

## As telas

| Arquivo | Tela | O que faz |
| --- | --- | --- |
| `index.html` | Agora | As âncoras ativas em botões grandes. Nada mais. |
| `ancoras.html` | Minhas âncoras | Guardar, editar, deixar dormente, trazer de volta, apagar. |
| `achar.html` | Me ajuda a achar | O roteiro de perguntas. |
| `escrever.html` | Escrever | Uma folha em branco, guardada sozinha neste aparelho. |
| `desenhar.html` | Desenhar | Traço e borracha num canvas, guardado como traços. |
| `jogos.html` | Jogos calmos | Pequenos Tesouros (três coleções), Cantinho Tranquilo (6, 12 ou 30 peças), sudoku, Tetris Calmo e palavras cruzadas. Sem cronômetro. |
| `rede.html` | Minha rede | Nome e rótulo de quem apoia, escritos pela pessoa. |
| `fotos.html` | Fotos | Tirar ou escolher fotos; ficam só neste aparelho, reduzidas e sem localização. |
| `album.html` | Álbum de retratos | Scrapbook: páginas marfim com polaroids presas com fita e adesivos que se arrastam; baixa a página como imagem. Aberto pela tela Fotos. |
| `ajuda.html` | Ajuda | O aviso, o CVV 188, Modo de uso (Adulto ou Mini), Modo Baixo Estímulo, tamanho da letra e os dados. |

O menu fixo de baixo é o mesmo em todas as telas e vive em `js/menu.js`: cards grandes, e o último liga e desliga o Modo Mini (Enseadinha), que troca as perguntas da tela Me ajuda a achar por perguntas curtas, com desenho, para crianças a partir de 3 anos.

## Os arquivos

```
index.html  ancoras.html  achar.html  ajuda.html
escrever.html  desenhar.html  fotos.html  album.html  jogos.html  rede.html
manifest.json  service-worker.js

css/tema.css        as três cores, Modo Baixo Estímulo, tamanho da letra
css/base.css        o resto do visual

js/ancoras.js       regras de âncora (funções puras, sem tela e sem gravação)
js/roteiro.js       regras do roteiro (funções puras)
js/perguntas.js     o texto das perguntas, separado da lógica
js/armazenamento.js a única porta dos dados (localStorage)
js/ajustes.js       Modo Baixo Estímulo e tamanho da letra, aplicados antes de desenhar
js/menu.js          o menu fixo de baixo, igual em todas as telas
js/fotos.js         regras das fotos: reduzir, teto, só JPEG (funções puras)
js/album.js         regras do álbum: páginas, polaroids, adesivos, mover, anotar (funções puras)
js/adesivos.js      os desenhos dos adesivos, em vetor
js/mini.js          as perguntas do Modo Mini (funções puras)
js/paleta.js        as cores do desenho
js/tela-fotos.js js/tela-album.js js/tela-mini.js
js/rede.js          regras da Minha rede (funções puras)
js/memoria.js       regras e coleções do Pequenos Tesouros (funções puras)
js/quebra-cabeca.js regras dos níveis do Cantinho Tranquilo (funções puras)
js/sudoku.js        gera e confere o sudoku, com dica em vez de erro (funções puras)
js/tetris.js        regras do Tetris Calmo: sem queda sozinha, sem fim (funções puras)
js/cruzadas.js      monta e confere as palavras cruzadas, com dica (funções puras)
js/tela-escrever.js js/tela-desenhar.js js/tela-jogos.js js/tela-quebra-cabeca.js js/tela-sudoku.js js/tela-tetris.js js/tela-cruzadas.js js/tela-rede.js
js/agora.js         a tela Agora
js/tela-ancoras.js  a tela Minhas âncoras
js/tela-achar.js    a tela do roteiro
js/tela-ajuda.js    a tela de Ajuda
js/registra-sw.js   liga o service worker

teste/              testes em Node puro
fontes/             Atkinson Hyperlegible, servida de dentro do projeto
icones/             os quatro ícones do PWA
public/images/       ilustração local do quebra-cabeça
```

## Regras técnicas que não se negociam

- HTML, CSS e JavaScript puro. Sem framework, sem build, sem npm.
- Tudo em `localStorage`. Sem banco, sem servidor, sem login.
- **Zero requisição externa.** Nenhuma API, nenhuma chave, nenhum analytics,
  nenhuma fonte de CDN. A fonte está dentro do projeto.
  A única coisa que sai para a internet é a pessoa tocar no endereço do CVV,
  e isso é escolha dela.
- Service worker com **cache primeiro**, não rede primeiro.
- Sem animação. Nenhum vermelho, em lugar nenhum, nem para erro.
- Cor nunca carrega significado sozinha: sempre junto com palavra.
- Nenhum contador, nenhuma sequência, nenhuma data de uso. A âncora nem tem
  campo para isso, de propósito.

## Fonte

Atkinson Hyperlegible, do Braille Institute of America, sob a SIL Open Font
License 1.1. A licença está em `fontes/LICENCA-OFL.txt`.
