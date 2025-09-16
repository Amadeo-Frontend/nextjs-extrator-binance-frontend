// frontend/app/page.tsx (VERSÃO FINAL COM O CARD DE RELATÓRIOS)

"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  CandlestickChart,
  BrainCircuit,
  Globe,
  Zap,
  Construction,
  FileText, // 1. Importe o novo ícone
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  // Componente reutilizável para o link "Acessar Ferramenta"
  const AccessLink = () => (
    <div className="flex items-center mt-4 font-semibold text-primary">
      Acessar Ferramenta
      <ArrowRight className="ml-2 h-4 w-4 animate-pulse-arrow" />
    </div>
  );

  // Componente para a tag da fonte de dados
  const SourceBadge = ({ source }: { source: string }) => (
    <div className="absolute top-2 right-2 bg-secondary/80 text-secondary-foreground/80 text-xs font-semibold px-2 py-1 rounded-full mb-1">
      {source}
    </div>
  );

  // Componente para o card "Em Breve"
  const ComingSoonCard = () => (
    <Card className="h-full flex flex-col justify-between border-dashed border-muted-foreground/50">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <Construction className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl text-muted-foreground">
            Em Breve
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground/80">
          Novas ferramentas e fontes de dados estão em desenvolvimento.
        </CardDescription>
        <div className="flex items-center mt-4 font-semibold text-muted-foreground/60">
          Aguarde...
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ThemeToggle />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          Analisador de Dados de Mercado
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ferramentas para backtesting, extração de dados e análise técnica para
          Cripto e Forex.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-screen-xl">
        
        {/* 2. CARD DA CENTRAL DE RELATÓRIOS ADICIONADO AQUI */}
        <Link href="/relatorios" className="group col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
          <Card className="relative h-full flex flex-col justify-between bg-primary/5 hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Central de Relatórios</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Acesse e baixe todos os relatórios e extrações de dados gerados em segundo plano.
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>

        {/* --- BINANCE (CRIPTO) --- */}
        <Link href="/extrator-geral" className="group">
          <Card className="relative h-full flex flex-col justify-between hover:border-primary transition-all duration-300 hover:shadow-lg pt-8">
            <SourceBadge source="Binance" />
            <CardHeader className="pt-0">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <CandlestickChart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Extrator (Cripto)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Baixe dados históricos de criptoativos.
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>
        <Link href="/analise-gatilho" className="group">
          <Card className="relative h-full flex flex-col justify-between hover:border-primary transition-all duration-300 hover:shadow-lg pt-8">
            <SourceBadge source="Binance" />
            <CardHeader className="pt-0">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <CandlestickChart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">
                  Análise 4 e 9 (Cripto)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Faça o backtest da estratégia 4 e 9.
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>

        {/* --- POLYGON.IO (FOREX - RECOMENDADO) --- */}
        <Link href="/extrator-forex-polygon" className="group">
          <Card className="relative h-full flex flex-col justify-between hover:border-primary transition-all duration-300 hover:shadow-lg pt-8">
            <SourceBadge source="Polygon.io" />
            <CardHeader className="pt-0">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Extrator (Forex)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Baixe dados históricos para pares de moedas.
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>
        <Link href="/analise-4e9-polygon" className="group">
          <Card className="relative h-full flex flex-col justify-between hover:border-primary transition-all duration-300 hover:shadow-lg pt-8">
            <SourceBadge source="Polygon.io" />
            <CardHeader className="pt-0">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Análise 4 e 9 (Forex)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Faça o backtest da estratégia 4 e 9.
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>

        {/* --- ALPHA VANTAGE (FOREX - DADOS DIÁRIOS) --- */}
        <Link href="/extrator-forex" className="group">
          <Card className="relative h-full flex flex-col justify-between hover:border-primary transition-all duration-300 hover:shadow-lg pt-8">
            <SourceBadge source="Alpha Vantage" />
            <CardHeader className="pt-0">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">
                  Extrator (Forex - Alpha)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Baixe dados diários para pares de moedas.
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>
        <Link href="/analise-4e9-forex" className="group">
          <Card className="relative h-full flex flex-col justify-between hover:border-primary transition-all duration-300 hover:shadow-lg pt-8">
            <SourceBadge source="Alpha Vantage" />
            <CardHeader className="pt-0">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">
                  Análise 4 e 9 (Forex - Alpha)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Estrutura para backtest (requer API premium).
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>

        {/* --- TRADINGVIEW (RESUMO) --- */}
        <Link href="/resumo-tradingview" className="group">
          <Card className="relative h-full flex flex-col justify-between hover:border-primary transition-all duration-300 hover:shadow-lg pt-8">
            <SourceBadge source="TradingView" />
            <CardHeader className="pt-0">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <BrainCircuit className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Resumo Técnico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtenha o resumo de análise técnica.
              </CardDescription>
              <AccessLink />
            </CardContent>
          </Card>
        </Link>

        {/* --- CARD "EM BREVE" --- */}
        <ComingSoonCard />
      </div>
    </main>
  );
}
