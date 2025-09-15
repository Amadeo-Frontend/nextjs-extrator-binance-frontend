// frontend/app/analise-gatilho-tradingview/page.tsx

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

export default function AnaliseGatilhoTradingViewPage() {
  const [symbol, setSymbol] = useState('EURUSD');
  const [exchange, setExchange] = useState('FX_IDC');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!symbol || !exchange || !startDate || !endDate) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tradingview/analise-tecnica-gatilho/`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          exchange,
          interval: 'M1', // A técnica é fixa em M1
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
      a.download = `tv_analise_gatilho_${symbol}_${startDate}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Análise Concluída!", {
        description: "O download do seu relatório foi iniciado.",
      });

    } catch (err) {
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
          <CardTitle className="text-2xl">Análise 4 e 9 (TradingView)</CardTitle>
          <CardDescription>Teste a estratégia de gatilho com dados de Forex do TradingView.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Símbolo</Label>
              <Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Ex: EURUSD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange">Corretora (Exchange)</Label>
              <Input id="exchange" value={exchange} onChange={(e) => setExchange(e.target.value)} placeholder="Ex: FX_IDC" />
            </div>
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
