import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Main } from '@/components/layout/Main'
import { useFlow } from '@/hooks/useFlow'

export function App() {
  const flow = useFlow()

  return (
    <div className="bg-glow flex min-h-screen flex-col">
      <Header currentStep={flow.step} hasVariations={flow.variations.length > 0} />
      <Main {...flow} />
      <Footer />
      <Toaster />
    </div>
  )
}
