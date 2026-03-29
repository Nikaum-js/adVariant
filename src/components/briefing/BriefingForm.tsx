import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { briefingSchema, type BriefingFormData } from '@/schemas/briefing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/form-field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, Package, Users, Target, Sparkles, Tag, Ban, Wand2 } from 'lucide-react'

const FIELD_HELP = {
  product: {
    title: 'Produto ou serviço',
    description: 'Descreva o que você está anunciando. Quanto mais detalhes, melhor a IA entende.',
    examples: [
      'Curso de fotografia com 50 aulas e certificado',
      'App de delivery de comida fit',
      'Consultoria financeira para pequenas empresas',
    ],
  },
  targetAudience: {
    title: 'Público-alvo',
    description: 'Quem você quer atingir? Inclua idade, interesses e comportamento.',
    examples: [
      'Mulheres 25-45 anos que praticam exercícios',
      'Donos de pequenos negócios',
      'Universitários em busca de estágio',
    ],
  },
  objective: {
    title: 'Objetivo da campanha',
    description: 'O que você espera que o público faça ao ver o anúncio?',
    examples: [
      'Awareness — conhecer a marca',
      'Leads — deixar email ou contato',
      'Conversão — comprar o produto',
    ],
  },
  differentials: {
    title: 'Diferenciais',
    description: 'O que torna seu produto único? Liste os pontos fortes.',
    examples: ['Garantia de 90 dias', 'Entrega em 24h', 'Suporte via WhatsApp 24/7'],
  },
  requiredKeywords: {
    title: 'Palavras obrigatórias',
    description: 'Termos que devem aparecer nas copies. Separe por vírgula.',
    examples: ['grátis, exclusivo, limitado', 'premium, garantia, novo'],
  },
  forbiddenWords: {
    title: 'Palavras proibidas',
    description: 'Termos que não podem aparecer. Útil para evitar problemas com plataformas.',
    examples: ['barato, promoção', 'melhor do mercado, número 1'],
  },
}

interface BriefingFormProps {
  onSubmit: (data: BriefingFormData) => void
  initialData?: Partial<BriefingFormData>
}

const OBJECTIVES = [
  { value: 'awareness', label: 'Awareness (Reconhecimento de marca)' },
  { value: 'leads', label: 'Leads (Geração de contatos)' },
  { value: 'conversion', label: 'Conversão (Vendas diretas)' },
  { value: 'remarketing', label: 'Remarketing (Recuperação)' },
  { value: 'launch', label: 'Lançamento (Novo produto/serviço)' },
] as const

const MOCK_BRIEFINGS: BriefingFormData[] = [
  {
    product:
      'Curso online de Marketing Digital com mais de 100 aulas, certificado reconhecido e acesso vitalício. Inclui módulos sobre tráfego pago, SEO, redes sociais e email marketing.',
    targetAudience:
      'Empreendedores e profissionais de marketing entre 25-45 anos que desejam aumentar suas vendas online. Pessoas com renda média-alta que valorizam educação continuada.',
    objective: 'conversion',
    differentials:
      'Único curso com mentoria individual inclusa. Garantia de 30 dias. Comunidade exclusiva com +5.000 alunos ativos. Professor com 15 anos de experiência no mercado.',
    requiredKeywords: ['transforme', 'resultados', 'agora'],
    forbiddenWords: ['barato', 'grátis'],
  },
  {
    product:
      'App de meditação guiada com exercícios de 5 a 30 minutos. Inclui sons da natureza, técnicas de respiração e programa de 21 dias para iniciantes.',
    targetAudience:
      'Adultos de 30-50 anos com rotina estressante, executivos e profissionais de saúde. Pessoas que buscam equilíbrio entre vida pessoal e profissional.',
    objective: 'leads',
    differentials:
      'Meditações em português com sotaque brasileiro. Modo offline disponível. Integração com Apple Health e Google Fit. Mais de 500 meditações exclusivas.',
    requiredKeywords: ['paz', 'equilíbrio', 'bem-estar'],
    forbiddenWords: ['ansiedade', 'problema'],
  },
  {
    product:
      'Software de gestão financeira para pequenas empresas. Controle de fluxo de caixa, emissão de boletos, relatórios automáticos e integração bancária.',
    targetAudience:
      'Donos de pequenas empresas e MEIs com faturamento até R$500mil/ano. Pessoas que não têm contador dedicado e precisam de organização financeira.',
    objective: 'awareness',
    differentials:
      'Setup em 5 minutos sem necessidade de treinamento. Suporte via WhatsApp 24h. Plano gratuito para até 50 transações/mês. Dashboard intuitivo.',
    requiredKeywords: ['simples', 'controle', 'lucro'],
    forbiddenWords: ['complicado', 'burocracia'],
  },
  {
    product:
      'Proteína vegana em pó sabor chocolate com 25g de proteína por dose. Feita com ervilha e arroz, sem adoçantes artificiais e com certificação orgânica.',
    targetAudience:
      'Veganos e vegetarianos praticantes de musculação, crossfit ou esportes. Idade 20-40 anos, preocupados com saúde e sustentabilidade.',
    objective: 'launch',
    differentials:
      'Primeira proteína vegana brasileira com certificação orgânica. Embalagem 100% reciclável. Sabor desenvolvido por chef francês. Zero açúcar adicionado.',
    requiredKeywords: ['natural', 'performance', 'sabor'],
    forbiddenWords: ['química', 'artificial'],
  },
  {
    product:
      'Consultoria de carreira online com análise de currículo, simulação de entrevista e plano de desenvolvimento personalizado. Sessões de 1 hora via videochamada.',
    targetAudience:
      'Profissionais em transição de carreira ou buscando promoção. Idade 28-45 anos com formação superior que sentem estagnação profissional.',
    objective: 'remarketing',
    differentials:
      'Consultores com experiência em RH de grandes empresas. Garantia de recolocação em 90 dias ou dinheiro de volta. Acesso a banco de vagas exclusivo.',
    requiredKeywords: ['sucesso', 'carreira', 'oportunidade'],
    forbiddenWords: ['desemprego', 'crise'],
  },
  {
    product:
      'Plataforma de delivery de comida saudável com refeições prontas, congeladas e entregues semanalmente. Menu rotativo com opções low carb, veganas e fit.',
    targetAudience:
      'Pessoas de 25-50 anos com rotina corrida que querem comer bem sem tempo para cozinhar. Classe média-alta, moradores de grandes cidades.',
    objective: 'conversion',
    differentials:
      'Chef nutri assina o cardápio. Embalagens sustentáveis. Entrega em todo Brasil com gelo seco. Cancelamento sem multa.',
    requiredKeywords: ['saudável', 'praticidade', 'sabor'],
    forbiddenWords: ['dieta', 'restrição'],
  },
  {
    product:
      'Seguro pet com cobertura para consultas, cirurgias, internações e medicamentos. Planos a partir de R$49/mês com carência de apenas 3 dias.',
    targetAudience:
      'Tutores de cães e gatos de 25-55 anos que consideram o pet parte da família. Dispostos a investir na saúde do animal.',
    objective: 'leads',
    differentials:
      'Rede credenciada com +2.000 clínicas. Reembolso em 48h. App para agendar consultas. Sem análise de raça ou idade.',
    requiredKeywords: ['proteção', 'família', 'cuidado'],
    forbiddenWords: ['doença', 'morte'],
  },
  {
    product:
      'Curso de inglês 100% online com aulas ao vivo em turmas pequenas. Metodologia focada em conversação desde a primeira aula.',
    targetAudience:
      'Adultos de 20-45 anos que já tentaram aprender inglês e não conseguiram. Profissionais que precisam do idioma para crescer na carreira.',
    objective: 'awareness',
    differentials:
      'Professores nativos. Turmas de no máximo 6 alunos. Aulas gravadas disponíveis por 1 ano. Certificado internacional incluso.',
    requiredKeywords: ['fluência', 'confiança', 'falar'],
    forbiddenWords: ['difícil', 'gramática'],
  },
  {
    product:
      'Coworking premium com escritórios privativos, salas de reunião e espaço de eventos. Localizado no centro empresarial da cidade.',
    targetAudience:
      'Startups, freelancers e pequenas empresas que buscam endereço comercial e networking. Profissionais de 28-45 anos.',
    objective: 'leads',
    differentials:
      'Café gourmet ilimitado. Recepção bilíngue. Estacionamento incluso. Eventos de networking semanais com investidores.',
    requiredKeywords: ['produtividade', 'networking', 'profissional'],
    forbiddenWords: ['aluguel', 'contrato'],
  },
  {
    product:
      'Plataforma de investimentos automatizados com robô advisor. Carteiras personalizadas baseadas no perfil do investidor.',
    targetAudience:
      'Jovens de 25-40 anos com renda disponível para investir mas sem tempo ou conhecimento para gerir carteira ativa.',
    objective: 'conversion',
    differentials:
      'Taxa zero para valores até R$10.000. Rentabilidade média de 15% ao ano. App premiado. Suporte 24h com assessores certificados.',
    requiredKeywords: ['rentabilidade', 'segurança', 'futuro'],
    forbiddenWords: ['risco', 'perda'],
  },
  {
    product:
      'Assinatura de vinhos com curadoria de sommelier. 2 garrafas por mês de vinícolas boutique de todo o mundo.',
    targetAudience:
      'Apreciadores de vinho de 30-60 anos, classe média-alta, que buscam descobrir rótulos exclusivos e aprender sobre enologia.',
    objective: 'launch',
    differentials:
      'Vinhos que não estão em supermercados. Ficha de degustação detalhada. Acesso a masterclasses online. Desconto de 30% em compras avulsas.',
    requiredKeywords: ['exclusivo', 'descoberta', 'experiência'],
    forbiddenWords: ['álcool', 'bebida'],
  },
  {
    product:
      'Clínica de estética facial com tratamentos de harmonização, botox e skincare avançado. Equipamentos de última geração.',
    targetAudience:
      'Mulheres de 30-55 anos preocupadas com aparência e autoestima. Classe média-alta, moradoras de região metropolitana.',
    objective: 'remarketing',
    differentials:
      'Médicos com especialização nos EUA. Produtos importados. Avaliação gratuita por vídeo. Parcelamento em até 24x sem juros.',
    requiredKeywords: ['beleza', 'rejuvenescimento', 'natural'],
    forbiddenWords: ['cirurgia', 'invasivo'],
  },
  {
    product:
      'Aplicativo de organização financeira pessoal com controle de gastos, metas de economia e alertas inteligentes.',
    targetAudience:
      'Jovens adultos de 22-35 anos que querem organizar as finanças mas não sabem por onde começar. Primeiro emprego ou recém-formados.',
    objective: 'awareness',
    differentials:
      'Conecta com todos os bancos automaticamente. Categorização por IA. Versão premium com planejador de aposentadoria. Comunidade com +500 mil usuários.',
    requiredKeywords: ['controle', 'liberdade', 'objetivos'],
    forbiddenWords: ['dívida', 'pobre'],
  },
  {
    product:
      'Móveis planejados com design escandinavo e produção sob medida. Entrega e montagem em todo o estado.',
    targetAudience:
      'Casais de 28-45 anos que acabaram de comprar imóvel ou estão reformando. Valorizam design e qualidade sobre preço.',
    objective: 'conversion',
    differentials:
      'Projeto 3D gratuito. Madeira de reflorestamento certificada. Garantia de 10 anos. Pagamento só após a montagem.',
    requiredKeywords: ['design', 'qualidade', 'personalizado'],
    forbiddenWords: ['barato', 'MDF'],
  },
]

const parseCommaSeparated = (value: string): string[] => {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function BriefingForm({ onSubmit, initialData }: BriefingFormProps) {
  const [keywordsInput, setKeywordsInput] = useState(
    initialData?.requiredKeywords?.join(', ') || ''
  )
  const [forbiddenInput, setForbiddenInput] = useState(
    initialData?.forbiddenWords?.join(', ') || ''
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<BriefingFormData>({
    resolver: zodResolver(briefingSchema),
    mode: 'onChange',
    defaultValues: {
      product: initialData?.product || '',
      targetAudience: initialData?.targetAudience || '',
      objective: initialData?.objective,
      differentials: initialData?.differentials || '',
      requiredKeywords: initialData?.requiredKeywords || [],
      forbiddenWords: initialData?.forbiddenWords || [],
    },
  })

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value)
    setValue('requiredKeywords', parseCommaSeparated(value), { shouldValidate: true })
  }

  const handleForbiddenChange = (value: string) => {
    setForbiddenInput(value)
    setValue('forbiddenWords', parseCommaSeparated(value), { shouldValidate: true })
  }

  const handleAutoFill = () => {
    const randomIndex = Math.floor(Math.random() * MOCK_BRIEFINGS.length)
    const mockData = MOCK_BRIEFINGS[randomIndex]

    reset(mockData)
    setKeywordsInput(mockData.requiredKeywords?.join(', ') || '')
    setForbiddenInput(mockData.forbiddenWords?.join(', ') || '')
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Intro Section */}
      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Crie copies que <span className="text-gradient-primary">convertem</span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-lg text-sm sm:text-base">
          O AdVariant usa inteligência artificial para gerar variações de anúncios otimizadas para
          Google Ads, Meta Ads e LinkedIn. Preencha o briefing e deixe a IA fazer o trabalho pesado.
        </p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Briefing do Anúncio</CardTitle>
              <CardDescription>
                Preencha as informações sobre o produto e público-alvo
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFill}
                  className="shrink-0"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Auto-preencher
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Preenche com dados fictícios para testar o app</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Produto/Serviço"
              htmlFor="product"
              required
              error={errors.product?.message}
              help={FIELD_HELP.product}
            >
              <Textarea
                id="product"
                icon={<Package className="size-4" />}
                placeholder="Descreva aqui..."
                error={!!errors.product}
                rows={3}
                {...register('product')}
              />
            </FormField>

            <FormField
              label="Público-alvo"
              htmlFor="targetAudience"
              required
              error={errors.targetAudience?.message}
              help={FIELD_HELP.targetAudience}
            >
              <Textarea
                id="targetAudience"
                icon={<Users className="size-4" />}
                placeholder="Descreva aqui..."
                error={!!errors.targetAudience}
                rows={3}
                {...register('targetAudience')}
              />
            </FormField>

            <FormField
              label="Objetivo da Campanha"
              htmlFor="objective"
              required
              error={errors.objective?.message}
              help={FIELD_HELP.objective}
            >
              <Controller
                name="objective"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2">
                      <Target className="size-4" />
                    </div>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`pl-10 ${errors.objective ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {OBJECTIVES.map((obj) => (
                          <SelectItem key={obj.value} value={obj.value}>
                            {obj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </FormField>

            <FormField
              label="Diferenciais"
              htmlFor="differentials"
              required
              error={errors.differentials?.message}
              help={FIELD_HELP.differentials}
            >
              <Textarea
                id="differentials"
                icon={<Sparkles className="size-4" />}
                placeholder="Liste os pontos fortes..."
                error={!!errors.differentials}
                rows={3}
                {...register('differentials')}
              />
            </FormField>

            <FormField
              label="Palavras-chave obrigatórias"
              htmlFor="requiredKeywords"
              help={FIELD_HELP.requiredKeywords}
            >
              <Input
                id="requiredKeywords"
                icon={<Tag className="size-4" />}
                placeholder="palavra1, palavra2..."
                value={keywordsInput}
                onChange={(e) => handleKeywordsChange(e.target.value)}
              />
            </FormField>

            <FormField
              label="Palavras proibidas"
              htmlFor="forbiddenWords"
              help={FIELD_HELP.forbiddenWords}
            >
              <Input
                id="forbiddenWords"
                icon={<Ban className="size-4" />}
                placeholder="palavra1, palavra2..."
                value={forbiddenInput}
                onChange={(e) => handleForbiddenChange(e.target.value)}
              />
            </FormField>

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              size="lg"
              disabled={!isValid}
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
