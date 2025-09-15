'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, CandlestickChart, FileSearch } from 'lucide-react'; // Adicionei um novo ícone

// Importa o componente do seletor de tema
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      
      {/* Botão de troca de tema posicionado no canto superior direito */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ThemeToggle />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          Analisador de Dados de Mercado
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ferramentas para backtesting, extração de dados históricos e análise técnica. Escolha uma ferramenta para começar.
        </p>
      </div>

      {/* Grid principal de cards - AGORA COM 3 CARDS FUNCIONAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        
        {/* Card 1: Extrator de Dados da Binance (Funcional) */}
        <Link href="/extrator-geral" className="group">
          <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <CandlestickChart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Extrator de Dados (Binance)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Baixe dados históricos de criptoativos em múltiplos timeframes e períodos personalizados.
              </CardDescription>
              <div className="flex items-center mt-6 font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Acessar Ferramenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Análise da Técnica 4 e 9 (Funcional) */}
        <Link href="/analise-gatilho" className="group">
          <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <CandlestickChart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Análise Técnica 4 e 9 (Binance)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Faça o backtest da estratégia 4 e 9 para avaliar a eficácia da técnica em diferentes ativos.
              </CardDescription>
              <div className="flex items-center mt-6 font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Acessar Ferramenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Resumo de Análise do TradingView (Funcional) */}
        {/* Você precisará criar esta página, vou te ajudar em seguida */}
        <Link href="/resumo-tradingview" className="group">
          <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <FileSearch className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Resumo de Análise (Forex)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtenha o resumo de análise técnica do TradingView (Compra/Venda) para pares de Forex.
              </CardDescription>
              <div className="flex items-center mt-6 font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Acessar Ferramenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

      </div>
    </main>
  );
}
