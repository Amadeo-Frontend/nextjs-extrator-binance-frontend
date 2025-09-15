// No topo do arquivo
import dynamic from 'next/dynamic';
const TradingViewCard = dynamic(() => import('./components/TradingViewCard'), { ssr: false });

// ... dentro do componente da página, logo abaixo dos cards existentes:
<TradingViewCard />
