# Cards de divulgação — estado e pendências

Última atualização: 24/11/2026.

Os cards não ficam neste repositório: são um artifact do Claude, em
https://claude.ai/artifact/77zQUbCuJutZxmjqcSBynv ("Cards Enseada").
São três formatos: Story 9:16, Feed 1:1 e LinkedIn.

## Nome dos projetos

O projeto de vagas chama-se **Cruzar Vagas**. O nome "Trampar" foi abandonado
porque já estava registrado no INPI. O `CLAUDE.md` daquele repositório ainda
está escrito "Trampar (Cruzar)" e precisa ser corrigido.

## Já aprovado, não mexer

- As cores dos cards. A Tathi gostou como estão.
- As telas que já estão no portfólio: a paleta é a atual, continuam certas.

## Cards — PREPARADO MAS NÃO PUBLICADO

Em 24/11/2026 a Tathi pediu para deixar os cards de lado e cuidar primeiro do
portfólio. O artifact **continua como estava**: nada abaixo foi publicado.
As mudanças já estão prontas e conferidas em navegador, é só republicar.

1. **Ícone trocado pelo de verdade.** O que estava nos cards era uma folha
   verde com gota azul, desenhada à mão no artifact. O ícone real do Enseada
   é outro: quadrado pêssego de cantos redondos, círculo com a água da enseada
   em camadas (marfim no alto descendo até verde-escuro) e duas samambaias.
   Está em `icones/icone.svg` e nos PNGs de `icones/`.
   **Atenção:** o `CLAUDE.md` deste repositório ainda descreve o ícone como
   "gota de orvalho na folha", o que também está desatualizado.

2. **Acessibilidade para cegos e baixa visão** entrou nos cards. O app tem
   isso de verdade, feito em 12/10/2026: `role=status` e `aria-live`
   explícito, rótulos de seção, alvos de toque de 44px, conserto do TalkBack
   mudo na tela Ajuda (Samsung Galaxy A36), fonte Atkinson Hyperlegible com
   tamanho ajustável e Modo Baixo Estímulo.

3. **Traço estabilizado** entrou junto do Desenho livre.
   **Nunca citar o nome de outro aplicativo.** A referência que a Tathi deu
   foi o Ibis Paint, mas era só exemplo para eu entender, não para o card.

4. **A tarja "Seus dados" saiu.** Não comunicava nada sozinha.

## Cards — a linha escolhida

**A linha "Organização pessoal offline." vira "Para os dias difíceis. Offline."**
A Tathi escolheu a opção 1 em 24/11/2026. Ela achava que "organização pessoal"
não descrevia bem o app, e não queria a palavra "regulação".

Regra do `CLAUDE.md` que manda aqui: o app nunca anuncia benefício.
**Oferecer, nunca prometer.** O teste é "dá para o app falhar nisso?".
"Relaxamento" e "desestresse" prometem um resultado dentro da pessoa, então
estão fora. "Um lugar calmo" descreve o app, então pode.

Opções oferecidas:

1. **Para os dias difíceis. Offline.**  ← ESCOLHIDA
2. Suas âncoras, sempre à mão. Offline.
3. Um espaço de pausa. Offline.
4. Suas coisas, no seu ritmo. Offline.
5. Entrar, resolver, sair. Offline.

O arquivo pronto dos cards, com tudo isto aplicado e conferido em navegador,
ficou no rascunho desta sessão e **não sobrevive a ela**. Se a republicação não
acontecer na mesma sessão, é preciso refazer as alterações a partir desta lista.

## Portfólio da Cruzar — pendente

Levantado em 10/11/2026, na conversa "Projeto Enseada". Nada foi aplicado.
É a parte do Enseada, **páginas 14 a 18**.

1. **Página 16, "Desenvolvimento nativo"**: diz "sem bibliotecas de terceiros
   na interface", e isso deixou de ser verdade. O projeto usa
   `js/perfect-freehand.min.js` (MIT, Steve Ruiz) na tela Desenhar. Ela vive
   dentro do projeto e funciona offline, mas é de terceiros. Do jeito que
   está, é afirmação falsa num documento comercial.

2. **Página 16, "Testes automatizados"**: não diz quantos são. São 185 testes
   em Node puro, sem biblioteca.

3. **Páginas 17 e 18**: faltam três telas que existem e funcionam —
   **Escrever**, **Minha rede** e **Fotos**. O portfólio mostra 5 módulos
   cobrindo 7 telas; o app tem 10.

4. **Página 18, "Resultado: no ar"**: não diz onde. É
   `https://enseada.cruzar.com.br`, com HTTPS forçado.

5. **Páginas 14 e 15**: não mencionam que a marca Enseada foi depositada no
   INPI. (Depósito não é concessão: não anunciar como marca registrada.)

**Pendente com a Tathi:** 3 prints tirados no celular, das telas Escrever,
Minha rede e Fotos. Têm que sair do aparelho dela porque o rodapé do
portfólio promete "telas reais do aplicativo, capturadas da versão
publicada".
