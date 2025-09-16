// frontend/app/extrator-forex/page.tsx (VERSÃO COM TIMEFRAME)

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

export default function ExtratorForexPage() {
  const [assets, setAssets] = useState('EURUSD,GBPUSD');
  // Novo estado para os timeframes
  const [intervals, setIntervals] = useState('1h, D');
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    const assetList = assets.split(',').map(a => a.trim().toUpperCase()).filter(a => a);
    // Processa a lista de intervalos
    const intervalList = intervals.split(',').map(i => i.trim()).filter(i => i);

    if (assetList.length === 0 || intervalList.length === 0 || !startDate || !endDate) {
      toast.error('Por favor, preencha todos os campos corretamente.');
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
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/alphavantage/download-data/`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: assetList,
          intervals: intervalList, // Envia a lista de intervalos
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao buscar os dados.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'dados_forex.zip';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch?.[1]) filename = filenameMatch[1];
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download iniciado!", {
        description: "Seu arquivo ZIP com os dados de Forex está sendo baixado.",
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro ao buscar dados", { description: err.message });
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
          <CardTitle className="text-2xl">Extrator de Dados de Forex (Alpha Vantage)</CardTitle>
          <CardDescription>Baixe dados históricos para pares de moedas. Use o formato de 6 letras (EURUSD). <span className="font-bold text-destructive block">Atenção: Dados intraday (1m, 5m, etc.) são limitados a poucos dias na API gratuita.</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assets">Pares de Moedas (separados por vírgula)</Label>
            <Input id="assets" value={assets} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssets(e.target.value)} placeholder="Ex: EURUSD,GBPUSD,USDJPY" />
          </div>
          
          {/* Novo campo para os timeframes */}
          <div className="space-y-2">
            <Label htmlFor="intervals">Timeframes (separados por vírgula)</Label>
            <Input id="intervals" value={intervals} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntervals(e.target.value)} placeholder="Ex: 5m, 1h, D" />
            <p className="text-xs text-muted-foreground">Suportados: 1m, 5m, 15m, 30m, 1h, D</p>
          </div>
          
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

          <Button onClick={handleDownload} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <ClipLoader color={"hsl(var(--primary-foreground))"} size={20} className="mr-2" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Gerar e Baixar Arquivos
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
