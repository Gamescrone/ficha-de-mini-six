document.addEventListener('DOMContentLoaded', () => {
    const campos = document.querySelectorAll('input, textarea');
    const statusSalvamento = document.getElementById('status-salvamento');
    
    const btnExportarJson = document.getElementById('exportarJson');
    const btnImportarJson = document.getElementById('btnImportar');
    const inputImportar = document.getElementById('importarJson');
    const btnModoNoturno = document.getElementById('toggle-modo-noturno'); // Novo botão

    // Função para obter os dados da ficha
    function getDadosFicha() {
        const dados = {};
        campos.forEach(campo => {
            if (campo.type === 'checkbox') {
                dados[campo.id] = campo.checked;
            } else if (campo.type === 'radio') {
                if (campo.checked) {
                    dados[campo.name] = campo.id;
                }
            } else {
                dados[campo.id] = campo.value;
            }
        });
        return dados;
    }

    // Exportar para um arquivo JSON
    function exportarParaArquivo() {
        const dados = getDadosFicha();
        const nomePersonagem = dados['nome-personagem'] || 'ficha';
        const dadosJson = JSON.stringify(dados, null, 2);
        const blob = new Blob([dadosJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nomePersonagem}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Importar de um arquivo JSON
    function importarDeArquivo() {
        const arquivo = this.files[0];
        if (!arquivo) return;
        
        const leitor = new FileReader();
        leitor.onload = (evento) => {
            try {
                const dados = JSON.parse(evento.target.result);
                campos.forEach(campo => {
                    if (campo.type === 'checkbox') {
                        campo.checked = dados[campo.id] || false;
                    } else if (campo.type === 'radio') {
                        if (campo.id === dados[campo.name]) {
                            campo.checked = true;
                        }
                    } else {
                        campo.value = dados[campo.id] || '';
                    }
                });
                statusSalvamento.textContent = 'Ficha importada com sucesso!';
            } catch (e) {
                statusSalvamento.textContent = 'Erro ao ler o arquivo JSON.';
            }
            setTimeout(() => {
                statusSalvamento.textContent = '';
            }, 3000);
        };
        leitor.readAsText(arquivo);
    }

    // Lógica do Modo Noturno
    function carregarPreferenciaModoNoturno() {
        const modoSalvo = localStorage.getItem('modo-noturno');
        if (modoSalvo === 'ativado') {
            document.body.classList.add('modo-noturno');
        }
    }

    function alternarModoNoturno() {
        document.body.classList.toggle('modo-noturno');
        if (document.body.classList.contains('modo-noturno')) {
            localStorage.setItem('modo-noturno', 'ativado');
        } else {
            localStorage.removeItem('modo-noturno');
        }
    }

    // Carrega a preferência de modo noturno ao iniciar
    carregarPreferenciaModoNoturno();

    btnExportarJson.addEventListener('click', exportarParaArquivo);
    btnImportarJson.addEventListener('click', () => {
        inputImportar.click();
    });
    inputImportar.addEventListener('change', importarDeArquivo);
    btnModoNoturno.addEventListener('click', alternarModoNoturno); // Novo listener
});
