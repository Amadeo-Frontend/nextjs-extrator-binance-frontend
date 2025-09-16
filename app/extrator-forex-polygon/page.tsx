// frontend/app/extrator-forex-polygon/page.tsx (VERSÃO FINAL CORRIGIDA)

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const POLYGON_INTERVALS = ["1m", "5m", "15m", "30m", "1h", "D"];

export default function ExtratorForexPolygonPage() {
  const [symbols, setSymbols] = useState('EURUSD,GBPUSD');
  const [interval, setInterval] = useState('1h');
  // Inicia as datas como strings vazias
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define os valores iniciais das datas apenas no lado do cliente
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    setStartDate(yesterday.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const handleDownload = async () => {
    // ... (lógica da função continua a mesma)
    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase()).filter(s => s);
    if (symbolList.length === 0 || !interval || !startDate || !endDate) {
      toast.error("Campos obrigatórios", { description: "Por favor, preencha todos os campos." });
      return;
    }
    setIsLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/polygon/download-data/`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: symbolList, intervals: [interval], start_date: startDate, end_date: endDate }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao iniciar a extração.');
      }
      toast.success("Extração Iniciada!", {
        description: `A extração da Polygon.io começou. Verifique a Central de Relatórios em breve.`,
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
          <CardTitle className="text-2xl">Extrator de Dados (Polygon.io)</CardTitle>
          <CardDescription>Inicia a geração de um arquivo .zip com dados de Forex da Polygon.io.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symbols">Símbolos (separados por vírgula)</Label>
            <Input id="symbols" value={symbols} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbols(e.target.value)} placeholder="Ex: EURUSD,USDBRL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Timeframe</Label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger><SelectValue placeholder="Selecione o timeframe" /></SelectTrigger>
              <SelectContent>
                {POLYGON_INTERVALS.map(iv => <SelectItem key={iv} value={iv}>{iv}</SelectItem>)}
              </SelectContent>
            </Select>
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
