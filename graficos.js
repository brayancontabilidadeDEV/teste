// graficos.js - Versão Corrigida e Expandida
class GerenciadorGraficos {
    constructor() {
        this.graficos = {};
        this.inicializarTodosGraficos();
    }

    inicializarTodosGraficos() {
        this.inicializarDashboard();
        this.inicializarComposicaoPreco();
        this.inicializarDistribuicaoPreco();
        this.inicializarComparacaoConcorrencia();
        this.inicializarEvolucaoLucro();
        this.inicializarPontoEquilibrio();
        this.inicializarProjecaoFaturamento();
        this.inicializarProjecaoLucro();
    }

    inicializarDashboard() {
        const ctx = document.getElementById('dashGraficoResumo');
        if (!ctx) return;
        
        this.graficos.dashboard = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
                datasets: [{
                    label: 'Faturamento Projetado',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.3
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

    inicializarComposicaoPreco() {
        const ctx = document.getElementById('graficoComposicaoPreco');
        if (!ctx) return;
        
        this.graficos.composicaoPreco = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Custo Variável', 'Custo Fixo', 'Impostos', 'Lucro'],
                datasets: [{
                    data: [25, 25, 25, 25],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderWidth: 1
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
                                return context.label + ': R$ ' + context.raw.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    inicializarDistribuicaoPreco() {
        const ctx = document.getElementById('graficoDistribuicaoPreco');
        if (!ctx) return;
        
        this.graficos.distribuicaoPreco = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Matéria-Prima', 'Mão de Obra', 'Impostos', 'Lucro', 'Marketing', 'Outros'],
                datasets: [{
                    data: [30, 25, 15, 20, 5, 5],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(201, 203, 207, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    inicializarComparacaoConcorrencia() {
        const ctx = document.getElementById('graficoComparacaoConcorrenciaGraficos');
        if (!ctx) return;
        
        this.graficos.comparacaoConcorrencia = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Concorrente A', 'Concorrente B', 'Concorrente C', 'Seu Preço'],
                datasets: [{
                    label: 'Preço de Venda (R$)',
                    data: [45.90, 52.50, 48.75, 49.90],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Preço (R$)'
                        }
                    }
                }
            }
        });
    }

    inicializarEvolucaoLucro() {
        const ctx = document.getElementById('graficoEvolucaoLucro');
        if (!ctx) return;
        
        this.graficos.evolucaoLucro = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                    {
                        label: 'Lucro Mensal',
                        data: [1200, 1900, 1500, 2500, 2200, 3000],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Faturamento',
                        data: [5000, 7000, 6500, 8000, 7500, 9000],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

    inicializarPontoEquilibrio() {
        const ctx = document.getElementById('graficoPontoEquilibrio');
        if (!ctx) return;
        
        this.graficos.pontoEquilibrio = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
                datasets: [
                    {
                        label: 'Custos Totais',
                        data: [800, 950, 1100, 1250, 1400, 1550, 1700, 1850, 2000, 2150, 2300],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Receita Total',
                        data: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Quantidade Vendida'
                        }
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            pontoEquilibrio: {
                                type: 'line',
                                scaleID: 'x',
                                value: 32,
                                borderColor: 'rgb(255, 159, 64)',
                                borderWidth: 2,
                                label: {
                                    content: 'Ponto de Equilíbrio',
                                    enabled: true,
                                    position: 'center'
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    atualizarTodosGraficosComDados() {
        // Esta função será chamada quando os dados forem calculados
        // Atualizará todos os gráficos com os dados atuais
        console.log("Atualizando gráficos com dados...");
        
        // Exemplo de atualização dinâmica
        if (this.graficos.dashboard) {
            const faturamentoBase = parseFloat(document.getElementById('kpiFaturamento')?.textContent?.replace(/[^\d,]/g, '').replace(',', '.') || 0);
            if (faturamentoBase > 0) {
                const projecao = Array.from({length: 6}, (_, i) => 
                    faturamentoBase * (1 + (i * 0.15))
                );
                this.graficos.dashboard.data.datasets[0].data = projecao;
                this.graficos.dashboard.update();
            }
        }
    }

    exportarGraficoParaImagem(idGrafico, nomeArquivo) {
        const canvas = document.getElementById(idGrafico);
        if (!canvas) {
            console.error(`Canvas com ID ${idGrafico} não encontrado.`);
            return;
        }

        const link = document.createElement('a');
        link.download = nomeArquivo || 'grafico.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.gerenciadorGraficos = new GerenciadorGraficos();
});
