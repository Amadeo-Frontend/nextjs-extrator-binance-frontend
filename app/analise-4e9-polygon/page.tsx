// frontend/app/analise-4e9-forex/page.tsx (VERSÃO CORRETA)

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Analise4e9ForexPage() {
  const [asset, setAsset] = useState('EURUSD');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 7);
    setStartDate(yesterday.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const handleAnalyse = async () => {
    if (!asset || !startDate || !endDate) {
      toast.error("Campos obrigatórios", { description: "Por favor, selecione o ativo e as datas." });
      return;
    }
    if (startDate > endDate) {
      toast.error("Período inválido", { description: "A data de início não pode ser posterior à data de fim." });
      return;
    }

    setIsLoading(true);
    try {
      // Apontando para o endpoint da Polygon, que é o mais robusto
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/polygon/analise-tecnica-gatilho/`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: [asset], intervals: ['1m'], start_date: startDate, end_date: endDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao iniciar a análise.');
      }
      
      // Lógica correta de notificação
      toast.success("Análise Iniciada!", {
        description: `A análise para ${asset} começou. Verifique a Central de Relatórios em breve.`,
        action: { label: "Ver Relatórios", onClick: () => window.location.href = '/relatorios' },
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro ao Iniciar Análise", { description: err.message });
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
          <CardTitle className="text-2xl">Análise 4 e 9 (Forex - Polygon.io)</CardTitle>
          <CardDescription>Inicia o backtest da estratégia de gatilhos para pares de moedas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="asset">Par de Moedas (ex: EURUSD)</Label>
            <Input id="asset" value={asset} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAsset(e.target.value.toUpperCase())} />
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
          <Button onClick={handleAnalyse} disabled={isLoading} className="w-full">
            {isLoading ? (
              <><ClipLoader color={"hsl(var(--primary-foreground))"} size={20} className="mr-2" />Iniciando...</>
            ) : (
              <><Download className="mr-2 h-4 w-4" />Iniciar Análise</>
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
