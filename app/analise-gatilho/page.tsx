// frontend/app/analise-gatilho/page.tsx (CÓDIGO COMPLETO E CORRIGIDO COM SONNER)

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner"; // A importação correta para as notificações

// Importando os componentes da shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker"; // Nosso componente de data customizado

export default function AnaliseGatilhoPage() {
  // Estados para controlar os inputs do formulário
  const [asset, setAsset] = useState('BTCUSDT');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  // A linha 'const { toast } = useToast()' foi removida, pois não é necessária com o 'sonner'.

  const handleAnalyse = async () => {
    // 1. Validação dos inputs usando 'sonner'
    if (!startDate || !endDate) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, selecione a data de início e a data de fim.",
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
      // 2. Chamada para o novo endpoint da API
      // Lembre-se de usar a URL correta do seu back-end no Render
      const apiUrl = 'https://py-extrator-binance-backend.onrender.com/analise-tecnica-gatilho/';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: [asset],
          intervals: ['1m'], // A técnica é fixa em M1
          start_date: startDate.toISOString( ).split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        }),
      });

      // 3. Tratamento da resposta da API
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao realizar a análise.');
      }

      // 4. Lógica para forçar o download do arquivo .zip
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

    } catch (err) {
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
          <CardTitle className="text-2xl">Análise de Técnica de Gatilho</CardTitle>
          <CardDescription>Teste a estratégia de gatilhos em minutos-chave com entrada após um LOSS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="asset">Ativo</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Selecione um ativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                <SelectItem value="EURUSD">EUR/USD</SelectItem>
                <SelectItem value="AUDCAD">AUD/CAD</SelectItem>
                <SelectItem value="GBPJPY">GBP/JPY</SelectItem>
                <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
              </SelectContent>
            </Select>
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
