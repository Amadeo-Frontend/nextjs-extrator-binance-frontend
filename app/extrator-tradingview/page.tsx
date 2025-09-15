// frontend/app/extrator-tradingview/page.tsx

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Lista de intervalos comuns para o TradingView
const TV_INTERVALS = ["M1", "M3", "M5", "M15", "M30", "H1", "H2", "H4", "D", "W", "M"];

export default function ExtratorTradingViewPage() {
  const [symbols, setSymbols] = useState('EURUSD, USDBRL');
  const [exchange, setExchange] = useState('FX_IDC');
  const [interval, setInterval] = useState('M1');
  const [startDate, setStartDate] = useState('2024-01-01 00:00');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 16).replace('T', ' '));
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase()).filter(s => s);

    if (symbolList.length === 0 || !exchange || !interval || !startDate || !endDate) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos corretamente.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tradingview/download-data/`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbols: symbolList,
          exchange,
          interval,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao buscar os dados do TradingView.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'dados_tradingview.zip';
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
        description: "Seu arquivo ZIP com os dados do TradingView está sendo baixado.",
      });

    } catch (err) {
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
          <CardTitle className="text-2xl">Extrator de Dados do TradingView</CardTitle>
          <CardDescription>Baixe dados de candles (OHLCV) para pares de moedas e outros ativos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symbols">Símbolos (separados por vírgula)</Label>
            <Input id="symbols" value={symbols} onChange={(e) => setSymbols(e.target.value)} placeholder="Ex: EURUSD, USDBRL, GBPJPY" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exchange">Corretora (Exchange)</Label>
              <Input id="exchange" value={exchange} onChange={(e) => setExchange(e.target.value)} placeholder="Ex: FX_IDC, OANDA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Timeframe</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {TV_INTERVALS.map(iv => <SelectItem key={iv} value={iv}>{iv}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data e Hora de Início</Label>
              <Input id="start-date" type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="YYYY-MM-DD HH:MM" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data e Hora de Fim</Label>
              <Input id="end-date" type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="YYYY-MM-DD HH:MM" />
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
