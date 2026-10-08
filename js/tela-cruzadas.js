/* Enseada - a tela das palavras cruzadas.
   Regras em js/cruzadas.js. Aqui so desenha a grade e escuta a digitacao.
   Nada aponta erro, nada conta tempo e nada pontua. Conferir responde em
   palavra; a dica poe a letra certa. */

document.addEventListener('DOMContentLoaded', () => {
    const area = document.getElementById('container-cruzadas');
    if (!area) return;
    const recado = document.getElementById('recado-cruzadas');
    let jogo = null;

    function comecar() {
        jogo = cruzadasNovo(Math.random);
        recado.textContent = '';
        desenhar();
    }

    function desenhar() {
        area.textContent = '';

        const grade = document.createElement('div');
        grade.className = 'grade-cruzada';
        grade.style.gridTemplateColumns = 'repeat(' + jogo.colunas + ', 1fr)';
        grade.setAttribute('role', 'group');
        grade.setAttribute('aria-label', 'Grade das palavras cruzadas');

        for (let r = 0; r < jogo.linhas; r++) {
            for (let c = 0; c < jogo.colunas; c++) {
                grade.appendChild(criarCelula(r, c));
            }
        }
        area.appendChild(grade);
        area.appendChild(listaDeDicas('h', 'Na horizontal'));
        area.appendChild(listaDeDicas('v', 'Na vertical'));
    }

    function criarCelula(r, c) {
        const celula = document.createElement('div');
        if (jogo.grade[r][c] === '') {
            celula.className = 'celula-cruz sem-letra';
            return celula;
        }
        celula.className = 'celula-cruz';

        const numero = jogo.numeros[r + ',' + c];
        const campo = document.createElement('input');
        campo.type = 'text';
        campo.maxLength = 2;
        campo.autocomplete = 'off';
        campo.autocapitalize = 'characters';
        campo.spellcheck = false;
        campo.className = 'letra-input';
        campo.setAttribute('data-casa', r + ',' + c);
        campo.value = jogo.atual[r][c];
        campo.setAttribute('aria-label',
            'Linha ' + (r + 1) + ', coluna ' + (c + 1) + (numero ? ', número ' + numero : ''));

        campo.addEventListener('input', () => {
            const letra = cruzadasLerDigitacao(jogo.atual[r][c], campo.value);
            jogo = cruzadasColocar(jogo, r, c, letra);
            campo.value = jogo.atual[r][c];
            recado.textContent = '';
        });

        if (numero) {
            const marca = document.createElement('span');
            marca.className = 'numero-cruz';
            marca.setAttribute('aria-hidden', 'true');
            marca.textContent = String(numero);
            celula.appendChild(marca);
        }
        celula.appendChild(campo);
        return celula;
    }

    function listaDeDicas(direcao, titulo) {
        const bloco = document.createElement('div');
        bloco.className = 'dicas-cruzada';
        const h = document.createElement('h3');
        h.textContent = titulo;
        bloco.appendChild(h);
        const lista = document.createElement('ul');
        jogo.entradas.filter(e => e.direcao === direcao).forEach(e => {
            const item = document.createElement('li');
            item.textContent = e.numero + '. ' + e.dica + ' (' + e.resposta.length + ' letras)';
            lista.appendChild(item);
        });
        bloco.appendChild(lista);
        return bloco;
    }

    document.getElementById('verificar-cruzadas').addEventListener('click', () => {
        if (cruzadasCerto(jogo)) {
            recado.textContent = 'Todas as letras estão no lugar.';
        } else if (cruzadasCheio(jogo)) {
            recado.textContent = 'Todas as casas têm letra, mas alguma está fora do lugar. Peça uma dica ou troque uma letra.';
        } else {
            recado.textContent = 'Ainda há casas vazias. Continue no seu ritmo ou peça uma dica.';
        }
    });

    document.getElementById('dica-cruzadas').addEventListener('click', () => {
        const resultado = cruzadasDica(jogo, Math.random);
        if (!resultado.casa) {
            recado.textContent = 'Não há mais o que ajudar: tudo está no lugar.';
            return;
        }
        jogo = resultado.jogo;
        const r = resultado.casa[0];
        const c = resultado.casa[1];
        desenhar();
        const alvo = area.querySelector('[data-casa="' + r + ',' + c + '"]');
        if (alvo) { alvo.focus(); }
        recado.textContent = 'Dica: pus a letra ' + jogo.atual[r][c] +
            ' na linha ' + (r + 1) + ', coluna ' + (c + 1) + '.';
    });

    document.getElementById('reiniciar-cruzadas').addEventListener('click', comecar);

    comecar();
});
