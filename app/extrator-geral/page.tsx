// frontend/app/extrator-geral/page.tsx (VERSÃO FINAL CORRIGIDA)

'use client';

import { useState, useEffect } from 'react'; // Importa useEffect
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
  // Inicia as datas como strings vazias
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define os valores iniciais das datas apenas no lado do cliente
  useEffect(() => {
    setStartDate('2024-01-01');
    setEndDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleDownload = async () => {
    // ... (lógica da função continua a mesma)
    const assetList = assets.split(',').map(a => a.trim()).filter(a => a);
    const intervalList = intervals.split(',').map(i => i.trim()).filter(i => i);
    if (assetList.length === 0 || intervalList.length === 0 || !startDate || !endDate) {
      toast.error('Por favor, preencha todos os campos corretamente.');
      return;
    }
    setIsLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/binance/download-data/`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: assetList, intervals: intervalList, start_date: startDate, end_date: endDate }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao iniciar a extração.');
      }
      toast.success("Extração Iniciada!", {
        description: `A extração para ${assetList.length} ativo(s) começou. Verifique a Central de Relatórios em breve.`,
        action: { label: "Ver Relatórios", onClick: () => window.location.href = '/relatorios' },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro ao Iniciar", { description: err.message });
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
          <CardTitle className="text-2xl">Extrator de Dados (Binance)</CardTitle>
          <CardDescription>Inicia a geração de um arquivo .zip com dados de criptoativos da Binance.</CardDescription>
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
              <><ClipLoader color={"hsl(var(--primary-foreground))"} size={20} className="mr-2" />Iniciando...</>
            ) : (
              <><Download className="mr-2 h-4 w-4" />Iniciar Geração de Arquivo</>
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
