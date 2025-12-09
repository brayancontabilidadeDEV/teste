// Módulo de cálculos tributários - Sistema Atual vs Reforma

import { DadosEmpresa, TributacaoAtual, TributacaoPosReforma, ResultadoComparativo, CenarioIVA } from '@/types/tax.types';

// Alíquotas IVA por cenário
export const ALIQUOTAS_IVA: Record<CenarioIVA, number> = {
  pessimista: 0.28,
  base: 0.265,
  otimista: 0.25
};

// Reduções por categoria de produto/serviço
export const REDUCOES_IVA = {
  zero: 0,
  reduzida60: 0.40, // 60% de redução = 40% da alíquota
  reduzida30: 0.70, // 30% de redução = 70% da alíquota
  padrao: 1,
  seletivo: 1.25 // 25% adicional
};

// Alíquotas de ICMS médias por estado
export const ICMS_ESTADOS = {
  SP: 0.18, RJ: 0.20, MG: 0.18, RS: 0.18, PR: 0.18,
  SC: 0.17, BA: 0.19, DF: 0.18, ES: 0.17, GO: 0.17,
  CE: 0.18, PE: 0.18, AM: 0.18, PA: 0.17, MT: 0.17,
  MS: 0.17, AL: 0.18, SE: 0.18, RN: 0.18, PB: 0.18,
  PI: 0.18, MA: 0.20, TO: 0.18, RO: 0.17, AC: 0.17,
  RR: 0.17, AP: 0.18
};

// Alíquotas do Simples Nacional por faixa e atividade
const SIMPLES_ANEXOS = {
  comercio: [ // Anexo I
    { ate: 180000, aliquota: 0.04 },
    { ate: 360000, aliquota: 0.073 },
    { ate: 720000, aliquota: 0.095 },
    { ate: 1800000, aliquota: 0.107 },
    { ate: 3600000, aliquota: 0.143 },
    { ate: 4800000, aliquota: 0.19 }
  ],
  industria: [ // Anexo II
    { ate: 180000, aliquota: 0.045 },
    { ate: 360000, aliquota: 0.078 },
    { ate: 720000, aliquota: 0.10 },
    { ate: 1800000, aliquota: 0.112 },
    { ate: 3600000, aliquota: 0.147 },
    { ate: 4800000, aliquota: 0.30 }
  ],
  servicos: [ // Anexo III
    { ate: 180000, aliquota: 0.06 },
    { ate: 360000, aliquota: 0.112 },
    { ate: 720000, aliquota: 0.135 },
    { ate: 1800000, aliquota: 0.16 },
    { ate: 3600000, aliquota: 0.21 },
    { ate: 4800000, aliquota: 0.33 }
  ]
};

export function calcularTributacaoAtual(dados: DadosEmpresa): TributacaoAtual {
  const faturamentoAnual = dados.faturamentoMensal * 12;
  let pis = 0, cofins = 0, icms = 0, iss = 0, irpj = 0, csll = 0, cpp = 0;

  if (dados.regime === 'simples') {
    // Simples Nacional - alíquota unificada
    const anexo = dados.setor === 'comercio' ? SIMPLES_ANEXOS.comercio :
                  dados.setor === 'industria' ? SIMPLES_ANEXOS.industria :
                  SIMPLES_ANEXOS.servicos;
    
    const faixa = anexo.find(f => faturamentoAnual <= f.ate) || anexo[anexo.length - 1];
    const aliquotaSimples = faixa.aliquota;
    
    const totalSimples = dados.faturamentoMensal * aliquotaSimples;
    
    // Distribuição aproximada do Simples
    pis = totalSimples * 0.05;
    cofins = totalSimples * 0.15;
    icms = totalSimples * 0.35;
    iss = dados.setor.includes('servico') || dados.setor === 'tecnologia' ? totalSimples * 0.20 : 0;
    irpj = totalSimples * 0.15;
    csll = totalSimples * 0.10;
    
  } else if (dados.regime === 'presumido') {
    // Lucro Presumido
    pis = dados.faturamentoMensal * 0.0065;
    cofins = dados.faturamentoMensal * 0.03;
    
    if (dados.setor === 'comercio' || dados.setor === 'industria') {
      icms = dados.faturamentoMensal * (ICMS_ESTADOS[dados.estado] || 0.18);
    } else {
      iss = dados.faturamentoMensal * 0.05; // ISS médio 5%
    }
    
    const baseIR = dados.faturamentoMensal * 0.32; // Presunção 32% para serviços
    irpj = baseIR * 0.15;
    csll = baseIR * 0.09;
    
  } else if (dados.regime === 'real') {
    // Lucro Real - estimativa conservadora
    pis = dados.faturamentoMensal * 0.0165;
    cofins = dados.faturamentoMensal * 0.076;
    
    if (dados.setor === 'comercio' || dados.setor === 'industria') {
      icms = dados.faturamentoMensal * (ICMS_ESTADOS[dados.estado] || 0.18);
    } else {
      iss = dados.faturamentoMensal * 0.05;
    }
    
    const lucroEstimado = dados.faturamentoMensal * 0.20; // Estimativa 20% de lucro
    irpj = lucroEstimado * 0.15;
    csll = lucroEstimado * 0.09;
  }

  // CPP sobre folha
  cpp = dados.folhaPagamento * 0.20;

  const total = pis + cofins + icms + iss + irpj + csll + cpp;
  const cargaEfetiva = (total / dados.faturamentoMensal) * 100;

  return { pis, cofins, icms, iss, irpj, csll, cpp, total, cargaEfetiva };
}

export function calcularTributacaoPosReforma(
  dados: DadosEmpresa, 
  cenario: CenarioIVA = 'base'
): TributacaoPosReforma {
  // Fator de transição baseado no ano
  const fatoresTransicao: Record<number, { cbs: number; ibs: number }> = {
    2026: { cbs: 0.001, ibs: 0.001 }, // Teste 0,1%
    2027: { cbs: 0.27, ibs: 0 },      // CBS começa
    2028: { cbs: 1, ibs: 0 },          // CBS completo
    2029: { cbs: 1, ibs: 0.10 },       // IBS começa 10%
    2030: { cbs: 1, ibs: 0.30 },       // IBS 30%
    2031: { cbs: 1, ibs: 0.50 },       // IBS 50%
    2032: { cbs: 1, ibs: 0.90 },       // IBS 90%
    2033: { cbs: 1, ibs: 1 }           // Sistema completo
  };

  const fator = fatoresTransicao[dados.anoSimulacao] || fatoresTransicao[2033];
  
  // Alíquota base IVA
  const aliquotaBase = ALIQUOTAS_IVA[cenario];
  
  // Aplicar redução por categoria
  const reducao = REDUCOES_IVA[dados.categoriaIVA];
  const aliquotaEfetiva = aliquotaBase * reducao;
  
  // Divisão CBS/IBS (aproximadamente 60% federal, 40% estadual/municipal)
  const aliquotaCBS = aliquotaEfetiva * 0.60 * fator.cbs;
  const aliquotaIBS = aliquotaEfetiva * 0.40 * fator.ibs;
  
  // Cálculo dos tributos brutos
  const cbs = dados.faturamentoMensal * aliquotaCBS;
  const ibs = dados.faturamentoMensal * aliquotaIBS;
  
  // Imposto Seletivo (apenas para categoria seletiva)
  const is = dados.categoriaIVA === 'seletivo' 
    ? dados.faturamentoMensal * 0.25 * (fator.cbs + fator.ibs) / 2
    : 0;
  
  const tributoBruto = cbs + ibs + is;
  
  // Créditos - não cumulatividade
  const valorInsumos = dados.faturamentoMensal * (dados.custosInsumos / 100);
  const creditoInsumos = valorInsumos * aliquotaEfetiva * Math.min(fator.cbs, fator.ibs);
  
  // Crédito de ativo imobilizado (parcelado em 48 meses)
  const valorAtivoMensal = dados.faturamentoMensal * (dados.investimentoAtivo / 100) / 48;
  const creditoAtivo = valorAtivoMensal * aliquotaEfetiva * Math.min(fator.cbs, fator.ibs);
  
  const tributoLiquido = Math.max(0, tributoBruto - creditoInsumos - creditoAtivo);
  const cargaEfetiva = (tributoLiquido / dados.faturamentoMensal) * 100;

  return {
    cbs,
    ibs,
    is,
    creditoInsumos,
    creditoAtivo,
    tributoBruto,
    tributoLiquido,
    cargaEfetiva
  };
}

export function compararSistemas(
  dados: DadosEmpresa,
  cenario: CenarioIVA = 'base'
): ResultadoComparativo {
  const sistemaAtual = calcularTributacaoAtual(dados);
  const posReforma = calcularTributacaoPosReforma(dados, cenario);
  
  const variacao = posReforma.tributoLiquido - sistemaAtual.total;
  const variacaoPercentual = sistemaAtual.total > 0 
    ? (variacao / sistemaAtual.total) * 100 
    : 0;
  
  const economia = -variacao; // Negativo = aumento, positivo = economia
  const economiaAnual = economia * 12;

  return {
    sistemaAtual,
    posReforma,
    variacao,
    variacaoPercentual,
    economia,
    economiaAnual
  };
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export function formatarPercentual(valor: number): string {
  return `${valor.toFixed(2)}%`;
}
