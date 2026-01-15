import { CurrencySwap } from './components/CurrencySwap';

function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 overflow-hidden selection:bg-purple-500/30 selection:text-white">
        {/* Vibrant Background Blobs - specifically designed to show off glassmorphism */}
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob" />
            <div className="absolute top-[-10%] right-[-20%] w-[70vw] h-[70vw] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000" />
        </div>
        
        {/* Noise overlay for texture */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent text-center tracking-tight drop-shadow-sm">
            Currency Swap
            </h1>
            <CurrencySwap />
        </div>
    </div>
  );
}

export default App;
