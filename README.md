# Pouso

Um lugar onde a pessoa guarda o que já sabe que a ajuda, e alcança com um toque
na hora em que não consegue pensar. Para quem ainda não sabe, tem um roteiro de
perguntas que ajuda a descobrir.

**Pouso é o nome de agora, não o definitivo.** Falta conferir domínio livre,
nome livre na Play Store e busca de marca no INPI.

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
| `ajuda.html` | Ajuda | O aviso, o CVV 188, cor, tamanho da letra e os dados. |

## Os arquivos

```
index.html  ancoras.html  achar.html  ajuda.html
manifest.json  service-worker.js

css/tema.css        as três cores, claro e escuro, tamanho da letra
css/base.css        o resto do visual

js/ancoras.js       regras de âncora (funções puras, sem tela e sem gravação)
js/roteiro.js       regras do roteiro (funções puras)
js/perguntas.js     o texto das perguntas, separado da lógica
js/armazenamento.js a única porta dos dados (localStorage)
js/ajustes.js       cor e tamanho da letra, aplicados antes de desenhar
js/agora.js         a tela Agora
js/tela-ancoras.js  a tela Minhas âncoras
js/tela-achar.js    a tela do roteiro
js/tela-ajuda.js    a tela de Ajuda
js/registra-sw.js   liga o service worker

teste/              testes em Node puro
fontes/             Atkinson Hyperlegible, servida de dentro do projeto
icones/             os quatro ícones do PWA
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
