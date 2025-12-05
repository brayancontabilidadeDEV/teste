// ==================== GERENCIADOR DE GRÁFICOS AVANÇADO ====================
class GerenciadorGraficos {
    constructor() {
        this.graficos = {};
        this.cores = {
            primaria: '#4F46E5',
            secundaria: '#10B981',
            terciaria: '#F59E0B',
            perigo: '#EF4444',
            info: '#3B82F6',
            custos: ['#4F46E5', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'],
            receita: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
            mercado: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A']
        };
    }

    inicializarGraficos() {
        console.log('🔄 Inicializando gráficos...');
        
        try {
            // Inicializar gráficos de dashboard
            this.inicializarGraficosDashboard();
            
            // Inicializar gráficos de resultados
            this.inicializarGraficosResultados();
            
            // Inicializar gráficos de projeções
            this.inicializarGraficosProjecoes();
            
            console.log('✅ Gráficos inicializados com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar gráficos:', error);
        }
    }

    // ==================== GRÁFICOS DO DASHBOARD ====================
    inicializarGraficosDashboard() {
        // 1. Gráfico de Distribuição de Preço
        const ctxDistribuicao = document.getElementById('graficoDistribuicaoPreco');
        if (ctxDistribuicao) {
            this.graficos.distribuicaoPreco = new Chart(ctxDistribuicao, {
                type: 'doughnut',
                data: {
                    labels: ['Custo Variável', 'Custo Fixo', 'Lucro'],
                    datasets: [{
                        data: [40, 30, 30],
                        backgroundColor: [
                            this.cores.custos[0],
                            this.cores.custos[1],
                            this.cores.receita[0]
                        ],
                        borderWidth: 1,
                        borderColor: '#1F2937'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#6B7280',
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += 'R$ ' + context.raw.toFixed(2);
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }

        // 2. Gráfico de Composição do Preço (Barra)
        const ctxComposicao = document.getElementById('graficoComposicaoPreco');
        if (ctxComposicao) {
            this.graficos.composicaoPreco = new Chart(ctxComposicao, {
                type: 'bar',
                data: {
                    labels: ['Custo Variável', 'Custo Fixo', 'Impostos/Taxas', 'Lucro'],
                    datasets: [{
                        label: 'Valor (R$)',
                        data: [25, 15, 10, 50],
                        backgroundColor: [
                            this.cores.custos[0],
                            this.cores.custos[1],
                            this.cores.perigo,
                            this.cores.receita[0]
                        ],
                        borderWidth: 1,
                        borderColor: '#374151'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `R$ ${context.raw.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value;
                                },
                                color: '#6B7280'
                            },
                            grid: {
                                color: '#374151'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6B7280',
                                maxRotation: 45
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    // ==================== GRÁFICOS DE RESULTADOS ====================
    inicializarGraficosResultados() {
        // Gráfico de Resultados Financeiros
        const ctxResultados = document.getElementById('graficoResultadosFinanceiros');
        if (ctxResultados) {
            this.graficos.resultadosFinanceiros = new Chart(ctxResultados, {
                type: 'bar',
                data: {
                    labels: ['Receita', 'Custos', 'Lucro'],
                    datasets: [{
                        label: 'Valor Mensal (R$)',
                        data: [5000, 3500, 1500],
                        backgroundColor: [
                            this.cores.receita[0],
                            this.cores.perigo,
                            this.cores.primaria
                        ],
                        borderWidth: 1,
                        borderColor: '#374151'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `R$ ${context.raw.toLocaleString('pt-BR')}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                },
                                color: '#6B7280'
                            },
                            grid: {
                                color: '#374151'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6B7280'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Gráfico de Margem de Lucro
        const ctxMargem = document.getElementById('graficoMargemLucro');
        if (ctxMargem) {
            this.graficos.margemLucro = new Chart(ctxMargem, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Margem de Lucro (%)',
                        data: [15, 18, 22, 25, 23, 20],
                        borderColor: this.cores.secundaria,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.raw}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                },
                                color: '#6B7280'
                            },
                            grid: {
                                color: '#374151'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6B7280'
                            },
                            grid: {
                                color: '#374151'
                            }
                        }
                    }
                }
            });
        }
    }

    // ==================== GRÁFICOS DE PROJEÇÕES ====================
    inicializarGraficosProjecoes() {
        const ctxProjecoes = document.getElementById('graficoProjecoes');
        if (ctxProjecoes) {
            this.graficos.projecoes = new Chart(ctxProjecoes, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [
                        {
                            label: 'Receita',
                            data: Array(12).fill(5000).map((v, i) => v * (1 + i * 0.05)),
                            borderColor: this.cores.receita[0],
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'Lucro',
                            data: Array(12).fill(1500).map((v, i) => v * (1 + i * 0.05)),
                            borderColor: this.cores.primaria,
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            borderWidth: 2,
                            fill: true,
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
                                color: '#6B7280',
                                padding: 20
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: R$ ${context.raw.toLocaleString('pt-BR')}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                },
                                color: '#6B7280'
                            },
                            grid: {
                                color: '#374151'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6B7280'
                            },
                            grid: {
                                color: '#374151'
                            }
                        }
                    }
                }
            });
        }
    }

    // ==================== ATUALIZAÇÃO DE GRÁFICOS COM DADOS ====================
    atualizarGraficoDistribuicaoPreco(dadosCustos, precoVenda) {
        if (!this.graficos.distribuicaoPreco || !dadosCustos || !precoVenda) return;
        
        const custoVariavel = dadosCustos.variavelUnitario || 0;
        const custoFixoUnit = dadosCustos.fixoUnitario || 0;
        const lucro = precoVenda - (custoVariavel + custoFixoUnit);
        
        this.graficos.distribuicaoPreco.data.datasets[0].data = [
            custoVariavel,
            custoFixoUnit,
            Math.max(0, lucro) // Não mostrar lucro negativo
        ];
        
        this.graficos.distribuicaoPreco.update();
    }

    atualizarGraficoComposicaoPreco(precoTotal, custoVariavel, custoFixo, markup) {
        if (!this.graficos.composicaoPreco) return;
        
        // Calcular impostos e taxas (estimado em 15%)
        const impostosTaxas = precoTotal * 0.15;
        const lucro = precoTotal - (custoVariavel + custoFixo + impostosTaxas);
        
        this.graficos.composicaoPreco.data.datasets[0].data = [
            custoVariavel,
            custoFixo,
            impostosTaxas,
            Math.max(0, lucro)
        ];
        
        this.graficos.composicaoPreco.update();
    }

    atualizarGraficoResultados(dadosResultados) {
        if (!this.graficos.resultadosFinanceiros || !dadosResultados) return;
        
        this.graficos.resultadosFinanceiros.data.datasets[0].data = [
            dadosResultados.receitaMensal || 0,
            dadosResultados.custoTotalMensal || 0,
            dadosResultados.lucroMensal || 0
        ];
        
        this.graficos.resultadosFinanceiros.update();
        
        // Atualizar gráfico de margem com dados históricos simulados
        if (this.graficos.margemLucro) {
            const margemAtual = dadosResultados.margemLucro || 0;
            const margens = Array(6).fill(0).map((_, i) => {
                // Simular variação histórica baseada na margem atual
                const variacao = (Math.random() - 0.5) * 5;
                return Math.max(5, Math.min(50, margemAtual + variacao));
            });
            
            this.graficos.margemLucro.data.datasets[0].data = margens;
            this.graficos.margemLucro.update();
        }
    }

    atualizarGraficoProjecoes(labels, receita, lucro, acumulado) {
        if (!this.graficos.projecoes) return;
        
        this.graficos.projecoes.data.labels = labels;
        this.graficos.projecoes.data.datasets[0].data = receita;
        this.graficos.projecoes.data.datasets[1].data = lucro;
        
        this.graficos.projecoes.update();
    }

    atualizarTodosGraficosComDados() {
        console.log('🔄 Atualizando todos os gráficos com dados atuais...');
        
        try {
            // Obter dados atuais
            const dadosNegocio = window.dadosNegocio || {};
            const custos = dadosNegocio.custos || {};
            const resultados = dadosNegocio.resultados || {};
            
            const precoVenda = parseFloat(document.getElementById('precoVendaFinal')?.value) || 0;
            
            // Atualizar gráficos individuais
            if (custos.totalUnitario && precoVenda) {
                this.atualizarGraficoDistribuicaoPreco(custos, precoVenda);
                this.atualizarGraficoComposicaoPreco(
                    precoVenda,
                    custos.variavelUnitario || 0,
                    custos.fixoUnitario || 0,
                    custos.markupSugerido || 100
                );
            }
            
            if (resultados.lucroMensal) {
                this.atualizarGraficoResultados(resultados);
            }
            
            console.log('✅ Gráficos atualizados com dados atuais!');
        } catch (error) {
            console.error('❌ Erro ao atualizar gráficos:', error);
        }
    }

    // ==================== FUNÇÕES DE ESTRATÉGIA DE PRECIFICAÇÃO ====================
    gerarEstrategiaPrecificacao(dados) {
        if (!dados || !dados.custos || !dados.mercado) {
            return this.gerarEstrategiaPadrao();
        }
        
        const estrategia = {
            nome: '',
            descricao: '',
            recomendacao: '',
            precos: {},
            grafico: null
        };
        
        const custoUnitario = dados.custos.totalUnitario || 0;
        const precoMedioMercado = dados.mercado.precoMedio || 0;
        
        // Determinar melhor estratégia baseada nos dados
        if (custoUnitario * 2 < precoMedioMercado) {
            // Muito abaixo do mercado
            estrategia.nome = 'Premium Competitivo';
            estrategia.descricao = 'Você pode se posicionar como premium com preço competitivo';
            estrategia.recomendacao = `Aumente gradualmente para R$ ${(custoUnitario * 2.5).toFixed(2)} para se alinhar ao mercado`;
        } else if (custoUnitario * 1.5 > precoMedioMercado) {
            // Acima do mercado
            estrategia.nome = 'Diferenciação por Valor';
            estrategia.descricao = 'Foque em destacar os diferenciais do seu produto';
            estrategia.recomendacao = 'Mantenha o preço mas melhore a comunicação de valor';
        } else {
            // No mercado
            estrategia.nome = 'Preço Competitivo';
            estrategia.descricao = 'Posicionamento ideal no mercado';
            estrategia.recomendacao = 'Mantenha o preço atual e busque eficiências';
        }
        
        // Gerar opções de preço
        estrategia.precos = {
            minimo: custoUnitario * 1.3,
            ideal: custoUnitario * 1.8,
            premium: custoUnitario * 2.2,
            mercado: precoMedioMercado
        };
        
        return estrategia;
    }
    
    gerarEstrategiaPadrao() {
        return {
            nome: 'Markup Tradicional',
            descricao: 'Estratégia baseada em markup sobre custos',
            recomendacao: 'Aplique um markup de 100% sobre seus custos totais',
            precos: {
                minimo: 0,
                ideal: 0,
                premium: 0,
                mercado: 0
            }
        };
    }
}

// Exportar para uso global
window.GerenciadorGraficos = GerenciadorGraficos;
