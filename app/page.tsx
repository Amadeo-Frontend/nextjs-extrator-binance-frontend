// frontend/app/page.tsx (CÓDIGO COMPLETO E FINAL)

'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart, Zap } from 'lucide-react';

// Importa o componente do seletor de tema que criamos
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
          Analisador de Dados Binance
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ferramentas poderosas para backtesting e extração de dados históricos. Escolha uma ferramenta para começar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Card 1: Extrator de Dados Genérico (sem legacyBehavior) */}
        <Link href="/extrator-geral" className="group">
          <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <BarChart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Extrator de Dados Genérico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Baixe dados históricos de qualquer ativo, em múltiplos timeframes e períodos personalizados. Ideal para análises abertas e estudos de mercado.
              </CardDescription>
              <div className="flex items-center mt-6 font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Acessar Ferramenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Análise da Técnica de Gatilho (sem legacyBehavior) */}
        <Link href="/analise-gatilho" className="group">
          <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Análise da Técnica de 4 e 9</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Faça o backtest da estratégia de gatilhos nos minutos-chave, com entrada condicionada a um resultado de LOSS anterior.
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
