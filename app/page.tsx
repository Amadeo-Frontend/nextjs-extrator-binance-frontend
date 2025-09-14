// frontend/app/page.tsx
'use client';

import { useState } from 'react';
// Ícones que vamos manter
import { Download, AlertTriangle } from 'lucide-react';
// Novo spinner!
import ClipLoader from "react-spinners/ClipLoader";

export default function HomePage() {
  const [assets, setAssets] = useState('BTCUSDT, ETHUSDT');
  const [intervals, setIntervals] = useState('1h, 4h, 1d');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    // ... (toda a lógica de download permanece exatamente a mesma)
    setIsLoading(true);
    setError(null);

    const assetList = assets.split(',').map(a => a.trim()).filter(a => a);
    const intervalList = intervals.split(',').map(i => i.trim()).filter(i => i);

    if (assetList.length === 0 || intervalList.length === 0 || !startDate || !endDate) {
      setError('Por favor, preencha todos os campos corretamente.');
      setIsLoading(false);
      return;
    }

    try {
      // ATENÇÃO: Vamos precisar mudar esta URL no passo de deploy!
      const apiUrl = 'http://127.0.0.1:8000/download-data/';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: assetList,
          intervals: intervalList,
          start_date: startDate,
          end_date: endDate,
        } ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro ao buscar os dados.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'dados_binance.zip';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) filename = filenameMatch[1];
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
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
        
        {/* Formulário (sem alterações) */}
        <div className="space-y-4">
          {/* ... */}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <span>{error}</span>
          </div>
        )}

        {/* Botão de Download ATUALIZADO */}
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isLoading ? (
            <>
              <ClipLoader color={"#ffffff"} loading={isLoading} size={20} className="mr-3" />
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
