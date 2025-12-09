// Componente de Análises Avançadas - Cashflow, Sensibilidade, Breakeven, etc.

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Zap,
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

import { DadosEmpresa, ResultadoComparativo, CenarioIVA } from '@/types/tax.types';
import {
  simularFluxoCaixa,
  analisarSensibilidade,
  calcularBreakeven,
  compararRegimes,
  simularImpactoProdutos,
  gerarAlertasTransicao,
  calcularROIInvestimentos
} from '@/utils/advancedAnalytics';
import { formatarMoeda, formatarPercentual } from '@/utils/taxCalculations';

interface Props {
  dados: DadosEmpresa;
  resultado: ResultadoComparativo;
  cenario: CenarioIVA;
}

export default function AnalisesAvancadas({ dados, resultado, cenario }: Props) {
  const [crescimentoMensal, setCrescimentoMensal] = useState(2);
  const [custoFixo, setCustoFixo] = useState(50000);
  const [produtos, setProdutos] = useState([
    { nome: 'Produto A', margemAtual: 25, participacao: 40 },
    { nome: 'Produto B', margemAtual: 18, participacao: 35 },
    { nome: 'Produto C', margemAtual: 30, participacao: 25 }
  ]);

  // Cálculos
  const fluxoCaixa = simularFluxoCaixa(dados, resultado, crescimentoMensal);
  const sensibilidade = analisarSensibilidade(dados, cenario);
  const breakeven = calcularBreakeven(dados, custoFixo, cenario);
  const regimes = compararRegimes(dados, cenario);
  const impactoProdutos = simularImpactoProdutos(dados, produtos, cenario);
  const alertas = gerarAlertasTransicao();
  const roiInvestimentos = calcularROIInvestimentos(Math.abs(resultado.economiaAnual));

  // Preparar dados para gráficos de sensibilidade
  const sensibilidadeFaturamento = sensibilidade
    .filter(s => s.parametro === 'faturamento')
    .map(s => ({
      variacao: `${s.variacao > 0 ? '+' : ''}${s.variacao}%`,
      Atual: s.impactoAtual,
      Reforma: s.impactoReforma,
      Diferença: s.diferencaImpacto
    }));

  const sensibilidadeCustos = sensibilidade
    .filter(s => s.parametro === 'custos')
    .map(s => ({
      variacao: `${s.variacao > 0 ? '+' : ''}${s.variacao}%`,
      Atual: s.impactoAtual,
      Reforma: s.impactoReforma
    }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cashflow" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="cashflow">
            <Activity className="w-4 h-4 mr-2" />
            Cashflow
          </TabsTrigger>
          <TabsTrigger value="sensibilidade">
            <Zap className="w-4 h-4 mr-2" />
            Sensibilidade
          </TabsTrigger>
          <TabsTrigger value="breakeven">
            <Target className="w-4 h-4 mr-2" />
            Breakeven
          </TabsTrigger>
          <TabsTrigger value="avancado">
            <TrendingUp className="w-4 h-4 mr-2" />
            Avançado
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CASHFLOW */}
        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Simulação de Fluxo de Caixa (12 meses)</CardTitle>
                  <CardDescription>
                    Projeção mensal do impacto tributário no caixa da empresa
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <Label htmlFor="crescimento">Crescimento Mensal (%)</Label>
                    <Input
                      id="crescimento"
                      type="number"
                      value={crescimentoMensal}
                      onChange={(e) => setCrescimentoMensal(Number(e.target.value))}
                      className="w-24"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={fluxoCaixa}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatarMoeda(value)}
                    labelStyle={{ color: 'black' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="liquidoAtual" 
                    stackId="1"
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                    name="Líquido Sistema Atual"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="liquidoReforma" 
                    stackId="2"
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.6}
                    name="Líquido Pós-Reforma"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Total Receita (12 meses)</div>
                    <div className="text-2xl font-bold">
                      {formatarMoeda(fluxoCaixa.reduce((sum, f) => sum + f.receitaBruta, 0))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Economia Total (12 meses)</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatarMoeda(fluxoCaixa.reduce((sum, f) => sum + f.diferenca, 0))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Margem Líquida Média (Reforma)</div>
                    <div className="text-2xl font-bold">
                      {formatarPercentual(
                        (fluxoCaixa.reduce((sum, f) => sum + f.liquidoReforma, 0) /
                        fluxoCaixa.reduce((sum, f) => sum + f.receitaBruta, 0)) * 100
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SENSIBILIDADE */}
        <TabsContent value="sensibilidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Sensibilidade</CardTitle>
              <CardDescription>
                Como variações em receita e custos impactam sua tributação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sensibilidade de Faturamento */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Impacto de Variação no Faturamento</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensibilidadeFaturamento}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="variacao" />
                    <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Atual" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Sistema Atual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Reforma" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Pós-Reforma"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Diferença" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Diferença"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sensibilidade de Custos */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Impacto de Variação nos Custos com Insumos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sensibilidadeCustos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="variacao" />
                    <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                    <Legend />
                    <Bar dataKey="Atual" fill="#ef4444" name="Sistema Atual" />
                    <Bar dataKey="Reforma" fill="#22c55e" name="Pós-Reforma" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100">Insights:</h4>
                    <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 mt-2">
                      <li>• Maior faturamento amplia benefícios da reforma devido aos créditos</li>
                      <li>• Aumento de custos com insumos reduz carga líquida pós-reforma</li>
                      <li>• Modelo é mais vantajoso em cenários de crescimento</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BREAKEVEN */}
        <TabsContent value="breakeven" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Ponto de Equilíbrio</CardTitle>
              <CardDescription>
                Faturamento mínimo necessário para cobrir custos fixos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="custoFixo">Custo Fixo Mensal (R$)</Label>
                  <Input
                    id="custoFixo"
                    type="number"
                    value={custoFixo}
                    onChange={(e) => setCustoFixo(Number(e.target.value))}
                    step="1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sistema Atual</div>
                        <div className="text-2xl font-bold">{formatarMoeda(breakeven.faturamentoMinimoAtual)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Faturamento mínimo mensal</div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Pós-Reforma</div>
                        <div className="text-2xl font-bold">{formatarMoeda(breakeven.faturamentoMinimoReforma)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Faturamento mínimo mensal</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-950">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Diferença no Breakeven</div>
                      <div className="text-3xl font-bold">
                        {formatarMoeda(Math.abs(breakeven.diferenca))}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={breakeven.diferenca < 0 ? 'default' : 'destructive'} className="text-lg px-4 py-2">
                        {breakeven.diferenca < 0 ? (
                          <><TrendingDown className="w-5 h-5 mr-2" /> {formatarPercentual((breakeven.diferenca / breakeven.faturamentoMinimoAtual) * 100)}</>
                        ) : (
                          <><TrendingUp className="w-5 h-5 mr-2" /> {formatarPercentual((breakeven.diferenca / breakeven.faturamentoMinimoAtual) * 100)}</>
                        )}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-2">
                        {breakeven.diferenca < 0 ? 'Ponto de equilíbrio reduz' : 'Ponto de equilíbrio aumenta'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Interpretação:</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                      {breakeven.diferenca < 0 
                        ? `Com a reforma, você precisará de ${formatarPercentual(Math.abs((breakeven.diferenca / breakeven.faturamentoMinimoAtual) * 100))} MENOS faturamento para cobrir seus custos fixos. Isso significa maior margem de segurança operacional.`
                        : `Com a reforma, você precisará de ${formatarPercentual((breakeven.diferenca / breakeven.faturamentoMinimoAtual) * 100)} MAIS faturamento para cobrir seus custos fixos. Considere otimizações fiscais.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparação de Regimes */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Regimes Tributários</CardTitle>
              <CardDescription>
                Qual regime é mais vantajoso para seu perfil?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regimes.map((regime) => (
                  <Card key={regime.regime} className={regime.recomendado ? 'border-2 border-green-500' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold">{regime.nomeRegime}</h3>
                          {regime.recomendado && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Recomendado
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatarMoeda(regime.economiaAnual)}/ano
                          </div>
                          <div className="text-sm text-muted-foreground">Economia estimada</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Carga Atual</div>
                          <div className="text-xl font-bold">{formatarPercentual(regime.cargaTributariaAtual)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Carga Pós-Reforma</div>
                          <div className="text-xl font-bold">{formatarPercentual(regime.cargaTributariaReforma)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">✓ Vantagens:</h4>
                          <ul className="text-sm space-y-1">
                            {regime.vantagens.map((v, i) => (
                              <li key={i} className="text-muted-foreground">• {v}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">✗ Desvantagens:</h4>
                          <ul className="text-sm space-y-1">
                            {regime.desvantagens.map((d, i) => (
                              <li key={i} className="text-muted-foreground">• {d}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: AVANÇADO */}
        <TabsContent value="avancado" className="space-y-6">
          {/* Impacto por Produto */}
          <Card>
            <CardHeader>
              <CardTitle>Impacto por Linha de Produto</CardTitle>
              <CardDescription>
                Como a reforma afeta a margem de cada produto/serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {impactoProdutos.map((prod, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{prod.produto}</h3>
                        <Badge variant={prod.variacaoMargem > 0 ? 'default' : 'destructive'}>
                          {prod.variacaoMargem > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {formatarPercentual(prod.variacaoMargem)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Margem Atual</div>
                          <div className="text-xl font-bold">{formatarPercentual(prod.margemAtual)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Margem Pós-Reforma</div>
                          <div className="text-xl font-bold">{formatarPercentual(prod.margemPosReforma)}</div>
                        </div>
                      </div>
                      <div className="text-sm p-3 bg-muted rounded-lg">
                        {prod.recomendacao}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Transição */}
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Transição</CardTitle>
              <CardDescription>
                Prazos e mudanças importantes da reforma tributária
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertas.map((alerta, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      alerta.prioridade === 'alta' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' :
                      alerta.prioridade === 'media' ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' :
                      'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={
                            alerta.tipo === 'prazo' ? 'destructive' :
                            alerta.tipo === 'acao' ? 'default' :
                            'secondary'
                          }>
                            {alerta.tipo.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-semibold">{alerta.data}</span>
                        </div>
                        <h4 className="font-bold">{alerta.titulo}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{alerta.descricao}</p>
                      </div>
                      {alerta.diasRestantes && alerta.diasRestantes > 0 && (
                        <Badge variant="outline" className="ml-4">
                          {alerta.diasRestantes} dias
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROI de Investimentos */}
          <Card>
            <CardHeader>
              <CardTitle>Retorno sobre Investimentos em Adequação</CardTitle>
              <CardDescription>
                Vale a pena investir em adequação fiscal?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roiInvestimentos.map((roi, idx) => (
                  <Card key={idx} className={roi.recomendado ? 'border-2 border-green-500' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <h3 className="font-bold capitalize">{roi.tipo}</h3>
                        </div>
                        {roi.recomendado && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Recomendado
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Investimento</div>
                          <div className="text-lg font-bold">{formatarMoeda(roi.investimento)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Economia Anual</div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatarMoeda(roi.economiaAnual)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Payback</div>
                            <div className="font-bold">{roi.payback} meses</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">ROI</div>
                            <div className="font-bold">{roi.roiPercentual}%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
