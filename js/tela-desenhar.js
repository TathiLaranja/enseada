/* Enseada - a tela Desenhar: traço colorido e borracha num canvas.
   O desenho é guardado como traços (pontos de 0 a 1 e o NOME da cor, não o
   código), pela porta única js/armazenamento.js. Assim ele se ajusta ao
   tamanho da tela e ganha as cores do tema ligado, claro ou Baixo Estímulo.
   As cores são as três do próprio tema: nenhuma cor fora da identidade. */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-desenho');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const LIMITE_DE_PONTOS = 20000;
    const LARGURA_TRACO = 4;
    const LARGURA_BORRACHA = 26;
    const VARIAVEL_DA_COR = { texto: '--texto', destaque: '--destaque', detalhe: '--detalhe' };
    const NOME_DA_FERRAMENTA = {
        texto: 'Verde profundo',
        destaque: 'Azul turquesa',
        detalhe: 'Verde-água',
        borracha: 'Borracha'
    };

    const armazem = criarArmazenamento(window.localStorage);
    const recado = document.getElementById('recado-desenho');
    const btnLimpar = document.getElementById('btn-limpar');
    const btnSalvar = document.getElementById('btn-salvar');
    const botoesCor = document.querySelectorAll('.botao-cor');

    let tracos = armazem.ler().desenho;
    let ferramenta = 'texto';
    let atual = null;

    function totalDePontos() {
        return tracos.reduce((soma, t) => soma + t.pontos.length, 0);
    }

    function corDoTema(nome) {
        const valor = getComputedStyle(document.documentElement)
            .getPropertyValue(VARIAVEL_DA_COR[nome] || '--texto').trim();
        return valor || '#1F7268';
    }

    function desenharTraco(t) {
        const escala = window.devicePixelRatio || 1;
        const cor = corDoTema(t.cor);
        ctx.globalCompositeOperation = t.apagar ? 'destination-out' : 'source-over';
        ctx.strokeStyle = cor;
        ctx.lineWidth = (t.apagar ? LARGURA_BORRACHA : LARGURA_TRACO) * escala;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const w = canvas.width;
        const h = canvas.height;
        ctx.beginPath();
        ctx.moveTo(t.pontos[0][0] * w, t.pontos[0][1] * h);
        if (t.pontos.length === 1) {
            ctx.lineTo(t.pontos[0][0] * w + 0.01, t.pontos[0][1] * h);
        }
        for (let i = 1; i < t.pontos.length; i++) {
            ctx.lineTo(t.pontos[i][0] * w, t.pontos[i][1] * h);
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
    }

    function redesenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tracos.forEach(desenharTraco);
    }

    function ajustarTamanho() {
        const escala = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * escala));
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
        const y = (evento.clientY - caixa.top) / caixa.height;
        const limitar = v => Math.round(Math.min(1, Math.max(0, v)) * 10000) / 10000;
        return [limitar(x), limitar(y)];
    }

    canvas.addEventListener('pointerdown', evento => {
        evento.preventDefault();
        canvas.setPointerCapture(evento.pointerId);
        atual = {
            apagar: ferramenta === 'borracha',
            cor: ferramenta === 'borracha' ? 'texto' : ferramenta,
            pontos: [ponto(evento)]
        };
        tracos.push(atual);
        desenharTraco(atual);
        desfazerConfirmacao();
    });

    canvas.addEventListener('pointermove', evento => {
        if (!atual) return;
        atual.pontos.push(ponto(evento));
        redesenhar();
    });

    function soltar() {
        if (!atual) return;
        atual = null;
        guardar();
    }
    canvas.addEventListener('pointerup', soltar);
    canvas.addEventListener('pointercancel', soltar);

    function dizerFerramenta() {
        botoesCor.forEach(b => {
            const ligada = b.getAttribute('data-cor') === ferramenta;
            b.classList.toggle('ativa', ligada);
            b.setAttribute('aria-pressed', ligada ? 'true' : 'false');
        });
        document.getElementById('ferramenta-atual').textContent =
            'Agora está: ' + NOME_DA_FERRAMENTA[ferramenta] + '.';
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
    });

    btnSalvar.addEventListener('click', guardar);

    window.addEventListener('resize', ajustarTamanho);
    dizerFerramenta();
    ajustarTamanho();
});
