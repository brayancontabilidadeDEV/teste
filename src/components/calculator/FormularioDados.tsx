import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DadosEmpresa, CenarioIVA, EstadoBR, RegimeTributario, SetorAtividade, CategoriaIVA } from '@/types/tax.types';
import { formatarMoeda } from '@/utils/taxCalculations';
import { Save, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface Props {
  dados: DadosEmpresa;
  onDadosChange: (dados: DadosEmpresa) => void;
  cenario: CenarioIVA;
  onCenarioChange: (cenario: CenarioIVA) => void;
  onSalvar: (nome: string) => void;
}

export default function FormularioDados({ dados, onDadosChange, cenario, onCenarioChange, onSalvar }: Props) {
  const [nomeSimulacao, setNomeSimulacao] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleSalvar = () => {
    if (nomeSimulacao.trim()) {
      onSalvar(nomeSimulacao);
      setNomeSimulacao('');
      setDialogAberto(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Cenário IVA */}
      <Card>
        <CardHeader>
          <CardTitle>Cenário de Alíquota IVA</CardTitle>
          <CardDescription>Escolha o cenário de carga tributária para análise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onCenarioChange('otimista')}
              className={`p-4 rounded-lg border-2 transition-all ${
                cenario === 'otimista' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl font-bold text-green-600">25,0%</div>
              <div className="font-semibold mt-1">Otimista</div>
              <div className="text-xs text-muted-foreground mt-1">Melhor caso - Eficiência máxima</div>
            </button>
            <button
              onClick={() => onCenarioChange('base')}
              className={`p-4 rounded-lg border-2 transition-all ${
                cenario === 'base' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl font-bold text-blue-600">26,5%</div>
              <div className="font-semibold mt-1">Base (Referência)</div>
              <div className="text-xs text-muted-foreground mt-1">Estimativa FGV/CCiF</div>
            </button>
            <button
              onClick={() => onCenarioChange('pessimista')}
              className={`p-4 rounded-lg border-2 transition-all ${
                cenario === 'pessimista' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl font-bold text-red-600">28,0%</div>
              <div className="font-semibold mt-1">Pessimista</div>
              <div className="text-xs text-muted-foreground mt-1">Pior caso - Alta carga</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Dados Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
          <CardDescription>Dados gerais para cálculo tributário</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Faturamento */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Faturamento Mensal
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Receita bruta mensal antes de impostos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                type="number"
                value={dados.faturamentoMensal}
                onChange={(e) => onDadosChange({ ...dados, faturamentoMensal: Number(e.target.value) })}
                placeholder="100000"
              />
              <p className="text-xs text-muted-foreground">
                Anual: {formatarMoeda(dados.faturamentoMensal * 12)}
              </p>
            </div>

            {/* Regime Tributário */}
            <div className="space-y-2">
              <Label>Regime Tributário Atual</Label>
              <Select value={dados.regime} onValueChange={(v) => onDadosChange({ ...dados, regime: v as RegimeTributario })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                  <SelectItem value="presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="real">Lucro Real</SelectItem>
                  <SelectItem value="simplificado">Novo Regime Simplificado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Setor */}
            <div className="space-y-2">
              <Label>Setor de Atividade</Label>
              <Select value={dados.setor} onValueChange={(v) => onDadosChange({ ...dados, setor: v as SetorAtividade })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comercio">Comércio</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                  <SelectItem value="servicos">Serviços Gerais</SelectItem>
                  <SelectItem value="tecnologia">Serviços de Tecnologia</SelectItem>
                  <SelectItem value="engenharia">Serviços de Engenharia</SelectItem>
                  <SelectItem value="advocacia">Serviços de Advocacia</SelectItem>
                  <SelectItem value="energia">Energia Elétrica</SelectItem>
                  <SelectItem value="telecom">Telecomunicações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label>Estado de Operação</Label>
              <Select value={dados.estado} onValueChange={(v) => onDadosChange({ ...dados, estado: v as EstadoBR })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Folha de Pagamento */}
            <div className="space-y-2">
              <Label>Folha de Pagamento Mensal</Label>
              <Input
                type="number"
                value={dados.folhaPagamento}
                onChange={(e) => onDadosChange({ ...dados, folhaPagamento: Number(e.target.value) })}
                placeholder="30000"
              />
            </div>

            {/* Regime de Apuração */}
            <div className="space-y-2">
              <Label>Regime de Apuração</Label>
              <Select value={dados.regimeApuracao} onValueChange={(v) => onDadosChange({ ...dados, regimeApuracao: v as 'caixa' | 'competencia' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caixa">Regime de Caixa</SelectItem>
                  <SelectItem value="competencia">Regime de Competência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custos com Insumos */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span>Custos com Insumos: {dados.custosInsumos}%</span>
              <Badge variant="outline">{formatarMoeda(dados.faturamentoMensal * dados.custosInsumos / 100)}</Badge>
            </Label>
            <Slider
              value={[dados.custosInsumos]}
              onValueChange={(v) => onDadosChange({ ...dados, custosInsumos: v[0] })}
              max={90}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Percentual do faturamento gasto com insumos que geram crédito fiscal
            </p>
          </div>

          {/* Investimento em Ativo */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span>Investimento em Ativo Imobilizado: {dados.investimentoAtivo}%</span>
              <Badge variant="outline">{formatarMoeda(dados.faturamentoMensal * dados.investimentoAtivo / 100)}</Badge>
            </Label>
            <Slider
              value={[dados.investimentoAtivo]}
              onValueChange={(v) => onDadosChange({ ...dados, investimentoAtivo: v[0] })}
              max={30}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Crédito parcelado em 48 meses (1/48 aproveitado por mês)
            </p>
          </div>

          {/* Categoria IVA */}
          <div className="space-y-2">
            <Label>Categoria do Produto/Serviço</Label>
            <Select value={dados.categoriaIVA} onValueChange={(v) => onDadosChange({ ...dados, categoriaIVA: v as CategoriaIVA })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zero">Alíquota Zero (cesta básica)</SelectItem>
                <SelectItem value="reduzida60">Reduzida 60% (saúde, educação)</SelectItem>
                <SelectItem value="reduzida30">Reduzida 30% (alimentos selecionados)</SelectItem>
                <SelectItem value="padrao">Padrão (alíquota cheia)</SelectItem>
                <SelectItem value="seletivo">Imposto Seletivo (bebidas, cigarros)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ano de Simulação */}
          <div className="space-y-2">
            <Label>Ano para Simular</Label>
            <Select value={dados.anoSimulacao.toString()} onValueChange={(v) => onDadosChange({ ...dados, anoSimulacao: Number(v) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026 (Fase Teste - 0,1%)</SelectItem>
                <SelectItem value="2027">2027 (CBS inicia)</SelectItem>
                <SelectItem value="2029">2029 (IBS inicia)</SelectItem>
                <SelectItem value="2032">2032 (Transição 90%)</SelectItem>
                <SelectItem value="2033">2033 (Sistema Completo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Salvar Simulação
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Simulação</DialogTitle>
            <DialogDescription>Dê um nome para esta simulação e salve no histórico</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Simulação</Label>
              <Input
                placeholder="Ex: Cenário Otimista SP - Dezembro 2024"
                value={nomeSimulacao}
                onChange={(e) => setNomeSimulacao(e.target.value)}
              />
            </div>
            <Button onClick={handleSalvar} className="w-full">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
