// frontend/app/page.tsx (CÓDIGO COMPLETO COM O BOTÃO "SOBRE")

'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, CandlestickChart } from 'lucide-react';

// Importa o componente do seletor de tema
import { ThemeToggle } from '@/components/theme-toggle';
// Importa o componente Button para usar no link "Sobre"
import { Button } from '@/components/ui/button';

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
          Ferramentas poderosas para backtesting e extração de dados históricos de criptoativos. Escolha uma ferramenta para começar.
        </p>
        
        {/* ### BOTÃO ADICIONADO AQUI ### */}
        {/* Este é o link para a sua nova página /sobre */}
        <Button variant="link" asChild className="mt-2 text-base">
          <Link href="/sobre">Como funciona a técnica 4 e 9?</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Card 1: Extrator de Dados Genérico */}
        <Link href="/extrator-geral" className="group">
          <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <CandlestickChart className="h-6 w-6 text-secondary-foreground" />
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

        {/* Card 2: Análise da Técnica de Gatilho */}
        <Link href="/analise-gatilho" className="group">
          <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <CandlestickChart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Análise da Técnica 4 e 9</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Faça o backtest da estratégia 4 e 9 nos minutos-chave para todas as ocorrências.Ideal para avaliar a eficácia da técnica em diferentes ativos.
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
