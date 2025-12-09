// Tipos completos para a calculadora de reforma tributária

export type RegimeTributario = 'simples' | 'presumido' | 'real' | 'simplificado';
export type SetorAtividade = 'comercio' | 'industria' | 'servicos' | 'tecnologia' | 'engenharia' | 'advocacia' | 'energia' | 'telecom';
export type CategoriaIVA = 'zero' | 'reduzida60' | 'reduzida30' | 'padrao' | 'seletivo';
export type RegimeApuracao = 'caixa' | 'competencia';
export type CenarioIVA = 'pessimista' | 'base' | 'otimista';
export type EstadoBR = 'SP' | 'RJ' | 'MG' | 'RS' | 'PR' | 'SC' | 'BA' | 'DF' | 'ES' | 'GO' | 'CE' | 'PE' | 'AM' | 'PA' | 'MT' | 'MS' | 'AL' | 'SE' | 'RN' | 'PB' | 'PI' | 'MA' | 'TO' | 'RO' | 'AC' | 'RR' | 'AP';

export interface DadosEmpresa {
  faturamentoMensal: number;
  regime: RegimeTributario;
  setor: SetorAtividade;
  estado: EstadoBR;
  folhaPagamento: number;
  regimeApuracao: RegimeApuracao;
  custosInsumos: number; // Percentual
  investimentoAtivo: number; // Percentual
  categoriaIVA: CategoriaIVA;
  anoSimulacao: number;
}

export interface TributacaoAtual {
  pis: number;
  cofins: number;
  icms: number;
  iss: number;
  irpj: number;
  csll: number;
  cpp: number;
  total: number;
  cargaEfetiva: number;
}

export interface TributacaoPosReforma {
  cbs: number; // Contribuição sobre Bens e Serviços (federal)
  ibs: number; // Imposto sobre Bens e Serviços (estadual/municipal)
  is: number; // Imposto Seletivo
  creditoInsumos: number;
  creditoAtivo: number;
  tributoBruto: number;
  tributoLiquido: number;
  cargaEfetiva: number;
}

export interface ResultadoComparativo {
  sistemaAtual: TributacaoAtual;
  posReforma: TributacaoPosReforma;
  variacao: number;
  variacaoPercentual: number;
  economia: number;
  economiaAnual: number;
}

export interface Recomendacao {
  tipo: 'otimizacao' | 'mudanca' | 'estruturacao' | 'planejamento';
  prioridade: 'alta' | 'media' | 'baixa';
  titulo: string;
  descricao: string;
  impactoEstimado: number;
  prazo: string;
  acoes: string[];
}

export interface ComparativoEstado {
  estado: EstadoBR;
  nomeEstado: string;
  cargaAtual: number;
  cargaPosReforma: number;
  variacao: number;
  vantagens: string[];
  desvantagens: string[];
}

export interface ComparativoPais {
  pais: string;
  cargaTributaria: number;
  ivaRate: number;
  facilidadeNegocios: number;
  custoOperacional: string;
  vantagens: string[];
  desvantagens: string[];
}

export interface CustoAdaptacao {
  consultoria: number;
  software: number;
  treinamento: number;
  adequacaoProcessos: number;
  total: number;
}

export interface SimulacaoSalva {
  id: string;
  data: string;
  nomeSimulacao: string;
  dadosEmpresa: DadosEmpresa;
  resultado: ResultadoComparativo;
}

export interface TimelineTransicao {
  ano: number;
  fase: string;
  percentualCBS: number;
  percentualIBS: number;
  detalhes: string;
}

export interface FluxoCaixa {
  mes: string;
  receitaBruta: number;
  tributosAtual: number;
  tributosReforma: number;
  liquidoAtual: number;
  liquidoReforma: number;
  diferenca: number;
}

export interface AnaliseSensibilidade {
  parametro: 'faturamento' | 'custos' | 'folha' | 'investimento';
  variacao: number; // -50 a +50
  impactoAtual: number;
  impactoReforma: number;
  diferencaImpacto: number;
}

export interface BreakevenAnalise {
  faturamentoMinimoAtual: number;
  faturamentoMinimoReforma: number;
  diferenca: number;
  economiaNoBreakeven: number;
}

export interface ComparacaoRegimes {
  regime: RegimeTributario;
  nomeRegime: string;
  cargaTributariaAtual: number;
  cargaTributariaReforma: number;
  economiaAnual: number;
  vantagens: string[];
  desvantagens: string[];
  recomendado: boolean;
}

export interface ImpactoProduto {
  produto: string;
  margemAtual: number;
  margemPosReforma: number;
  variacaoMargem: number;
  recomendacao: string;
}

export interface AlertaTransicao {
  data: string;
  tipo: 'prazo' | 'acao' | 'mudanca';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  diasRestantes?: number;
}

export interface ROIInvestimento {
  tipo: 'software' | 'consultoria' | 'treinamento' | 'reestruturacao';
  investimento: number;
  economiaAnual: number;
  payback: number; // em meses
  roiPercentual: number;
  recomendado: boolean;
}
