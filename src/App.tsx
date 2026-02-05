import {
  Check,
  X,
  RefreshCw,
  Download,
  Copy,
  Settings,
  Loader2,
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">AdVariant</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Componentes shadcn/ui + Tailwind CSS + Lucide Icons
          </p>
        </header>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Buttons
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Variantes de Botão</CardTitle>
              <CardDescription>
                Todas as variantes disponíveis no shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>
                <Check className="mr-2 h-4 w-4" />
                Default
              </Button>
              <Button variant="secondary">
                <Settings className="mr-2 h-4 w-4" />
                Secondary
              </Button>
              <Button variant="destructive">
                <X className="mr-2 h-4 w-4" />
                Destructive
              </Button>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Outline
              </Button>
              <Button variant="ghost">
                <Copy className="mr-2 h-4 w-4" />
                Ghost
              </Button>
              <Button variant="link">Link</Button>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cards (Variações de Copy)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card Aprovado */}
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-600">Aprovado</Badge>
                  <Badge variant="outline">Escassez</Badge>
                </div>
                <CardTitle className="text-lg mt-2">
                  Só até domingo: 50% OFF
                </CardTitle>
                <CardDescription>28/30 caracteres</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Garanta seu desconto exclusivo antes que acabe. Últimas
                  unidades disponíveis para você.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  87/90 caracteres
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerar
                </Button>
              </CardFooter>
            </Card>

            {/* Card Pendente */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Pendente</Badge>
                  <Badge variant="outline">Prova Social</Badge>
                </div>
                <CardTitle className="text-lg mt-2">
                  +10.000 clientes confiam
                </CardTitle>
                <CardDescription>25/30 caracteres</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Junte-se a milhares de profissionais que já transformaram seus
                  resultados com nossa solução.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  89/90 caracteres
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm" className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
                <Button size="sm" variant="destructive" className="flex-1">
                  <X className="mr-2 h-4 w-4" />
                  Reprovar
                </Button>
              </CardFooter>
            </Card>

            {/* Card Reprovado */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="destructive">Reprovado</Badge>
                  <Badge variant="outline">Pergunta</Badge>
                </div>
                <CardTitle className="text-lg mt-2">
                  Ainda pagando caro?
                </CardTitle>
                <CardDescription>20/30 caracteres</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Descubra como economizar até 60% nos seus custos mensais.
                  Compare agora mesmo.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  82/90 caracteres
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Form Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Formulário de Briefing
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Novo Briefing</CardTitle>
              <CardDescription>
                Preencha as informações do seu produto para gerar variações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="product">Produto/Serviço</Label>
                  <Input
                    id="product"
                    placeholder="Ex: Curso de Marketing Digital"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience">Público-alvo</Label>
                  <Input
                    id="audience"
                    placeholder="Ex: Empreendedores, 25-45 anos"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="differentials">Diferenciais</Label>
                <Textarea
                  id="differentials"
                  placeholder="O que torna seu produto único?"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Palavras obrigatórias</Label>
                  <Input
                    id="keywords"
                    placeholder="Ex: grátis, exclusivo, limitado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forbidden">Palavras proibidas</Label>
                  <Input
                    id="forbidden"
                    placeholder="Ex: barato, concorrente"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Limpar</Button>
              <Button>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Variações
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <Card>
            <CardContent className="pt-6 flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge className="bg-green-600">Aprovado</Badge>
              <Badge className="bg-yellow-600">Pendente</Badge>
              <Badge className="bg-blue-600">Google Ads</Badge>
              <Badge className="bg-purple-600">Meta Ads</Badge>
              <Badge className="bg-sky-600">LinkedIn</Badge>
            </CardContent>
          </Card>
        </section>

        {/* Alert/Error Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Estados de Erro</h2>
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">
                  Erro na Geração
                </CardTitle>
              </div>
              <CardDescription>
                Não foi possível conectar com a API. Verifique sua conexão.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>
            AdVariant — Tailwind CSS + shadcn/ui + Lucide Icons + React 19
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
