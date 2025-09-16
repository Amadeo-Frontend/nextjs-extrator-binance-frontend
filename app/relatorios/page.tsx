// frontend/app/relatorios/page.tsx (VERSÃO FINAL COM CORREÇÃO DE DATA)

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, RefreshCw, FileText, BrainCircuit, Globe, CandlestickChart } from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Interface para o objeto de relatório decodificado
interface DecodedReport {
  filename: string;
  source: 'Binance' | 'Polygon.io' | 'Alpha Vantage' | 'Desconhecida';
  type: 'Extração' | 'Análise 4e9' | 'Desconhecido';
  date: Date;
}

// ### FUNÇÃO CORRIGIDA AQUI ###
const decodeFilename = (filename: string): DecodedReport => {
  const parts = filename.split('_');
  let source: DecodedReport['source'] = 'Desconhecida';
  let type: DecodedReport['type'] = 'Desconhecido';
  
  // Decodifica tipo e fonte
  if (parts[0] === 'extrator') {
    type = 'Extração';
    source = parts[1] === 'binance' ? 'Binance' : parts[1] === 'polygon' ? 'Polygon.io' : 'Alpha Vantage';
  } else if (parts[0] === 'analise' && parts[1] === '4e9') {
    type = 'Análise 4e9';
    source = parts[2] === 'binance' ? 'Binance' : parts[2] === 'polygon' ? 'Polygon.io' : 'Alpha Vantage';
  }

  // Decodifica a data - Lógica ajustada para lidar com o '_'
  try {
    const datePart = parts[parts.length - 2]; // Pega a penúltima parte (YYYYMMDD)
    const timePart = parts[parts.length - 1].split('.')[0]; // Pega a última parte e remove a extensão .zip (HHMMSS)

    const year = parseInt(datePart.substring(0, 4), 10);
    const month = parseInt(datePart.substring(4, 6), 10) - 1; // Mês em JS é 0-11
    const day = parseInt(datePart.substring(6, 8), 10);
    const hour = parseInt(timePart.substring(0, 2), 10);
    const minute = parseInt(timePart.substring(2, 4), 10);
    const second = parseInt(timePart.substring(4, 6), 10);
    
    const date = new Date(year, month, day, hour, minute, second);

    // Se a data for inválida, retorna a data atual como fallback
    if (isNaN(date.getTime())) {
      return { filename, source, type, date: new Date() };
    }

    return { filename, source, type, date };

  } catch (e) {
    // Em caso de qualquer erro no parsing, retorna a data atual
    console.error("Erro ao decodificar nome do arquivo:", filename, e);
    return { filename, source, type, date: new Date() };
  }
};

// Componente para o ícone da fonte (sem alterações)
const SourceIcon = ({ source }: { source: DecodedReport['source'] }) => {
  if (source === 'Binance') return <CandlestickChart className="h-5 w-5 text-yellow-500" />;
  if (source === 'Polygon.io') return <Globe className="h-5 w-5 text-blue-500" />;
  if (source === 'Alpha Vantage') return <Globe className="h-5 w-5 text-green-500" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

export default function RelatoriosPage() {
  const [reports, setReports] = useState<DecodedReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async (isPolling = false) => {
    if (!isPolling) setIsLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports/`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Falha ao buscar a lista de relatórios.");
      
      const data: string[] = await response.json();
      
      if (data.length !== reports.length) {
        const decoded = data.map(decodeFilename).sort((a, b) => b.date.getTime() - a.date.getTime());
        setReports(decoded);
        
        if (isPolling && data.length > reports.length) {
          toast.success("Novo relatório encontrado!", {
            description: "A lista de relatórios foi atualizada.",
          });
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error("Erro ao carregar relatórios", { description: err.message });
    } finally {
      if (!isPolling) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const intervalId = setInterval(() => fetchReports(true), 10000);
    return () => clearInterval(intervalId);
  }, [reports.length]);

  const handleDownload = (filename: string) => {
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports/${filename}`;
    window.open(downloadUrl, '_blank');
    toast.success("Download iniciado!", { description: `O arquivo ${filename} está sendo baixado.` });
  };

  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Central de Relatórios</CardTitle>
              <CardDescription>Acesse e baixe os relatórios gerados. A lista atualiza automaticamente.</CardDescription>
            </div>
            <Button onClick={() => fetchReports()} disabled={isLoading} size="icon" variant="outline">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border">
            {reports.length > 0 ? (
              <ul className="p-2">
                {reports.map((report) => (
                  <li key={report.filename} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-4">
                      <SourceIcon source={report.source} />
                      <div>
                        <p className="text-sm font-medium leading-none">{report.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.date.toLocaleDateString('pt-BR')} às {report.date.toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{report.source}</Badge>
                      <Button onClick={() => handleDownload(report.filename)} size="sm" variant="ghost">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                <BrainCircuit className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-700" />
                <p>{isLoading ? "Carregando relatórios..." : "Nenhum relatório gerado ainda."}</p>
                <p className="text-xs mt-1">Gere um relatório em outra página e atualize aqui.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <Button variant="link" asChild className="mt-4">
        <Link href="/">Voltar para a página inicial</Link>
      </Button>
    </main>
  );
}
