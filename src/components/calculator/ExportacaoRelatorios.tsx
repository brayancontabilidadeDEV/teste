import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DadosEmpresa, ResultadoComparativo, Recomendacao } from '@/types/tax.types';
import { formatarMoeda, formatarPercentual } from '@/utils/taxCalculations';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Props {
  dados: DadosEmpresa;
  resultado: ResultadoComparativo;
  recomendacoes: Recomendacao[];
}

export default function ExportacaoRelatorios({ dados, resultado, recomendacoes }: Props) {
  
  const exportarCSV = () => {
    try {
      const csv = [
        ['RELATÓRIO DE ANÁLISE TRIBUTÁRIA - REFORMA EC 132/2023'],
        ['Brayan Araujo Contador - CRC 1SPXXXXXX'],
        ['Data:', new Date().toLocaleDateString('pt-BR')],
        [],
        ['DADOS DA EMPRESA'],
        ['Faturamento Mensal', formatarMoeda(dados.faturamentoMensal)],
        ['Regime Tributário', dados.regime],
        ['Setor', dados.setor],
        ['Estado', dados.estado],
        ['Folha de Pagamento', formatarMoeda(dados.folhaPagamento)],
        ['Custos Insumos', `${dados.custosInsumos}%`],
        ['Investimento Ativo', `${dados.investimentoAtivo}%`],
        ['Ano Simulação', dados.anoSimulacao],
        [],
        ['SISTEMA ATUAL'],
        ['PIS', formatarMoeda(resultado.sistemaAtual.pis)],
        ['COFINS', formatarMoeda(resultado.sistemaAtual.cofins)],
        ['ICMS', formatarMoeda(resultado.sistemaAtual.icms)],
        ['ISS', formatarMoeda(resultado.sistemaAtual.iss)],
        ['IRPJ', formatarMoeda(resultado.sistemaAtual.irpj)],
        ['CSLL', formatarMoeda(resultado.sistemaAtual.csll)],
        ['CPP', formatarMoeda(resultado.sistemaAtual.cpp)],
        ['Total', formatarMoeda(resultado.sistemaAtual.total)],
        ['Carga Efetiva', formatarPercentual(resultado.sistemaAtual.cargaEfetiva)],
        [],
        ['PÓS-REFORMA'],
        ['CBS', formatarMoeda(resultado.posReforma.cbs)],
        ['IBS', formatarMoeda(resultado.posReforma.ibs)],
        ['IS', formatarMoeda(resultado.posReforma.is)],
        ['Crédito Insumos', formatarMoeda(resultado.posReforma.creditoInsumos)],
        ['Crédito Ativo', formatarMoeda(resultado.posReforma.creditoAtivo)],
        ['Tributo Líquido', formatarMoeda(resultado.posReforma.tributoLiquido)],
        ['Carga Efetiva', formatarPercentual(resultado.posReforma.cargaEfetiva)],
        [],
        ['COMPARATIVO'],
        ['Economia/Aumento Mensal', formatarMoeda(resultado.economia)],
        ['Economia/Aumento Anual', formatarMoeda(resultado.economiaAnual)],
        ['Variação Percentual', formatarPercentual(resultado.variacaoPercentual)],
        [],
        ['RECOMENDAÇÕES'],
        ...recomendacoes.map((r, i) => [
          `${i + 1}. ${r.titulo}`,
          r.prioridade.toUpperCase(),
          r.descricao,
          formatarMoeda(r.impactoEstimado)
        ])
      ];

      const csvContent = csv.map(row => row.join(';')).join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analise-tributaria-${Date.now()}.csv`;
      link.click();
      
      toast.success('CSV exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
      console.error(error);
    }
  };

  const exportarPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ANÁLISE TRIBUTÁRIA - REFORMA EC 132/2023', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Brayan Araujo Contador - CRC 1SPXXXXXX', pageWidth / 2, y, { align: 'center' });
      y += 6;
      doc.setFontSize(10);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Dados da Empresa
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS DA EMPRESA', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const dadosEmpresa = [
        `Faturamento Mensal: ${formatarMoeda(dados.faturamentoMensal)}`,
        `Regime: ${dados.regime} | Setor: ${dados.setor} | Estado: ${dados.estado}`,
        `Folha de Pagamento: ${formatarMoeda(dados.folhaPagamento)}`,
        `Custos Insumos: ${dados.custosInsumos}% | Investimento Ativo: ${dados.investimentoAtivo}%`
      ];
      dadosEmpresa.forEach(linha => {
        doc.text(linha, 20, y);
        y += 6;
      });
      y += 5;

      // Sistema Atual
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SISTEMA ATUAL', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de Tributos: ${formatarMoeda(resultado.sistemaAtual.total)}`, 20, y);
      y += 6;
      doc.text(`Carga Efetiva: ${formatarPercentual(resultado.sistemaAtual.cargaEfetiva)}`, 20, y);
      y += 10;

      // Pós-Reforma
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PÓS-REFORMA', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`CBS: ${formatarMoeda(resultado.posReforma.cbs)} | IBS: ${formatarMoeda(resultado.posReforma.ibs)}`, 20, y);
      y += 6;
      doc.text(`Créditos: ${formatarMoeda(resultado.posReforma.creditoInsumos + resultado.posReforma.creditoAtivo)}`, 20, y);
      y += 6;
      doc.text(`Tributo Líquido: ${formatarMoeda(resultado.posReforma.tributoLiquido)}`, 20, y);
      y += 6;
      doc.text(`Carga Efetiva: ${formatarPercentual(resultado.posReforma.cargaEfetiva)}`, 20, y);
      y += 10;

      // Comparativo
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPARATIVO', 20, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const economia = resultado.economia > 0 ? 'ECONOMIA' : resultado.economia < 0 ? 'AUMENTO' : 'NEUTRO';
      doc.text(`${economia}: ${formatarMoeda(Math.abs(resultado.economiaAnual))} por ano`, 20, y);
      y += 10;

      // Recomendações
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RECOMENDAÇÕES', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      recomendacoes.slice(0, 5).forEach((rec, i) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. ${rec.titulo}`, 20, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const descricao = doc.splitTextToSize(rec.descricao, pageWidth - 40);
        doc.text(descricao, 25, y);
        y += descricao.length * 5 + 3;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${pageCount} - Brayan Araujo Contador`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      doc.save(`analise-tributaria-${Date.now()}.pdf`);
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Relatórios</CardTitle>
        <CardDescription>Baixe a análise completa em diferentes formatos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={exportarCSV} variant="outline" className="h-auto flex-col gap-2 py-4">
            <FileSpreadsheet className="w-8 h-8" />
            <div>
              <div className="font-semibold">Exportar CSV</div>
              <div className="text-xs text-muted-foreground">Planilha para Excel/Sheets</div>
            </div>
          </Button>
          <Button onClick={exportarPDF} variant="outline" className="h-auto flex-col gap-2 py-4">
            <FileText className="w-8 h-8" />
            <div>
              <div className="font-semibold">Exportar PDF</div>
              <div className="text-xs text-muted-foreground">Relatório completo</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
