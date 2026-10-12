/* Enseada - a tela Desenhar: traço colorido e borracha num canvas.
   O desenho é guardado como traços (pontos de 0 a 1 e o NOME da cor, não o
   código), pela porta única js/armazenamento.js. Assim ele se ajusta ao
   tamanho da tela e ganha as cores do tema ligado, claro ou Baixo Estímulo.
   As cores são as três do próprio tema: nenhuma cor fora da identidade.

   O traço usa perfect-freehand (js/perfect-freehand.min.js, local) para
   suavização e variação orgânica de espessura. Cada traço é preenchido como
   polígono em vez de riscado com stroke(), o que elimina o serrilhado no
   mobile e simula variação de pressão/velocidade. */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-desenho');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const LIMITE_DE_PONTOS = 20000;
    /* Diâmetro base em pixels lógicos. perfect-freehand recebe pixels físicos
       (já multiplicados pelo devicePixelRatio), então a escala é aplicada
       antes de passar para a biblioteca. */
    const LARGURA_TRACO   = { fino: 2,  medio: 6,  grosso: 13 };
    const LARGURA_BORRACHA = { fino: 18, medio: 32, grosso: 54 };
    const NOME_DA_LARGURA  = { fino: 'fino', medio: 'médio', grosso: 'grosso' };
    const NOME_DA_FERRAMENTA = { borracha: 'Borracha' };
    PALETA_DESENHO.forEach(c => { NOME_DA_FERRAMENTA[c.nome] = c.rotulo; });

    const armazem = criarArmazenamento(window.localStorage);
    const recado  = document.getElementById('recado-desenho');
    const btnLimpar = document.getElementById('btn-limpar');
    const btnSalvar = document.getElementById('btn-salvar');
    const botoesCor = document.querySelectorAll('.botao-cor');

    let tracos  = armazem.ler().desenho;
    let ferramenta = 'texto';
    let largura    = 'medio';
    let refeitos   = [];
    let atual      = null;   /* traço em andamento (último em `tracos`) */
    let rafPendente = null;  /* ID do requestAnimationFrame agendado */

    function totalDePontos() {
        return tracos.reduce((soma, t) => soma + t.pontos.length, 0);
    }

    function modoBaixo() {
        return document.documentElement.getAttribute('data-tema') === 'baixo';
    }

    function lerVariavel(nome) {
        return getComputedStyle(document.documentElement).getPropertyValue(nome).trim() || '#454640';
    }

    function corDoTema(nome) {
        return corDoDesenho(nome, modoBaixo(), lerVariavel);
    }

    /* A bolinha de cada botao mostra o tom certo para o tema ligado. */
    botoesCor.forEach(b => {
        const nome = b.getAttribute('data-cor');
        const amostra = b.querySelector('.amostra');
        if (nome !== 'borracha' && amostra) amostra.style.background = corDoTema(nome);
    });

    /* Preenche o contorno gerado pelo perfect-freehand usando curvas quadráticas
       pelos pontos médios, o que deixa a borda do polígono suave. */
    function preencherContorno(pts) {
        if (!pts.length) return;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length - 1; i++) {
            const mx = (pts[i][0] + pts[i + 1][0]) / 2;
            const my = (pts[i][1] + pts[i + 1][1]) / 2;
            ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
        }
        ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
        ctx.closePath();
        ctx.fill();
    }

    /* emProgresso = true enquanto o dedo/mouse ainda não soltou:
       passa last:false para o perfect-freehand não fechar a ponta. */
    function desenharTraco(t, emProgresso) {
        if (!t.pontos.length) return;
        const escala = window.devicePixelRatio || 1;
        const w = canvas.width;
        const h = canvas.height;
        const cor = corDoTema(t.cor);

        /* Converte pontos normalizados [0–1] para pixels físicos do canvas. */
        const pontosPx = t.pontos.map(p => [p[0] * w, p[1] * h]);

        const tamanho = (t.apagar ? LARGURA_BORRACHA : LARGURA_TRACO)[t.largura || 'medio'] * escala;

        const contorno = PerfectFreehand.getStroke(pontosPx, {
            size:             tamanho,
            /* thinning:0 + simulatePressure:false → espessura uniforme.
               Com simulação de pressão ativa, movimento rápido gerava
               pressão quase zero, tornando o traço invisível (picotado).
               Linha uniforme é mais confiável e combina com o estilo calmo
               do app. */
            thinning:         0,
            smoothing:        0.5,
            streamline:       0.3,
            simulatePressure: false,
            last:             !emProgresso,
            /* taper:0 no início evita que trechos rápidos fiquem finos
               demais logo após o toque (especialmente em telas retina). */
            start: { cap: true, taper: 0 },
            end:   { cap: true, taper: 0 }
        });

        if (!contorno.length) return;

        ctx.globalCompositeOperation = t.apagar ? 'destination-out' : 'source-over';
        ctx.fillStyle = cor;
        preencherContorno(contorno);
        ctx.globalCompositeOperation = 'source-over';
    }

    function redesenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tracos.forEach((t, i) => {
            const emProgresso = atual !== null && i === tracos.length - 1;
            desenharTraco(t, emProgresso);
        });
    }

    function ajustarTamanho() {
        const escala = window.devicePixelRatio || 1;
        canvas.width  = Math.max(1, Math.round(canvas.clientWidth  * escala));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * escala));
        redesenhar();
    }

    /* Guarda de verdade em localStorage e diz o resultado em palavra. */
    function guardar() {
        if (totalDePontos() > LIMITE_DE_PONTOS) {
            recado.textContent = 'O desenho ficou grande demais para guardar. Ele continua aqui até você sair da tela.';
            return false;
        }
        const dados = armazem.ler();
        dados.desenho = tracos;
        const ok = armazem.gravar(dados);
        recado.textContent = ok
            ? 'Guardado neste aparelho.'
            : 'Não foi possível guardar neste aparelho.';
        return ok;
    }

    function ponto(evento) {
        const caixa = canvas.getBoundingClientRect();
        const x = (evento.clientX - caixa.left) / caixa.width;
        const y = (evento.clientY - caixa.top)  / caixa.height;
        const limitar = v => Math.round(Math.min(1, Math.max(0, v)) * 10000) / 10000;
        return [limitar(x), limitar(y)];
    }

    canvas.addEventListener('pointerdown', evento => {
        evento.preventDefault();
        canvas.setPointerCapture(evento.pointerId);
        atual = {
            apagar: ferramenta === 'borracha',
            cor:    ferramenta === 'borracha' ? 'texto' : ferramenta,
            largura,
            pontos: [ponto(evento)]
        };
        tracos.push(atual);
        refeitos = [];
        redesenhar();
        desfazerConfirmacao();
    });

    canvas.addEventListener('pointermove', evento => {
        if (!atual) return;
        /* getCoalescedEvents captura todos os pontos intermediários entre
           disparos de evento — sem isso o traço fica picotado quando o
           dedo se move rápido entre dois frames do navegador.
           Guarda contra retorno de array vazio: nesse caso usa o evento
           primário, que nunca pode ser perdido. */
        var coalescidos = typeof evento.getCoalescedEvents === 'function'
            ? evento.getCoalescedEvents() : null;
        var evs = (coalescidos && coalescidos.length > 0) ? coalescidos : [evento];
        evs.forEach(function(ev) { atual.pontos.push(ponto(ev)); });
        /* requestAnimationFrame garante no máximo um redesenho por frame,
           evitando travamentos quando pointermove dispara mais rápido
           que a taxa de atualização da tela. */
        if (!rafPendente) {
            rafPendente = requestAnimationFrame(function() {
                rafPendente = null;
                redesenhar();
            });
        }
    });

    function soltar() {
        if (!atual) return;
        /* Cancela RAF pendente antes do redesenho final com last:true. */
        if (rafPendente) { cancelAnimationFrame(rafPendente); rafPendente = null; }
        atual = null;
        redesenhar();   /* redesenha com last:true para fechar as pontas */
        guardar();
        atualizarDesfazer();
    }
    canvas.addEventListener('pointerup',     soltar);
    canvas.addEventListener('pointercancel', soltar);

    function dizerFerramenta() {
        botoesCor.forEach(b => {
            const ligada = b.getAttribute('data-cor') === ferramenta;
            b.classList.toggle('ativa', ligada);
            b.setAttribute('aria-pressed', ligada ? 'true' : 'false');
        });
        document.getElementById('ferramenta-atual').textContent =
            'Agora está: ' + NOME_DA_FERRAMENTA[ferramenta] + ', traço ' + NOME_DA_LARGURA[largura] + '.';
    }

    botoesCor.forEach(botao => {
        botao.addEventListener('click', () => {
            ferramenta = botao.getAttribute('data-cor');
            dizerFerramenta();
        });
    });

    function desfazerConfirmacao() {
        btnLimpar.removeAttribute('data-confirmar');
        btnLimpar.textContent = 'Limpar tela';
    }

    btnLimpar.addEventListener('click', () => {
        if (btnLimpar.getAttribute('data-confirmar') === 'sim') {
            tracos = [];
            refeitos = [];
            atualizarDesfazer();
            const dados = armazem.ler();
            dados.desenho = [];
            armazem.gravar(dados);
            redesenhar();
            desfazerConfirmacao();
            recado.textContent = 'A tela está em branco.';
            return;
        }
        btnLimpar.setAttribute('data-confirmar', 'sim');
        btnLimpar.textContent = 'Limpar mesmo';
        recado.textContent = 'Isso apaga o desenho inteiro. Não dá para desfazer.';
        if (navigator.vibrate) { navigator.vibrate([30]); }
    });

    /* Espessura do traço: três opções, cada uma com o nome escrito. */
    const botoesLargura = document.querySelectorAll('.botao-espessura');
    botoesLargura.forEach(b => {
        b.addEventListener('click', () => {
            largura = b.getAttribute('data-largura');
            botoesLargura.forEach(o => {
                const ligada = o === b;
                o.classList.toggle('ativa', ligada);
                o.setAttribute('aria-pressed', ligada ? 'true' : 'false');
            });
            document.getElementById('ferramenta-atual').textContent =
                'Agora está: ' + NOME_DA_FERRAMENTA[ferramenta] + ', traço ' + NOME_DA_LARGURA[largura] + '.';
        });
    });

    /* Desfazer e refazer: tiram e devolvem o último traço (ou borracha). */
    const btnDesfazer = document.getElementById('btn-desfazer');
    const btnRefazer  = document.getElementById('btn-refazer');

    function atualizarDesfazer() {
        btnDesfazer.disabled = tracos.length === 0;
        btnRefazer.disabled  = refeitos.length === 0;
    }

    function guardarSemRecado() {
        const dados = armazem.ler();
        dados.desenho = tracos;
        armazem.gravar(dados);
    }

    btnDesfazer.addEventListener('click', () => {
        if (tracos.length === 0) return;
        refeitos.push(tracos.pop());
        redesenhar();
        guardarSemRecado();
        recado.textContent = 'Desfeito.';
        atualizarDesfazer();
        if (navigator.vibrate) { navigator.vibrate([30]); }
    });

    btnRefazer.addEventListener('click', () => {
        if (refeitos.length === 0) return;
        tracos.push(refeitos.pop());
        redesenhar();
        guardarSemRecado();
        recado.textContent = 'Refeito.';
        atualizarDesfazer();
        if (navigator.vibrate) { navigator.vibrate([30]); }
    });

    btnSalvar.addEventListener('click', () => {
        guardar();
        if (navigator.vibrate) { navigator.vibrate([30]); }
    });

    /* Compartilhar: a imagem sai do aparelho SÓ quando a pessoa toca aqui e
       escolhe para quem mandar na folha do próprio sistema (WhatsApp, e-mail,
       etc.). O Enseada não envia nada e não guarda nada sobre isso. Se o
       aparelho não compartilha arquivos, o desenho vai para a pasta de
       downloads e a pessoa manda por lá. */
    const NOME_DO_ARQUIVO = 'desenho-enseada.png';

    function imagemDoDesenho() {
        /* O canvas é transparente; a imagem leva o fundo do tema ligado. */
        const folha = document.createElement('canvas');
        folha.width  = canvas.width;
        folha.height = canvas.height;
        const c2 = folha.getContext('2d');
        c2.fillStyle = lerVariavel('--fundo') || '#FAF8F5';
        c2.fillRect(0, 0, folha.width, folha.height);
        c2.drawImage(canvas, 0, 0);
        return new Promise(resolve => folha.toBlob(resolve, 'image/png'));
    }

    function baixar(blob) {
        const endereco = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = endereco;
        link.download = NOME_DO_ARQUIVO;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(endereco);
    }

    document.getElementById('btn-compartilhar').addEventListener('click', async () => {
        if (tracos.length === 0) {
            recado.textContent = 'Desenhe alguma coisa primeiro.';
            return;
        }
        const blob = await imagemDoDesenho();
        if (!blob) {
            recado.textContent = 'Não foi possível preparar a imagem.';
            return;
        }
        const arquivo = new File([blob], NOME_DO_ARQUIVO, { type: 'image/png' });
        const dados   = { files: [arquivo], title: 'Meu desenho' };

        if (navigator.share && navigator.canShare && navigator.canShare(dados)) {
            try {
                await navigator.share(dados);
                recado.textContent = '';
            } catch (erro) {
                /* A pessoa fechou a folha de compartilhar: nada foi enviado. */
                recado.textContent = erro && erro.name === 'AbortError'
                    ? 'Nada foi enviado.'
                    : 'Não foi possível compartilhar. Tente de novo.';
            }
            return;
        }
        baixar(blob);
        recado.textContent = 'Este aparelho não compartilha direto. A imagem foi para a pasta de downloads; mande por lá.';
    });

    window.addEventListener('resize', ajustarTamanho);
    dizerFerramenta();
    atualizarDesfazer();
    ajustarTamanho();
});
