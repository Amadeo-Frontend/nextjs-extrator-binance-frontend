'use client';

import { useState } from 'react';

type Summary = {
  symbol: string;
  exchange: string;
  time: string;
  summary: { RECOMMENDATION: string; BUY?: number; SELL?: number; NEUTRAL?: number };
  oscillators: any;
  moving_averages: any;
  indicators: Record<string, number>;
};

export default function TradingViewCard() {
  const [query, setQuery] = useState('EURUSD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Summary | null>(null);
  const [matches, setMatches] = useState<string[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  async function search() {
    setError(null);
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/tradingview/forex/search?q=${encodeURIComponent(query)}`);
      const j = await r.json();
      setMatches(j.matches || []);
    } catch (e:any) {
      setError('Falha ao buscar pares');
    } finally {
      setLoading(false);
    }
  }

  async function getSummary(symbol: string) {
    setError(null);
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/tradingview/forex/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      if (!r.ok) throw new Error(await r.text());
      const j = await r.json();
      setData(j);
    } catch (e:any) {
      setError('Não foi possível obter o sumário do TradingView. Verifique o backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border p-4 shadow-sm mt-6">
      <h3 className="text-xl font-semibold">TradingView (Forex) — Busca & Sumário</h3>
      <p className="text-sm text-gray-500">Pesquise um par (ex.: EURUSD, USDBRL) e veja o resumo técnico do TradingView.</p>
      <div className="mt-3 flex gap-2">
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="EURUSD"
          className="border rounded-lg px-3 py-2 w-48"
        />
        <button
          onClick={search}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-black text-white disabled:opacity-60"
        >
          {loading ? 'Buscando...' : 'Buscar pares'}
        </button>
      </div>

      {matches.length > 0 && (
        <div className="mt-3">
          <p className="text-sm mb-2">Resultados:</p>
          <div className="flex flex-wrap gap-2">
            {matches.map((m) => (
              <button
                key={m}
                onClick={()=>getSummary(m)}
                className="px-2 py-1 text-sm border rounded-md hover:bg-gray-50"
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}

      {data && (
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-medium">{data.symbol} · {data.exchange}</div>
              <div className="text-xs text-gray-500">Atualizado: {new Date(data.time).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Recomendação</div>
              <div className="text-2xl font-bold">{data.summary?.RECOMMENDATION || '-'}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="rounded-lg border p-3">
              <div className="font-semibold mb-2">Oscillators</div>
              <pre className="text-xs overflow-auto">{JSON.stringify(data.oscillators?.COMPUTE, null, 2)}</pre>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-semibold mb-2">Médias Móveis</div>
              <pre className="text-xs overflow-auto">{JSON.stringify(data.moving_averages?.COMPUTE, null, 2)}</pre>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-semibold mb-2">Indicadores</div>
              <pre className="text-xs overflow-auto">{JSON.stringify(data.indicators, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
