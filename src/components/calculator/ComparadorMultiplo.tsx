// Componente para comparar múltiplas simulações lado a lado

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GitCompare, 
  TrendingUp, 
  TrendingDown,
  Download,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

import { SimulacaoSalva } from '@/types/tax.types';
import { formatarMoeda, formatarPercentual } from '@/utils/taxCalculations';

interface Props {
  historico: SimulacaoSalva[];
  onExcluir: (id: string) => void;
}

export default function ComparadorMultiplo({ historico, onExcluir }: Props) {
  const [simulacoesSelecionadas, setSimulacoesSelecionadas] = useState<string[]>([]);

  const toggleSimulacao = (id: string) => {
    if (simulacoesSelecionadas.includes(id)) {
      setSimulacoesSelecionadas(simulacoesSelecionadas.filter(s => s !== id));
    } else {
      if (simulacoesSelecionadas.length < 4) {
        setSimulacoesSelecionadas([...simulacoesSelecionadas, id]);
      }
    }
  };

  const simulacoesComparadas = historico.filter(s => 
    simulacoesSelecionadas.includes(s.id)
  );

  // Preparar dados para gráfico de barras
  const dadosComparacao = simulacoesComparadas.map(sim => ({
    nome: sim.nomeSimulacao,
    'Sistema Atual': sim.resultado.sistemaAtual.total,
    'Pós-Reforma': sim.resultado.posReforma.tributoLiquido,
    'Economia': Math.abs(sim.resultado.economia)
  }));

  // Preparar dados para radar
  const dadosRadar = simulacoesComparadas.length > 0 ? [
    {
      metrica: 'Carga Atual',
      ...Object.fromEntries(
        simulacoesComparadas.map(s => [s.nomeSimulacao, s.resultado.sistemaAtual.cargaEfetiva])
      )
    },
    {
      metrica: 'Carga Reforma',
      ...Object.fromEntries(
        simulacoesComparadas.map(s => [s.nomeSimulacao, s.resultado.posReforma.cargaEfetiva])
      )
    },
    {
      metrica: 'Economia %',
      ...Object.fromEntries(
        simulacoesComparadas.map(s => [
          s.nomeSimulacao, 
          Math.abs(s.resultado.variacaoPercentual)
        ])
      )
    }
  ] : [];

  const exportarComparacao = () => {
    const csv = [
      ['Simulação', 'Data', 'Regime', 'Setor', 'Faturamento', 'Sistema Atual', 'Pós-Reforma', 'Economia', 'Variação %'].join(','),
      ...simulacoesComparadas.map(s => [
        s.nomeSimulacao,
        new Date(s.data).toLocaleDateString('pt-BR'),
        s.dadosEmpresa.regime,
        s.dadosEmpresa.setor,
        s.dadosEmpresa.faturamentoMensal,
        s.resultado.sistemaAtual.total,
        s.resultado.posReforma.tributoLiquido,
        s.resultado.economia,
        s.resultado.variacaoPercentual
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `comparacao-simulacoes-${Date.now()}.csv`;
    link.click();
  };

  const melhorCenario = simulacoesComparadas.reduce(
    (melhor, atual) => 
      atual.resultado.economia > melhor.resultado.economia ? atual : melhor,
    simulacoesComparadas[0]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="w-6 h-6" />
                Comparador Múltiplo de Simulações
              </CardTitle>
              <CardDescription>
                Selecione até 4 simulações para comparar lado a lado
              </CardDescription>
            </div>
            {simulacoesSelecionadas.length > 0 && (
              <Button onClick={exportarComparacao} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Comparação
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <GitCompare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Nenhuma simulação salva ainda.</p>
              <p className="text-sm mt-2">Salve simulações para compará-las posteriormente.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lista de Simulações */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-3">
                  Selecione as simulações ({simulacoesSelecionadas.length}/4)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {historico.map((sim) => {
                    const isSelecionada = simulacoesSelecionadas.includes(sim.id);
                    const isDisabled = !isSelecionada && simulacoesSelecionadas.length >= 4;

                    return (
                      <div
                        key={sim.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelecionada 
                            ? 'bg-primary/10 border-primary' 
                            : isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => !isDisabled && toggleSimulacao(sim.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox 
                              checked={isSelecionada}
                              disabled={isDisabled}
                              onCheckedChange={() => !isDisabled && toggleSimulacao(sim.id)}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{sim.nomeSimulacao}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(sim.data).toLocaleDateString('pt-BR', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{sim.dadosEmpresa.regime}</Badge>
                                <Badge variant="outline">{sim.dadosEmpresa.setor}</Badge>
                              </div>
                              <div className="mt-2">
                                <div className="text-sm font-semibold">
                                  Economia: {' '}
                                  <span className={sim.resultado.economia > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {formatarMoeda(Math.abs(sim.resultado.economia))}/mês
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onExcluir(sim.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comparação Visual */}
              {simulacoesComparadas.length > 0 && (
                <>
                  {/* Melhor Cenário */}
                  {melhorCenario && (
                    <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">Melhor Cenário</h3>
                            <p className="text-sm text-muted-foreground">{melhorCenario.nomeSimulacao}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {formatarMoeda(melhorCenario.resultado.economiaAnual)}
                            </div>
                            <div className="text-sm text-muted-foreground">economia/ano</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Gráfico de Barras Comparativo */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparação de Tributação</CardTitle>
                      <CardDescription>Valores mensais em cada cenário</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={dadosComparacao}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="nome" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                          />
                          <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                          <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                          <Legend />
                          <Bar dataKey="Sistema Atual" fill="#ef4444" />
                          <Bar dataKey="Pós-Reforma" fill="#22c55e" />
                          <Bar dataKey="Economia" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Gráfico Radar */}
                  {simulacoesComparadas.length >= 2 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Análise Multidimensional</CardTitle>
                        <CardDescription>Comparação de métricas-chave</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart data={dadosRadar}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metrica" />
                            <PolarRadiusAxis />
                            {simulacoesComparadas.map((sim, idx) => (
                              <Radar
                                key={sim.id}
                                name={sim.nomeSimulacao}
                                dataKey={sim.nomeSimulacao}
                                stroke={['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'][idx]}
                                fill={['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'][idx]}
                                fillOpacity={0.3}
                              />
                            ))}
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tabela Comparativa */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparação Detalhada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-semibold">Métrica</th>
                              {simulacoesComparadas.map(sim => (
                                <th key={sim.id} className="text-right p-3 font-semibold">
                                  {sim.nomeSimulacao}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">Faturamento Mensal</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3">
                                  {formatarMoeda(sim.dadosEmpresa.faturamentoMensal)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">Regime</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3">
                                  <Badge variant="outline">{sim.dadosEmpresa.regime}</Badge>
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">Setor</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3">
                                  <Badge variant="outline">{sim.dadosEmpresa.setor}</Badge>
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50 bg-red-50 dark:bg-red-950/30">
                              <td className="p-3 font-medium">Tributos Sistema Atual</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3 font-semibold">
                                  {formatarMoeda(sim.resultado.sistemaAtual.total)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50 bg-green-50 dark:bg-green-950/30">
                              <td className="p-3 font-medium">Tributos Pós-Reforma</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3 font-semibold">
                                  {formatarMoeda(sim.resultado.posReforma.tributoLiquido)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">Carga Efetiva Atual</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3">
                                  {formatarPercentual(sim.resultado.sistemaAtual.cargaEfetiva)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">Carga Efetiva Pós-Reforma</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3">
                                  {formatarPercentual(sim.resultado.posReforma.cargaEfetiva)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50 bg-blue-50 dark:bg-blue-950/30">
                              <td className="p-3 font-medium">Economia Mensal</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3 font-semibold">
                                  <div className={sim.resultado.economia > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {sim.resultado.economia > 0 ? (
                                      <TrendingUp className="w-4 h-4 inline mr-1" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4 inline mr-1" />
                                    )}
                                    {formatarMoeda(Math.abs(sim.resultado.economia))}
                                  </div>
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-muted/50 bg-blue-50 dark:bg-blue-950/30">
                              <td className="p-3 font-medium">Economia Anual</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3 font-bold text-lg">
                                  <div className={sim.resultado.economiaAnual > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {formatarMoeda(Math.abs(sim.resultado.economiaAnual))}
                                  </div>
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-muted/50">
                              <td className="p-3 font-medium">Variação %</td>
                              {simulacoesComparadas.map(sim => (
                                <td key={sim.id} className="text-right p-3">
                                  <Badge variant={sim.resultado.variacaoPercentual < 0 ? 'default' : 'destructive'}>
                                    {formatarPercentual(sim.resultado.variacaoPercentual)}
                                  </Badge>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
