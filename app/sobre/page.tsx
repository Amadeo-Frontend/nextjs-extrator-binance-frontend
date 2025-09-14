// frontend/app/sobre/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="bg-background min-h-screen flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Sobre a Técnica de Gatilho</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-zinc dark:prose-invert max-w-none text-lg">
            <p>
              Esta ferramenta foi projetada para realizar o backtest de uma estratégia específica de Opções Binárias baseada em &quot;velas de gatilho&quot; em um gráfico de 1 minuto. O objetivo é analisar estatisticamente a eficácia da estratégia ao longo de um período histórico.
            </p>
            
            <h3 className="text-2xl font-semibold mt-6">1. As Velas de Gatilho</h3>
            <p>
              A análise começa identificando velas em minutos específicos dentro de cada hora. Estas são as &quot;velas de gatilho&quot;:
            </p>
            <ul>
              <li>XX:04, XX:09, XX:14, XX:19, XX:24, XX:29</li>
              <li>XX:34, XX:39, XX:44, XX:49, XX:54, XX:59</li>
            </ul>
            <p>
              A cor (resultado) de cada uma dessas velas determina a sequência de operações a ser simulada nos minutos seguintes.
            </p>

            <h3 className="text-2xl font-semibold mt-6">2. A Sequência de Operações</h3>
            <p>
              Com base na cor da vela de gatilho, a ferramenta simula a seguinte sequência de operações (com até 3 martingales):
            </p>
            <ul>
              <li>Se a vela de gatilho foi <strong>CALL (Alta)</strong>, a sequência esperada é: <strong>PUT → PUT → CALL → CALL</strong>.</li>
              <li>Se a vela de gatilho foi <strong>PUT (Baixa)</strong>, a sequência esperada é: <strong>CALL → CALL → PUT → PUT</strong>.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-6">3. Como Interpretar os Resultados</h3>
            <p>
              O relatório gerado mostrará um dos seguintes resultados para cada gatilho encontrado:
            </p>
            <ul>
              <li><strong>WIN:</strong> A primeira operação da sequência (no minuto seguinte ao gatilho) foi um sucesso.</li>
              <li><strong>WIN GALE 1:</strong> A primeira falhou, mas a segunda (primeiro martingale) foi um sucesso.</li>
              <li><strong>WIN GALE 2:</strong> As duas primeiras falharam, mas a terceira (segundo martingale) foi um sucesso.</li>
              <li><strong>WIN GALE 3:</strong> As três primeiras falharam, mas a quarta (terceiro martingale) foi um sucesso.</li>
              <li><strong>LOSS:</strong> Todas as quatro operações da sequência falharam.</li>
            </ul>
            <p>
              Analisar a distribuição desses resultados (especialmente a porcentagem de LOSS) ajuda a avaliar o risco e a viabilidade da estratégia para o ativo e período selecionados.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
