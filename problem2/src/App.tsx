import { motion } from 'framer-motion';
import { SwapForm } from './components/SwapForm';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Token Swap
          </h1>
          <p className="text-white/60">Exchange tokens instantly</p>
        </div>

        <SwapForm />
      </motion.div>
    </div>
  );
}
