// frontend/app/page.tsx
'use client';

import { useState } from 'react';
import { Download, LoaderCircle, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  // Estados para controlar o formulário e o feedback ao usuário
  const [assets, setAssets] = useState('BTCUSDT, ETHUSDT');
  const [intervals, setIntervals] = useState('1h, 4h, 1d');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Hoje
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    // Validação simples dos inputs
    const assetList = assets.split(',').map(a => a.trim()).filter(a => a);
    const intervalList = intervals.split(',').map(i => i.trim()).filter(i => i);

    if (assetList.length === 0 || intervalList.length === 0 || !startDate || !endDate) {
      setError('Por favor, preencha todos os campos corretamente.');
      setIsLoading(false);
      return;
    }

    try {
      // URL do nosso back-end
      const apiUrl = 'http://127.0.0.1:8000/download-data/';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assets: assetList,
          intervals: intervalList,
          start_date: startDate,
          end_date: endDate,
        } ),
      });

      if (!response.ok) {
        // Se a API retornar um erro (ex: 404 Not Found), captura a mensagem
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao buscar os dados.');
      }

      // Converte a resposta em um "blob" (um objeto de arquivo)
      const blob = await response.blob();
      
      // Cria uma URL temporária para o blob
      const url = window.URL.createObjectURL(blob);
      
      // Cria um link invisível, clica nele para iniciar o download e depois o remove
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Pega o nome do arquivo do header da resposta ou define um padrão
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'dados_binance.zip';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Limpa a URL temporária e o elemento
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) { // <<< --- BLOCO CORRIGIDO ---
      // Verifica se 'err' é uma instância de Error para acessar 'message' com segurança
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Se o erro for de um tipo inesperado, exibe uma mensagem genérica
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      // Garante que o estado de 'loading' seja desativado, ocorrendo erro ou não
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Extrator de Dados Históricos</h1>
          <p className="text-gray-500 mt-2">Baixe dados de criptoativos da Binance em formato CSV.</p>
        </div>

        {/* Formulário */}
        <div className="space-y-4">
          <div>
            <label htmlFor="assets" className="block text-sm font-medium text-gray-700 mb-1">
              Ativos (separados por vírgula)
            </label>
            <input
              type="text"
              id="assets"
              value={assets}
              onChange={(e) => setAssets(e.target.value)}
              placeholder="Ex: BTCUSDT, ETHUSDT, SOLUSDT"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="intervals" className="block text-sm font-medium text-gray-700 mb-1">
              Timeframes (separados por vírgula)
            </label>
            <input
              type="text"
              id="intervals"
              value={intervals}
              onChange={(e) => setIntervals(e.target.value)}
              placeholder="Ex: 1m, 5m, 1h, 1d"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <span>{error}</span>
          </div>
        )}

        {/* Botão de Download */}
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin h-5 w-5 mr-3" />
              Buscando e Processando...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-3" />
              Gerar e Baixar Arquivos
            </>
          )}
        </button>
      </div>
    </main>
  );
}
