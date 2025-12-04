// graficos.js - Versão Corrigida e Expandida
class GerenciadorGraficos {
    constructor() {
        this.graficos = {};
        this.inicializado = false;
        this.ctxCache = new Map(); // Cache para contextos de canvas
    }

    inicializarTodosGraficos() {
        try {
            console.log('Inicializando gráficos...');
            
            this.inicializarDashboard();
            this.inicializarComposicaoPreco();
            this.inicializarDistribuicaoPreco();
            this.inicializarComparacaoConcorrencia();
            this.inicializarEvolucaoLucro();
            this.inicializarPontoEquilibrio();
            this.inicializarProjecaoFaturamento();
            this.inicializarProjecaoLucro();
            
            this.inicializado = true;
            console.log('Gráficos inicializados com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar gráficos:', error);
            throw error;
        }
    }

    getContext(canvasId) {
        if (this.ctxCache.has(canvasId)) {
            return this.ctxCache.get(canvasId);
        }
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas ${canvasId} não encontrado`);
            return null;
        }
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            this.ctxCache.set(canvasId, ctx);
        }
        
        return ctx;
    }

    destruirGrafico(graficoId) {
        if (this.graficos[graficoId]) {
            try {
                this.graficos[graficoId].destroy();
                delete this.graficos[graficoId];
            } catch (error) {
                console.warn(`Erro ao destruir gráfico ${graficoId}:`, error);
            }
        }
    }

    inicializarDashboard() {
        const ctx = this.getContext('dashGraficoResumo');
        if (!ctx) return;
        
        this.destruirGrafico('dashboard');
        
        try {
            this.graficos.dashboard = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
                    datasets: [{
                        label: 'Faturamento Projetado',
                        data: [0, 0, 0, 0, 0, 0],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: document.body.classList.contains('dark-mode') ? '#1f2937' : '#ffffff',
                            titleColor: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827',
                            bodyColor: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827',
                            borderColor: document.body.classList.contains('dark-mode') ? '#374151' : '#e5e7eb',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280',
                                callback: function(value) {
                                    if (value >= 1000) {
                                        return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                                    }
                                    return 'R$ ' + value;
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar dashboard:', error);
        }
    }

    inicializarComposicaoPreco() {
        const ctx = this.getContext('graficoComposicaoPreco');
        if (!ctx) return;
        
        this.destruirGrafico('composicaoPreco');
        
        try {
            this.graficos.composicaoPreco = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Custo Variável', 'Custo Fixo', 'Impostos', 'Lucro'],
                    datasets: [{
                        data: [25, 25, 25, 25],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(16, 185, 129, 0.8)'
                        ],
                        borderColor: [
                            'rgb(239, 68, 68)',
                            'rgb(59, 130, 246)',
                            'rgb(245, 158, 11)',
                            'rgb(16, 185, 129)'
                        ],
                        borderWidth: 1,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827',
                                padding: 20,
                                font: {
                                    size: 11
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar composição de preço:', error);
        }
    }

    inicializarDistribuicaoPreco() {
        const ctx = this.getContext('graficoDistribuicaoPreco');
        if (!ctx) return;
        
        this.destruirGrafico('distribuicaoPreco');
        
        try {
            this.graficos.distribuicaoPreco = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Matéria-Prima', 'Mão de Obra', 'Impostos', 'Lucro', 'Marketing', 'Outros'],
                    datasets: [{
                        data: [30, 25, 15, 20, 5, 5],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(156, 163, 175, 0.8)'
                        ],
                        borderColor: document.body.classList.contains('dark-mode') ? '#1f2937' : '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827',
                                padding: 15,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar distribuição de preço:', error);
        }
    }

    inicializarComparacaoConcorrencia() {
        const ctx = this.getContext('graficoComparacaoConcorrenciaGraficos');
        if (!ctx) return;
        
        this.destruirGrafico('comparacaoConcorrencia');
        
        try {
            this.graficos.comparacaoConcorrencia = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Concorrente A', 'Concorrente B', 'Concorrente C', 'Seu Preço'],
                    datasets: [{
                        label: 'Preço de Venda (R$)',
                        data: [45.90, 52.50, 48.75, 49.90],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.6)',
                            'rgba(59, 130, 246, 0.6)',
                            'rgba(245, 158, 11, 0.6)',
                            'rgba(16, 185, 129, 0.6)'
                        ],
                        borderColor: [
                            'rgb(239, 68, 68)',
                            'rgb(59, 130, 246)',
                            'rgb(245, 158, 11)',
                            'rgb(16, 185, 129)'
                        ],
                        borderWidth: 1
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
                            title: {
                                display: true,
                                text: 'Preço (R$)',
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827'
                            },
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280',
                                callback: function(value) {
                                    return 'R$ ' + value.toFixed(2);
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar comparação de concorrência:', error);
        }
    }

    inicializarEvolucaoLucro() {
        const ctx = this.getContext('graficoEvolucaoLucro');
        if (!ctx) return;
        
        this.destruirGrafico('evolucaoLucro');
        
        try {
            this.graficos.evolucaoLucro = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [
                        {
                            label: 'Lucro Mensal',
                            data: [1200, 1900, 1500, 2500, 2200, 3000],
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Faturamento',
                            data: [5000, 7000, 6500, 8000, 7500, 9000],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280',
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar evolução do lucro:', error);
        }
    }

    inicializarPontoEquilibrio() {
        const ctx = this.getContext('graficoPontoEquilibrio');
        if (!ctx) return;
        
        this.destruirGrafico('pontoEquilibrio');
        
        try {
            this.graficos.pontoEquilibrio = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['0', '20', '40', '60', '80', '100'],
                    datasets: [
                        {
                            label: 'Custos Totais',
                            data: [800, 1100, 1400, 1700, 2000, 2300],
                            borderColor: 'rgb(239, 68, 68)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderWidth: 2,
                            tension: 0.3
                        },
                        {
                            label: 'Receita Total',
                            data: [0, 1000, 2000, 3000, 4000, 5000],
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 2,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Valor (R$)',
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827'
                            },
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Quantidade Vendida',
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827'
                            },
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar ponto de equilíbrio:', error);
        }
    }

    inicializarProjecaoFaturamento() {
        const ctx = this.getContext('graficoProjecaoFaturamento');
        if (!ctx) return;
        
        this.destruirGrafico('projecaoFaturamento');
        
        try {
            this.graficos.projecaoFaturamento = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
                    datasets: [{
                        label: 'Faturamento Projetado',
                        data: [5000, 5500, 6000, 6500, 7000, 7500],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        },
                        x: {
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar projeção de faturamento:', error);
        }
    }

    inicializarProjecaoLucro() {
        const ctx = this.getContext('graficoProjecaoLucro');
        if (!ctx) return;
        
        this.destruirGrafico('projecaoLucro');
        
        try {
            this.graficos.projecaoLucro = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
                    datasets: [{
                        label: 'Lucro Projetado',
                        data: [1000, 1200, 1400, 1600, 1800, 2000],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: document.body.classList.contains('dark-mode') ? '#f3f4f6' : '#111827'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        },
                        x: {
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar projeção de lucro:', error);
        }
    }

    atualizarGraficoComposicao(preco, custoVarUnit, custoFixoUnit, markup) {
        if (!this.graficos.composicaoPreco) return;
        
        try {
            const impostos = preco * 0.15; // 15% estimado (alterado de 7% para 15%)
            const lucro = preco - custoVarUnit - custoFixoUnit - impostos;
            
            this.graficos.composicaoPreco.data.datasets[0].data = [
                Math.max(custoVarUnit, 0),
                Math.max(custoFixoUnit, 0),
                Math.max(impostos, 0),
                Math.max(lucro, 0)
            ];
            
            this.graficos.composicaoPreco.update();
        } catch (error) {
            console.error('Erro ao atualizar gráfico de composição:', error);
        }
    }

    atualizarGraficoDistribuicaoPreco(custos, preco) {
        if (!this.graficos.distribuicaoPreco || !custos || !preco) return;
        
        try {
            // Usar dados mais realistas
            const valores = [
                custos.variavelUnitario || 0,
                custos.fixoUnitario || 0,
                preco * 0.15, // Impostos 15%
                preco * 0.25, // Lucro estimado 25%
                preco * 0.10, // Marketing 10%
                preco * 0.05  // Outros 5%
            ];
            
            // Ajustar para que a soma seja igual ao preço
            const totalAtual = valores.reduce((a, b) => a + b, 0);
            const fatorAjuste = preco / totalAtual;
            
            if (totalAtual > 0 && fatorAjuste > 0) {
                const valoresAjustados = valores.map(v => v * fatorAjuste);
                this.graficos.distribuicaoPreco.data.datasets[0].data = valoresAjustados;
                this.graficos.distribuicaoPreco.update();
            }
        } catch (error) {
            console.error('Erro ao atualizar gráfico de distribuição:', error);
        }
    }

    atualizarGraficoComparacaoConcorrencia(precoMin, precoMedio, precoMax, meuPreco) {
        if (!this.graficos.comparacaoConcorrencia) return;
        
        try {
            this.graficos.comparacaoConcorrencia.data.datasets[0].data = [
                precoMin || 45,
                precoMedio || 60,
                precoMax || 80,
                meuPreco || 55
            ];
            
            // Atualizar labels para refletir os nomes corretos
            this.graficos.comparacaoConcorrencia.data.labels = [
                'Mais Barato', 
                'Média Mercado', 
                'Mais Caro', 
                'Seu Preço'
            ];
            
            this.graficos.comparacaoConcorrencia.update();
        } catch (error) {
            console.error('Erro ao atualizar gráfico de comparação:', error);
        }
    }

    atualizarProjecoes(meses, receitas, lucros) {
        if (this.graficos.projecaoFaturamento && receitas) {
            try {
                this.graficos.projecaoFaturamento.data.labels = meses;
                this.graficos.projecaoFaturamento.data.datasets[0].data = receitas;
                this.graficos.projecaoFaturamento.update();
            } catch (error) {
                console.error('Erro ao atualizar projeção de faturamento:', error);
            }
        }
        
        if (this.graficos.projecaoLucro && lucros) {
            try {
                this.graficos.projecaoLucro.data.labels = meses;
                this.graficos.projecaoLucro.data.datasets[0].data = lucros;
                this.graficos.projecaoLucro.update();
            } catch (error) {
                console.error('Erro ao atualizar projeção de lucro:', error);
            }
        }
    }

    atualizarTodosGraficosComDados() {
        if (!this.inicializado) {
            console.warn('Gráficos não inicializados');
            return;
        }
        
        try {
            console.log("Atualizando todos os gráficos com dados...");
            
            // Atualizar dashboard
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
            
            // Atualizar evolução do lucro com dados reais
            if (this.graficos.evolucaoLucro) {
                const lucroAtual = parseFloat(document.getElementById('kpiLucro')?.textContent?.replace(/[^\d,]/g, '').replace(',', '.') || 0);
                if (lucroAtual > 0) {
                    const lucros = Array.from({length: 6}, (_, i) => 
                        lucroAtual * (0.8 + (i * 0.08))
                    );
                    this.graficos.evolucaoLucro.data.datasets[0].data = lucros;
                    this.graficos.evolucaoLucro.update();
                }
            }
            
            // Atualizar ponto de equilíbrio
            if (this.graficos.pontoEquilibrio) {
                const pontoEquilibrio = parseInt(document.getElementById('kpiPontoEquilibrio')?.textContent || 32);
                if (pontoEquilibrio > 0) {
                    // Ajustar dados do gráfico baseado no ponto de equilíbrio
                    const qtdVendida = parseInt(document.getElementById('qtdVendaMensal')?.value || 100);
                    const escala = Math.max(pontoEquilibrio * 2, qtdVendida);
                    
                    const labels = Array.from({length: 6}, (_, i) => 
                        Math.round((escala / 5) * i)
                    );
                    
                    // Atualizar dados do gráfico
                    const custoFixo = dadosNegocio.custos?.fixoMensal || 0;
                    const lucroUnitario = (dadosNegocio.resultados?.lucroLiquido || 0) / (dadosNegocio.custos?.qtdMensal || 1);
                    
                    const custosTotais = labels.map(qtd => custoFixo + (dadosNegocio.custos?.variavelUnitario || 0) * qtd);
                    const receitasTotais = labels.map(qtd => qtd * (dadosNegocio.precificacao?.precoVenda || 0));
                    
                    this.graficos.pontoEquilibrio.data.labels = labels;
                    this.graficos.pontoEquilibrio.data.datasets[0].data = custosTotais;
                    this.graficos.pontoEquilibrio.data.datasets[1].data = receitasTotais;
                    
                    this.graficos.pontoEquilibrio.update();
                }
            }
            
        } catch (error) {
            console.error('Erro ao atualizar gráficos com dados:', error);
        }
    }

    exportarGraficoParaImagem(idGrafico, nomeArquivo) {
        const canvas = document.getElementById(idGrafico);
        if (!canvas) {
            console.error(`Canvas com ID ${idGrafico} não encontrado.`);
            return false;
        }

        try {
            const link = document.createElement('a');
            link.download = nomeArquivo || `grafico-${idGrafico}-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            return true;
        } catch (error) {
            console.error('Erro ao exportar gráfico:', error);
            return false;
        }
    }

    exportarTodosGraficos() {
        const graficosIds = [
            'dashGraficoResumo',
            'graficoComposicaoPreco',
            'graficoDistribuicaoPreco',
            'graficoComparacaoConcorrenciaGraficos',
            'graficoEvolucaoLucro',
            'graficoPontoEquilibrio',
            'graficoProjecaoFaturamento',
            'graficoProjecaoLucro'
        ];
        
        let exportados = 0;
        const dataHoje = new Date().toISOString().split('T')[0];
        
        graficosIds.forEach((id, index) => {
            setTimeout(() => {
                if (this.exportarGraficoParaImagem(id, `grafico-${dataHoje}-${index + 1}.png`)) {
                    exportados++;
                }
            }, index * 500); // Delay para evitar sobrecarga
        });
        
        setTimeout(() => {
            if (exportados > 0) {
                mostrarToast(`${exportados} gráficos exportados com sucesso!`, 'success');
            }
        }, graficosIds.length * 500 + 1000);
    }

    atualizarCoresDarkMode() {
        // Atualizar cores dos gráficos quando o modo dark muda
        Object.values(this.graficos).forEach(grafico => {
            if (grafico && grafico.options) {
                // Atualizar cores das escalas
                if (grafico.options.scales) {
                    Object.values(grafico.options.scales).forEach(scale => {
                        if (scale.grid) {
                            scale.grid.color = document.body.classList.contains('dark-mode') ? 
                                'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                        }
                        if (scale.ticks) {
                            scale.ticks.color = document.body.classList.contains('dark-mode') ? 
                                '#9ca3af' : '#6b7280';
                        }
                    });
                }
                
                // Atualizar cores da legenda
                if (grafico.options.plugins?.legend?.labels) {
                    grafico.options.plugins.legend.labels.color = document.body.classList.contains('dark-mode') ? 
                        '#f3f4f6' : '#111827';
                }
                
                grafico.update();
            }
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.gerenciadorGraficos = new GerenciadorGraficos();
        
        // Adicionar listener para dark mode
        document.addEventListener('darkModeChanged', function() {
            if (window.gerenciadorGraficos) {
                setTimeout(() => {
                    window.gerenciadorGraficos.atualizarCoresDarkMode();
                }, 100);
            }
        });
        
        console.log('Gerenciador de gráficos inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar gerenciador de gráficos:', error);
    }
});
