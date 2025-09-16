// frontend/app/analise-4e9-polygon/page.tsx (VERSÃO COM INPUT DE DATA SIMPLES)

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Analise4e9PolygonPage() {
  const [asset, setAsset] = useState('EURUSD');
  // Estados de data como strings
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!asset || !startDate || !endDate) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, selecione o ativo e as datas de início e fim.",
      });
      return;
    }
    if (startDate > endDate) {
      toast.error("Período inválido", {
        description: "A data de início não pode ser posterior à data de fim.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/polygon/analise-tecnica-gatilho/`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: [asset],
          intervals: ['1m'],
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao realizar a análise.');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'analise_4e9_polygon.zip';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch?.[1]) filename = filenameMatch[1];
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Análise Concluída!", {
        description: "O download do seu relatório foi iniciado.",
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro na Análise", { description: err.message });
      } else {
        toast.error("Erro Desconhecido", { description: "Ocorreu um problema inesperado." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Análise Técnica 4 e 9 (Forex - Polygon.io)</CardTitle>
          <CardDescription>
            Faça o backtest da estratégia de gatilhos para pares de moedas usando dados da Polygon.io.
            <span className="font-bold text-destructive block mt-2">Atenção: O plano gratuito tem um limite de 5 chamadas por minuto.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="asset">Par de Moedas (ex: EURUSD)</Label>
            <Input id="asset" value={asset} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAsset(e.target.value.toUpperCase())} />
          </div>
          
          {/* --- INPUT DE DATA SIMPLES APLICADO AQUI --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data de Início</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data de Fim</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleAnalyse} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <ClipLoader color={"hsl(var(--primary-foreground))"} size={20} className="mr-2" />
                Analisando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Analisar e Baixar Resultados
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      <Button variant="link" asChild className="mt-4">
        <Link href="/">Voltar para a página inicial</Link>
      </Button>
    </main>
  );
}
