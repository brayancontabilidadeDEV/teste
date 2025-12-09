import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DadosEmpresa, ResultadoComparativo } from '@/types/tax.types';
import { compararEstados, compararPaises } from '@/utils/recommendations';
import { formatarMoeda } from '@/utils/taxCalculations';
import { MapPin, Globe, TrendingDown, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  dados: DadosEmpresa;
  resultado: ResultadoComparativo | null;
}

export default function ComparativoCenarios({ dados, resultado }: Props) {
  const estadosComparativos = compararEstados(dados);
  const paisesComparativos = compararPaises();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Comparativo de Cenários</CardTitle>
          <CardDescription>Análise de mudança de estado ou internacionalização</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="estados" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="estados" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Estados Brasileiros
          </TabsTrigger>
          <TabsTrigger value="paises" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Países
          </TabsTrigger>
        </TabsList>

        <TabsContent value="estados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo por Estado</CardTitle>
              <CardDescription>
                Seu estado atual: <strong>{dados.estado}</strong> - Analise o impacto de mudança para outros estados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadosComparativos.map((estado, index) => (
                  <div 
                    key={estado.estado}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      estado.estado === dados.estado 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-green-600 text-white' :
                          index === 1 ? 'bg-blue-600 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-secondary text-secondary-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{estado.nomeEstado}</h4>
                          {estado.estado === dados.estado && (
                            <Badge variant="default">Estado Atual</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {estado.variacao < 0 ? (
                            <TrendingDown className="w-5 h-5 text-green-600" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`text-2xl font-bold ${
                            estado.variacao < 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {estado.variacao > 0 ? '+' : ''}{estado.variacao.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">vs reforma</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-secondary/30 rounded">
                        <div className="text-xs text-muted-foreground mb-1">Carga Atual (ICMS)</div>
                        <div className="font-semibold">{estado.cargaAtual.toFixed(1)}%</div>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded">
                        <div className="text-xs text-muted-foreground mb-1">Pós-Reforma (IBS)</div>
                        <div className="font-semibold">{estado.cargaPosReforma.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {estado.vantagens.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            Vantagens
                          </h5>
                          <ul className="space-y-1">
                            {estado.vantagens.map((v, i) => (
                              <li key={i} className="text-xs flex items-start gap-2">
                                <span className="text-green-600">•</span>
                                <span>{v}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {estado.desvantagens.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-red-700 dark:text-red-400">
                            <XCircle className="w-4 h-4" />
                            Desvantagens
                          </h5>
                          <ul className="space-y-1">
                            {estado.desvantagens.map((d, i) => (
                              <li key={i} className="text-xs flex items-start gap-2">
                                <span className="text-red-600">•</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo Internacional</CardTitle>
              <CardDescription>
                Análise de países com potencial para internacionalização de negócios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paisesComparativos.map((pais, index) => (
                  <div 
                    key={pais.pais}
                    className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{pais.pais}</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">IVA: {pais.ivaRate}%</Badge>
                          <Badge variant="outline">Ranking Negócios: {pais.facilidadeNegocios}º</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Carga Tributária Total</div>
                        <div className="text-2xl font-bold text-primary">{pais.cargaTributaria}%</div>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/30 rounded mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Custo Operacional</div>
                      <div className="font-semibold">{pais.custoOperacional}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Vantagens
                        </h5>
                        <ul className="space-y-1">
                          {pais.vantagens.map((v, i) => (
                            <li key={i} className="text-xs flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              <span>{v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-red-700 dark:text-red-400">
                          <XCircle className="w-4 h-4" />
                          Desvantagens
                        </h5>
                        <ul className="space-y-1">
                          {pais.desvantagens.map((d, i) => (
                            <li key={i} className="text-xs flex items-start gap-2">
                              <span className="text-red-600">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {resultado && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="text-sm">
                          <strong>Comparativo com seu negócio:</strong>
                          {pais.cargaTributaria < resultado.posReforma.cargaEfetiva ? (
                            <p className="text-green-700 dark:text-green-400 mt-1">
                              Economia potencial de {(resultado.posReforma.cargaEfetiva - pais.cargaTributaria).toFixed(1)}% 
                              em relação à reforma brasileira ({formatarMoeda((resultado.posReforma.cargaEfetiva - pais.cargaTributaria) * dados.faturamentoMensal / 100)}/mês)
                            </p>
                          ) : (
                            <p className="text-red-700 dark:text-red-400 mt-1">
                              Carga {(pais.cargaTributaria - resultado.posReforma.cargaEfetiva).toFixed(1)}% maior 
                              que a reforma brasileira
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Importante: Internacionalização</h4>
                  <p className="text-sm text-muted-foreground">
                    A decisão de internacionalizar envolve diversos fatores além da carga tributária: 
                    mercado-alvo, logística, câmbio, regulação, visto, entre outros. 
                    Esta análise é apenas um dos aspectos. Consulte especialistas em comércio exterior 
                    e advogados internacionais antes de tomar qualquer decisão.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
