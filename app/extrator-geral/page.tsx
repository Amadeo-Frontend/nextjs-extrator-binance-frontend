// frontend/app/extrator-geral/page.tsx (VERSÃO CORRIGIDA)

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

export default function ExtratorGeralPage() {
  const [assets, setAssets] = useState('BTCUSDT, ETHUSDT');
  const [intervals, setIntervals] = useState('1h, 4h');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    const assetList = assets.split(',').map(a => a.trim()).filter(a => a);
    const intervalList = intervals.split(',').map(i => i.trim()).filter(i => i);

    if (assetList.length === 0 || intervalList.length === 0 || !startDate || !endDate) {
      toast.error('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setIsLoading(true);

    try {
      // ### CORREÇÃO IMPORTANTE AQUI ###
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/binance/download-data/`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: assetList,
          intervals: intervalList,
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
      let filename = 'dados_binance.zip';
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
        description: "Seu arquivo ZIP com os dados está sendo baixado.",
      });

    } catch (err: unknown) { // CORREÇÃO DE TIPO
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
          <CardTitle className="text-2xl">Extrator de Dados Históricos (Binance)</CardTitle>
          <CardDescription>Baixe dados de criptoativos da Binance em formato CSV.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assets">Ativos (separados por vírgula)</Label>
            <Input id="assets" value={assets} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssets(e.target.value)} placeholder="Ex: BTCUSDT, ETHUSDT" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intervals">Timeframes (separados por vírgula)</Label>
            <Input id="intervals" value={intervals} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntervals(e.target.value)} placeholder="Ex: 1m, 5m, 1h" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data de Início</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data de Fim</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
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
