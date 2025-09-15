// frontend/app/analise-gatilho/page.tsx (VERSÃO CORRIGIDA)

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { AssetCombobox } from "@/components/ui/asset-combobox";

export default function AnaliseGatilhoPage() {
  const [asset, setAsset] = useState('BTCUSDT');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
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
      // ### CORREÇÃO IMPORTANTE AQUI ###
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/binance/analise-tecnica-gatilho/`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: [asset],
          intervals: ['1m'],
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
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
      a.download = `analise_gatilho_${asset}_${startDate.toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Análise Concluída!", {
        description: "O download do seu relatório foi iniciado.",
      });

    } catch (err: unknown) { // CORREÇÃO DE TIPO
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
          <CardTitle className="text-2xl">Análise de Técnica de 4 e 9 (Binance)</CardTitle>
          <CardDescription>Teste a estratégia de gatilhos em minutos-chave para todas as ocorrências.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="asset">Ativo</Label>
            <AssetCombobox value={asset} onChange={setAsset} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <DatePicker date={startDate} setDate={setStartDate} placeholder="Data de início" />
            </div>
            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <DatePicker date={endDate} setDate={setEndDate} placeholder="Data de fim" />
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
