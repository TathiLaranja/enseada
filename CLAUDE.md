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
- Web Audio para o ruído, canvas para o desenho, sudoku gerado em JS —
  quando essas telas entrarem.

## Modo baixo estímulo (já na primeira abertura, não é ajuste escondido)

- Uma coisa por tela. Uma pergunta, uma lista, um botão grande.
- Três cores por tema, no máximo: fundo, texto e um tom de destaque.
  Saturação baixa. Nem preto puro, nem branco puro.
- **Nenhum vermelho na interface**, nem para erro, nem para aviso. Única
  exceção: as cores de tinta do Desenhar (js/paleta.js), que são da pessoa.
- Cor nunca carrega significado sozinha: sempre junto com palavra.
- Sem animação. `prefers-reduced-motion` respeitado e, fora dele, nada anima.
- Claro e escuro seguindo `prefers-color-scheme`, com troca manual só na Ajuda.
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

## Paleta em uso (Maré)

| | Claro | Escuro |
| --- | --- | --- |
| Fundo | `#F2F0EB` | `#1C2127` |
| Texto | `#272C33` | `#D9DEE3` |
| Destaque | `#3F5C6B` | `#8FA8B4` |

`--linha` e `--fraco` não são cores novas: são a cor do texto com transparência.

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

## O que ainda falta

- Ruído de fundo em Web Audio, com aviso de volume e limite.
- Lembretes por arquivo `.ics`, que é o caminho sem servidor. Falta testar
  se importa limpo no iOS e no Android.
- Ícone: o desenho novo (gota de orvalho na folha) está em assets/icon.png e nos
  quatro PNGs de icones/. Falta a Tathi aprovar antes de ir para a loja.
- Conversa com advogado antes de abrir ao público (LGPD art. 14 e ECA).
