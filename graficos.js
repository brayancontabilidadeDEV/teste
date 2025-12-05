// ==================== GERENCIADOR DE GRÁFICOS ====================

class GerenciadorGraficos {
    constructor() {
        this.graficos = {};
        this.coresGrafico = {
            primary: 'rgb(59, 130, 246)',
            success: 'rgb(16, 185, 129)',
            warning: 'rgb(245, 158, 11)',
            danger: 'rgb(239, 68, 68)',
            purple: 'rgb(139, 92, 246)',
            orange: 'rgb(249, 115, 22)'
        };
    }

    inicializarGraficos() {
        console.log('Inicializando todos os gráficos...');
        
        // Gráfico do Dashboard
        this.criarGraficoDashboard();
        
        // Gráfico de Composição de Preço
        this.criarGraficoComposicaoPreco();
        
        // Gráfico de Comparação com Concorrência
        this.criarGraficoComparacaoConcorrencia();
        
        // Gráfico de Evolução do Lucro
        this.criarGraficoEvolucaoLucro();
        
        // Gráfico de Distribuição do Preço
        this.criarGraficoDistribuicaoPreco();
        
        // Gráfico de Ponto de Equilíbrio
        this.criarGraficoPontoEquilibrio();
        
        // Gráficos de Projeção
        this.criarGraficoProjecaoFaturamento();
        this.criarGraficoProjecaoLucro();
        
        console.log('Gráficos inicializados:', Object.keys(this.graficos));
    }

    destruirGrafico(id) {
        if (this.graficos[id]) {
            this.graficos[id].destroy();
            delete this.graficos[id];
        }
    }

    criarGraficoDashboard() {
        const ctx = document.getElementById('dashGraficoResumo');
        if (!ctx) {
            console.warn('Canvas dashGraficoResumo não encontrado');
            return;
        }

        this.destruirGrafico('dashGraficoResumo');

        this.graficos.dashGraficoResumo = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Faturamento',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: this.coresGrafico.primary,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    atualizarGraficoDashboard(dadosNegocio) {
        const grafico = this.graficos.dashGraficoResumo;
        if (!grafico || !dadosNegocio.resultados.receitaBruta) return;

        const receita = dadosNegocio.resultados.receitaBruta;
        const dados = [
            receita * 0.8,
            receita * 0.9,
            receita,
            receita * 1.1,
            receita * 1.05,
            receita * 1.15
        ];

        grafico.data.datasets[0].data = dados;
        grafico.update();
    }

    criarGraficoComposicaoPreco() {
        const ctx = document.getElementById('graficoComposicaoPreco');
        if (!ctx) {
            console.warn('Canvas graficoComposicaoPreco não encontrado');
            return;
        }

        this.destruirGrafico('graficoComposicaoPreco');

        this.graficos.graficoComposicaoPreco = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Custo Variável', 'Custo Fixo', 'Lucro'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        this.coresGrafico.danger,
                        this.coresGrafico.warning,
                        this.coresGrafico.success
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': R$ ' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    atualizarGraficoComposicaoPreco(preco, custoVarUnit, custoFixoUnit, markup) {
        const grafico = this.graficos.graficoComposicaoPreco;
        if (!grafico) return;

        const lucro = preco - custoVarUnit - custoFixoUnit;

        grafico.data.datasets[0].data = [
            custoVarUnit,
            custoFixoUnit,
            lucro
        ];
        grafico.update();
    }

    criarGraficoComparacaoConcorrencia() {
        const ctx = document.getElementById('graficoComparacaoConcorrencia');
        if (!ctx) {
            console.warn('Canvas graficoComparacaoConcorrencia não encontrado');
            return;
        }

        this.destruirGrafico('graficoComparacaoConcorrencia');

        this.graficos.graficoComparacaoConcorrencia = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Mínimo', 'Médio', 'Máximo', 'Seu Preço'],
                datasets: [{
                    label: 'Preço (R$)',
                    data: [45, 62, 85, 0],
                    backgroundColor: [
                        this.coresGrafico.danger,
                        this.coresGrafico.warning,
                        this.coresGrafico.success,
                        this.coresGrafico.primary
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    atualizarGraficoComparacaoConcorrencia() {
        const grafico = this.graficos.graficoComparacaoConcorrencia;
        if (!grafico) return;

        const precoMin = parseFloat(document.getElementById('precoMinConcorrencia')?.value) || 45;
        const precoMedio = parseFloat(document.getElementById('precoMedioConcorrencia')?.value) || 62;
        const precoMax = parseFloat(document.getElementById('precoMaxConcorrencia')?.value) || 85;
        const meuPreco = parseFloat(document.getElementById('precoVendaFinal')?.value) || 0;

        grafico.data.datasets[0].data = [precoMin, precoMedio, precoMax, meuPreco];
        grafico.update();
    }

    criarGraficoEvolucaoLucro() {
        const ctx = document.getElementById('graficoEvolucaoLucro');
        if (!ctx) {
            console.warn('Canvas graficoEvolucaoLucro não encontrado');
            return;
        }

        this.destruirGrafico('graficoEvolucaoLucro');

        this.graficos.graficoEvolucaoLucro = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
                datasets: [{
                    label: 'Lucro',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: this.coresGrafico.success,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    criarGraficoDistribuicaoPreco() {
        const ctx = document.getElementById('graficoDistribuicaoPreco');
        if (!ctx) {
            console.warn('Canvas graficoDistribuicaoPreco não encontrado');
            return;
        }

        this.destruirGrafico('graficoDistribuicaoPreco');

        this.graficos.graficoDistribuicaoPreco = new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Custos Variáveis', 'Custos Fixos', 'Impostos', 'Lucro'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        this.coresGrafico.danger,
                        this.coresGrafico.warning,
                        this.coresGrafico.orange,
                        this.coresGrafico.success
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    atualizarGraficoDistribuicaoPreco(custos, preco) {
        const grafico = this.graficos.graficoDistribuicaoPreco;
        if (!grafico || !custos.totalUnitario) return;

        const impostos = preco * 0.07;
        const lucro = preco - custos.totalUnitario - impostos;

        grafico.data.datasets[0].data = [
            custos.variavelUnitario,
            custos.fixoUnitario,
            impostos,
            lucro
        ];
        grafico.update();
    }

    criarGraficoPontoEquilibrio() {
        const ctx = document.getElementById('graficoPontoEquilibrio');
        if (!ctx) {
            console.warn('Canvas graficoPontoEquilibrio não encontrado');
            return;
        }

        this.destruirGrafico('graficoPontoEquilibrio');

        this.graficos.graficoPontoEquilibrio = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['0', '20', '40', '60', '80', '100'],
                datasets: [
                    {
                        label: 'Receita',
                        data: [0, 0, 0, 0, 0, 0],
                        borderColor: this.coresGrafico.success,
                        tension: 0.1
                    },
                    {
                        label: 'Custo Total',
                        data: [0, 0, 0, 0, 0, 0],
                        borderColor: this.coresGrafico.danger,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    criarGraficoProjecaoFaturamento() {
        const ctx = document.getElementById('graficoProjecaoFaturamento');
        if (!ctx) {
            console.warn('Canvas graficoProjecaoFaturamento não encontrado');
            return;
        }

        this.destruirGrafico('graficoProjecaoFaturamento');

        this.graficos.graficoProjecaoFaturamento = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Faturamento Projetado',
                    data: [],
                    borderColor: this.coresGrafico.primary,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    atualizarGraficoProjecaoFaturamento(meses, receitas) {
        const grafico = this.graficos.graficoProjecaoFaturamento;
        if (!grafico) return;

        grafico.data.labels = meses;
        grafico.data.datasets[0].data = receitas;
        grafico.update();
    }

    criarGraficoProjecaoLucro() {
        const ctx = document.getElementById('graficoProjecaoLucro');
        if (!ctx) {
            console.warn('Canvas graficoProjecaoLucro não encontrado');
            return;
        }

        this.destruirGrafico('graficoProjecaoLucro');

        this.graficos.graficoProjecaoLucro = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Lucro Projetado',
                    data: [],
                    backgroundColor: this.coresGrafico.success
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    atualizarGraficoProjecaoLucro(meses, lucros) {
        const grafico = this.graficos.graficoProjecaoLucro;
        if (!grafico) return;

        grafico.data.labels = meses;
        grafico.data.datasets[0].data = lucros;
        grafico.update();
    }

    atualizarTodosGraficosComDados() {
        console.log('Atualizando todos os gráficos com dados...');
        
        if (window.dadosNegocio) {
            this.atualizarGraficoDashboard(window.dadosNegocio);
            
            if (window.dadosNegocio.custos) {
                const preco = parseFloat(document.getElementById('precoVendaFinal')?.value) || 0;
                this.atualizarGraficoDistribuicaoPreco(window.dadosNegocio.custos, preco);
            }
            
            this.atualizarGraficoComparacaoConcorrencia();
        }
    }

    exportarGraficoParaImagem(idGrafico, nomeArquivo) {
        const grafico = this.graficos[idGrafico];
        if (!grafico) {
            console.warn('Gráfico não encontrado:', idGrafico);
            return;
        }

        const url = grafico.toBase64Image();
        const link = document.createElement('a');
        link.download = nomeArquivo;
        link.href = url;
        link.click();
    }

    exportarTodosGraficos() {
        Object.keys(this.graficos).forEach(id => {
            this.exportarGraficoParaImagem(id, `${id}.png`);
        });
    }
}

// Expor globalmente
window.GerenciadorGraficos = GerenciadorGraficos;