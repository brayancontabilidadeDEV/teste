// ==================== CALCULADORA MEI PREMIUM - BRAYAN CONTABILIDADE ====================
// Versão 2.0 - Corrigida e Otimizada

// ==================== VARIÁVEIS GLOBAIS ====================
let dadosNegocio = {
    empresa: {},
    produto: {},
    custos: {},
    precificacao: {},
    mercado: {},
    resultados: {},
    meta: {},
    timestamp: new Date().toISOString()
};

let passoAtualDados = 1;
let metodoPrecificacaoSelecionado = 'markup';
let graficosInicializados = false;
let dicasAtivas = [];

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Calculadora MEI Premium - Brayan Contabilidade');
    
    // Verificar dependências
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não carregado!');
        mostrarToast('Erro técnico: Recarregue a página.', 'error');
        return;
    }
    
    console.log('✅ Chart.js carregado - Versão:', Chart.version);
    
    // Inicializar aplicação
    inicializarAplicacao();
});

function inicializarAplicacao() {
    try {
        console.log('📄 Iniciando aplicação...');
        
        // Carregar dados salvos
        carregarDadosSalvos();
        
        // Inicializar eventos
        inicializarEventos();
        inicializarTooltips();
        
        // Inicializar gráficos
        if (typeof window.gerenciadorGraficos !== 'undefined') {
            setTimeout(() => {
                window.gerenciadorGraficos.inicializarTodosGraficos();
                graficosInicializados = true;
            }, 500);
        }
        
        // Calcular valores iniciais
        calcularCustos();
        atualizarDashboard();
        atualizarProgresso();
        
        console.log('✅ Aplicação inicializada com sucesso!');
        mostrarToast('Calculadora MEI Premium pronta!', 'success');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        mostrarToast('Erro ao iniciar. Contate suporte.', 'error');
    }
}

// ==================== NAVEGAÇÃO ====================
function openTab(tabName) {
    try {
        const tabsValidas = ['dashboard', 'dados', 'custos', 'precificacao', 'mercado', 'resultados', 'graficos', 'recomendacoes'];
        if (!tabsValidas.includes(tabName)) {
            console.error('Tab inválida:', tabName);
            return;
        }
        
        // Ocultar todas as tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
            tab.hidden = true;
        });
        
        // Remover destaque dos botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.className = btn.className.replace('gradient-primary text-white', 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300');
        });
        
        // Ativar tab selecionada
        const tabElement = document.getElementById(tabName);
        if (tabElement) {
            tabElement.classList.add('active');
            tabElement.hidden = false;
        }
        
        // Ativar botão correspondente
        const tabBtnId = `tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
        const tabBtn = document.getElementById(tabBtnId);
        if (tabBtn) {
            tabBtn.className = 'tab-btn px-4 py-3 rounded-xl font-medium gradient-primary text-white shadow-md hover-lift';
        }
        
        // Executar ações específicas da tab
        executarAcoesTab(tabName);
        
    } catch (error) {
        console.error('Erro ao abrir tab:', error);
        mostrarToast('Erro de navegação', 'error');
    }
}

function executarAcoesTab(tabName) {
    const acoes = {
        'dashboard': () => atualizarDashboard(),
        'custos': () => calcularCustos(),
        'precificacao': () => atualizarPrecificacao(),
        'mercado': () => analisarConcorrencia(),
        'resultados': () => calcularResultados(),
        'graficos': () => {
            if (graficosInicializados && window.gerenciadorGraficos) {
                setTimeout(() => window.gerenciadorGraficos.atualizarTodosGraficosComDados(), 300);
            }
        },
        'recomendacoes': () => gerarRecomendacoes()
    };
    
    if (acoes[tabName]) acoes[tabName]();
}

// ==================== CÁLCULO DE CUSTOS ====================
function calcularCustos() {
    try {
        console.log('🧮 Calculando custos...');
        
        // Coletar custos variáveis
        const materiaPrima = parseFloat(document.getElementById('materiaPrima')?.value) || 0;
        const embalagem = parseFloat(document.getElementById('embalagem')?.value) || 0;
        const frete = parseFloat(document.getElementById('frete')?.value) || 0;
        
        // Coletar custos fixos
        const aluguel = parseFloat(document.getElementById('aluguel')?.value) || 0;
        const salarios = parseFloat(document.getElementById('salarios')?.value) || 0;
        const das = parseFloat(document.getElementById('das')?.value) || 70.90;
        
        // Quantidade mensal
        const qtdMensal = parseFloat(document.getElementById('qtdVendaMensal')?.value) || 100;
        
        // Calcular totais
        const custoVariavelUnitario = materiaPrima + embalagem + frete;
        const custoFixoMensal = aluguel + salarios + das;
        const custoFixoUnitario = qtdMensal > 0 ? custoFixoMensal / qtdMensal : 0;
        const custoTotalUnitario = custoVariavelUnitario + custoFixoUnitario;
        
        // Armazenar dados
        dadosNegocio.custos = {
            variavelUnitario: custoVariavelUnitario,
            fixoMensal: custoFixoMensal,
            fixoUnitario: custoFixoUnitario,
            totalUnitario: custoTotalUnitario,
            totalMensal: custoTotalUnitario * qtdMensal,
            qtdMensal: qtdMensal
        };
        
        // Atualizar interface
        atualizarElementoTexto('resumoCustoUnitario', formatarMoeda(custoTotalUnitario));
        atualizarElementoTexto('resumoCustoFixo', formatarMoeda(custoFixoMensal));
        atualizarElementoTexto('resumoCustoTotal', formatarMoeda(custoTotalUnitario * qtdMensal));
        
        console.log('✅ Custos calculados!');
        
    } catch (error) {
        console.error('❌ Erro ao calcular custos:', error);
        mostrarToast('Erro ao calcular custos', 'error');
    }
}

// ==================== PRECIFICAÇÃO ====================
function atualizarMarkup(valor) {
    try {
        const markupValor = parseFloat(valor) || 100;
        
        // Atualizar display
        const markupValueElement = document.getElementById('markupValue');
        if (markupValueElement) {
            markupValueElement.textContent = `${markupValor}%`;
        }
        
        // Calcular preço
        const custoUnitario = dadosNegocio.custos?.totalUnitario || 0;
        
        if (custoUnitario > 0) {
            const precoCalculado = custoUnitario * (1 + markupValor / 100);
            
            // Atualizar campos
            atualizarElementoTexto('precoFinalSugerido', formatarMoeda(precoCalculado));
            
            const precoFinalInput = document.getElementById('precoVendaFinal');
            if (precoFinalInput) {
                precoFinalInput.value = precoCalculado.toFixed(2);
            }
            
            // Calcular faixas
            const precoMin = custoUnitario * 1.6;
            const precoMedio = custoUnitario * 2.0;
            const precoMax = custoUnitario * 2.5;
            
            atualizarElementoTexto('precoMarkupMin', formatarMoeda(precoMin));
            atualizarElementoTexto('precoMarkupMedio', formatarMoeda(precoMedio));
            atualizarElementoTexto('precoMarkupMax', formatarMoeda(precoMax));
        }
        
    } catch (error) {
        console.error('Erro ao atualizar markup:', error);
    }
}

function atualizarPrecificacao() {
    if (!dadosNegocio.custos || !dadosNegocio.custos.totalUnitario) {
        mostrarToast('Calcule os custos primeiro!', 'warning');
        return;
    }
    
    const markupSugerido = 100;
    atualizarMarkup(markupSugerido);
}

// ==================== ANÁLISE DE MERCADO ====================
function analisarConcorrencia() {
    try {
        const precoMin = parseFloat(document.getElementById('precoMinConcorrencia')?.value) || 0;
        const precoMedio = parseFloat(document.getElementById('precoMedioConcorrencia')?.value) || 0;
        const precoMax = parseFloat(document.getElementById('precoMaxConcorrencia')?.value) || 0;
        const meuPreco = parseFloat(document.getElementById('precoVendaFinal')?.value) || 0;
        
        if (!precoMin || !precoMedio || !precoMax || !meuPreco) {
            mostrarToast('Preencha todos os preços para análise', 'warning');
            return;
        }
        
        // Calcular métricas
        const diferencaMedia = ((meuPreco - precoMedio) / precoMedio * 100);
        const espacoAumento = precoMax > meuPreco ? ((precoMax - meuPreco) / meuPreco * 100) : 0;
        
        // Atualizar interface
        atualizarElementoTexto('diferencaMedia', `${diferencaMedia >= 0 ? '+' : ''}${diferencaMedia.toFixed(1)}%`);
        atualizarElementoTexto('espacoAumento', `${espacoAumento.toFixed(1)}%`);
        
        // Determinar posição
        let posicao = '';
        const posicaoRelativa = ((meuPreco - precoMin) / (precoMax - precoMin) * 100);
        
        if (posicaoRelativa < 30) posicao = 'MUITO ABAIXO DA MÉDIA';
        else if (posicaoRelativa < 45) posicao = 'ABAIXO DA MÉDIA';
        else if (posicaoRelativa <= 55) posicao = 'NA MÉDIA';
        else if (posicaoRelativa < 70) posicao = 'ACIMA DA MÉDIA';
        else posicao = 'MUITO ACIMA DA MÉDIA';
        
        atualizarElementoTexto('posicaoMercado', posicao);
        
        mostrarToast('Análise de concorrência atualizada!', 'success');
        
    } catch (error) {
        console.error('Erro ao analisar concorrência:', error);
    }
}

// ==================== RESULTADOS ====================
function calcularResultados() {
    try {
        if (!dadosNegocio.custos || !dadosNegocio.custos.totalUnitario) {
            mostrarToast('Calcule os custos primeiro!', 'warning');
            return;
        }
        
        const preco = parseFloat(document.getElementById('precoVendaFinal')?.value) || 0;
        const qtdMensal = dadosNegocio.custos.qtdMensal || 100;
        const custoUnitario = dadosNegocio.custos.totalUnitario;
        const custoFixoMensal = dadosNegocio.custos.fixoMensal;
        
        // Cálculos
        const receitaBruta = preco * qtdMensal;
        const custoProdutos = custoUnitario * qtdMensal;
        const lucroLiquido = receitaBruta - custoProdutos - (receitaBruta * 0.15); // 15% impostos estimados
        const margemLiquida = (lucroLiquido / receitaBruta) * 100;
        const lucroUnitario = preco - custoUnitario;
        const pontoEquilibrio = lucroUnitario > 0 ? Math.ceil(custoFixoMensal / lucroUnitario) : 0;
        
        // Armazenar resultados
        dadosNegocio.resultados = {
            receitaBruta,
            lucroLiquido,
            margemLiquida,
            pontoEquilibrioUnidades: pontoEquilibrio
        };
        
        // Atualizar interface
        atualizarElementoTexto('kpiFaturamento', formatarMoeda(receitaBruta));
        atualizarElementoTexto('kpiLucro', formatarMoeda(lucroLiquido));
        atualizarElementoTexto('kpiMargem', `${margemLiquida.toFixed(1)}%`);
        atualizarElementoTexto('kpiPontoEquilibrio', pontoEquilibrio);
        
        console.log('✅ Resultados calculados!');
        
    } catch (error) {
        console.error('Erro ao calcular resultados:', error);
    }
}

// ==================== DASHBOARD ====================
function atualizarDashboard() {
    try {
        const resultados = dadosNegocio.resultados || {};
        
        atualizarElementoTexto('dashFaturamento', formatarMoeda(resultados.receitaBruta || 0));
        atualizarElementoTexto('dashLucro', formatarMoeda(resultados.lucroLiquido || 0));
        atualizarElementoTexto('dashMargem', `${(resultados.margemLiquida || 0).toFixed(1)}%`);
        atualizarElementoTexto('dashPontoEquilibrio', resultados.pontoEquilibrioUnidades || 0);
        
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
}

// ==================== RECOMENDAÇÕES ====================
function gerarRecomendacoes() {
    try {
        const margem = dadosNegocio.resultados?.margemLiquida || 0;
        
        const recomendacoes = [];
        
        if (margem < 10) {
            recomendacoes.push({
                texto: '🚨 AUMENTE O PREÇO URGENTEMENTE',
                prioridade: 'alta',
                categoria: 'Precificacao'
            });
        } else if (margem < 20) {
            recomendacoes.push({
                texto: '📈 Considere aumentar preços gradualmente',
                prioridade: 'media',
                categoria: 'Precificacao'
            });
        }
        
        // Atualizar interface
        ['Precificacao', 'Custos', 'Mercado', 'Crescimento'].forEach(categoria => {
            const lista = document.getElementById(`recomendacoes${categoria}`);
            const itensCategoria = recomendacoes.filter(r => r.categoria === categoria);
            
            if (lista) {
                if (itensCategoria.length === 0) {
                    lista.innerHTML = '<li class="flex items-start"><i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i><span>✅ Tudo em ordem</span></li>';
                } else {
                    lista.innerHTML = itensCategoria.map(item => `
                        <li class="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-2">
                            <i class="fas fa-exclamation-triangle text-red-500 mt-1 mr-3"></i>
                            <span>${item.texto}</span>
                        </li>
                    `).join('');
                }
            }
        });
        
        atualizarElementoTexto('totalRecomendacoes', recomendacoes.length);
        
    } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
    }
}

// ==================== UTILITÁRIOS ====================
function atualizarElementoTexto(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = texto;
    }
}

function formatarMoeda(valor) {
    if (isNaN(valor) || valor === null || valor === undefined) {
        return 'R$ 0,00';
    }
    return 'R$ ' + parseFloat(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const cores = {
        'success': 'bg-green-600',
        'error': 'bg-red-600',
        'warning': 'bg-yellow-600',
        'info': 'bg-blue-600'
    };
    
    toast.className = `toast ${cores[tipo] || 'bg-blue-600'}`;
    toast.textContent = mensagem;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function toggleDarkMode() {
    const estaDark = document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('darkModeIcon');
    if (icon) icon.className = estaDark ? 'fas fa-sun' : 'fas fa-moon';
    
    localStorage.setItem('darkMode', estaDark ? 'enabled' : 'disabled');
    document.dispatchEvent(new CustomEvent('darkModeChanged'));
}

function saveProgress() {
    try {
        dadosNegocio.timestamp = new Date().toISOString();
        localStorage.setItem('dadosNegocio', JSON.stringify(dadosNegocio));
        console.log('💾 Progresso salvo!');
    } catch (error) {
        console.error('Erro ao salvar:', error);
    }
}

function carregarDadosSalvos() {
    try {
        const dados = localStorage.getItem('dadosNegocio');
        if (dados) {
            dadosNegocio = JSON.parse(dados);
            console.log('✅ Dados carregados');
        }
        
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            const icon = document.getElementById('darkModeIcon');
            if (icon) icon.className = 'fas fa-sun';
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function inicializarEventos() {
    // Auto-save
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', saveProgress);
    });
}

function inicializarTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', mostrarTooltip);
        el.addEventListener('mouseleave', esconderTooltip);
    });
}

function mostrarTooltip(event) {
    const texto = event.target.getAttribute('data-tooltip');
    if (!texto) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-ativo';
    tooltip.textContent = texto;
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    event.target._tooltip = tooltip;
}

function esconderTooltip(event) {
    const tooltip = event.target._tooltip;
    if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
        event.target._tooltip = null;
    }
}

function atualizarProgresso() {
    const campos = ['empresaNome', 'setorEmpresa', 'nomeProduto', 'publicoAlvo', 'qtdVendaMensal'];
    const preenchidos = campos.filter(id => {
        const el = document.getElementById(id);
        return el && el.value && el.value.trim() !== '';
    }).length;
    
    const progresso = Math.round((preenchidos / campos.length) * 100);
    
    atualizarElementoTexto('progressoDados', `${progresso}%`);
    
    const bar = document.getElementById('progressoBar');
    if (bar) {
        bar.style.width = `${progresso}%`;
    }
}

function calcularTudo() {
    calcularCustos();
    setTimeout(() => calcularResultados(), 500);
    setTimeout(() => atualizarDashboard(), 1000);
    setTimeout(() => gerarRecomendacoes(), 1500);
    setTimeout(() => {
        mostrarToast('✅ Análise completa realizada!', 'success');
    }, 2000);
}

// ==================== EXPORTAR FUNÇÕES GLOBAIS ====================
window.openTab = openTab;
window.toggleDarkMode = toggleDarkMode;
window.saveProgress = saveProgress;
window.atualizarMarkup = atualizarMarkup;
window.calcularCustos = calcularCustos;
window.calcularResultados = calcularResultados;
window.analisarConcorrencia = analisarConcorrencia;
window.gerarRecomendacoes = gerarRecomendacoes;
window.atualizarDashboard = atualizarDashboard;
window.calcularTudo = calcularTudo;

console.log('✅ Script principal carregado - Calculadora MEI Premium v2.0');
