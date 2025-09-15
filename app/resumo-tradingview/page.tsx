// frontend/app/resumo-tradingview/page.tsx (VERSÃO CORRIGIDA PARA ESLINT)

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";

// Componentes Shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';

// Tipagem para os dados da resposta da API
interface AnalysisSummary {
  RECOMMENDATION: string;
  BUY: number;
  SELL: number;
  NEUTRAL: number;
}

interface AnalysisResponse {
  symbol: string;
  exchange: string;
  summary: AnalysisSummary;
}

export default function ResumoTradingViewPage() {
  // Estados do formulário
  const [symbol, setSymbol] = useState('EURUSD');
  const [exchange, setExchange] = useState('FX_IDC');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para armazenar o resultado da análise
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleFetchSummary = async () => {
    if (!symbol) {
      toast.error("Símbolo obrigatório", {
        description: "Por favor, insira um símbolo para análise (ex: EURUSD).",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null); // Limpa a análise anterior

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tradingview/forex/summary`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol,
          exchange: exchange || 'FX_IDC', // Usa FX_IDC se o campo estiver vazio
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao buscar a análise.');
      }

      const result: AnalysisResponse = await response.json();
      setAnalysis(result);
      toast.success("Análise recebida!", {
        description: `Resumo para ${result.symbol} carregado com sucesso.`,
      });

    } catch (err: unknown) { // CORREÇÃO APLICADA AQUI
      if (err instanceof Error) {
        toast.error("Erro na Análise", { description: err.message });
      } else {
        toast.error("Erro Desconhecido", { description: "Ocorreu um problema inesperado." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para determinar a cor da recomendação
  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('BUY')) return 'text-green-500';
    if (recommendation.includes('SELL')) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Resumo de Análise Técnica (TradingView)</CardTitle>
          <CardDescription>Obtenha a recomendação de Compra/Venda baseada nos indicadores técnicos do TradingView para pares de Forex.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Símbolo (ex: EURUSD)</Label>
              {/* CORREÇÃO APLICADA AQUI */}
              <Input id="symbol" value={symbol} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbol(e.target.value.toUpperCase())} placeholder="EURUSD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange">Corretora (Opcional)</Label>
              {/* CORREÇÃO APLICADA AQUI */}
              <Input id="exchange" value={exchange} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExchange(e.target.value)} placeholder="FX_IDC" />
            </div>
          </div>

          <Button onClick={handleFetchSummary} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <ClipLoader color={"hsl(var(--primary-foreground))"} size={20} className="mr-2" />
                Buscando Análise...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Obter Resumo de Análise
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Card de Resultados */}
      {analysis && (
        <Card className="w-full max-w-2xl mt-6">
          <CardHeader>
            <CardTitle>Resultado para: {analysis.symbol} ({analysis.exchange})</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Recomendação Geral</p>
              <p className={`text-4xl font-bold ${getRecommendationColor(analysis.summary.RECOMMENDATION)}`}>
                {analysis.summary.RECOMMENDATION.replace('_', ' ')}
              </p>
            </div>
            <Separator />
            <div className="flex justify-around items-center pt-2">
              <div className="text-green-500">
                <p className="text-sm">Compra</p>
                <p className="text-2xl font-semibold">{analysis.summary.BUY}</p>
              </div>
              <div className="text-gray-500">
                <p className="text-sm">Neutro</p>
                <p className="text-2xl font-semibold">{analysis.summary.NEUTRAL}</p>
              </div>
              <div className="text-red-500">
                <p className="text-sm">Venda</p>
                <p className="text-2xl font-semibold">{analysis.summary.SELL}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button variant="link" asChild className="mt-4">
        <Link href="/">Voltar para a página inicial</Link>
      </Button>
    </main>
  );
}
