"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { toPng } from "html-to-image"
import { useNewTestStore, Temperament, TemperamentOption } from "@/store/newTestStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { RotateCcw, Sparkles, Share2 } from "lucide-react"

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const temperamentColors: Record<Temperament, string> = {
  Sangineo: "#0077cc",
  Colerico: "#00aaff",
  Melancolico: "#0055aa",
  Flematico: "#00cc66"
}

const temperamentGradients: Record<Temperament, string> = {
  Sangineo: "from-blue-400 to-cyan-300",
  Colerico: "from-sky-400 to-indigo-300",
  Melancolico: "from-blue-600 to-purple-500",
  Flematico: "from-emerald-400 to-teal-300"
}

const temperamentLabels: Record<Temperament, string> = {
  Sangineo: "Sanguíneo",
  Colerico: "Colérico",
  Melancolico: "Melancólico",
  Flematico: "Flemático"
}

const temperamentEmojis: Record<Temperament, string> = {
  Sangineo: "😊",
  Colerico: "🔥",
  Melancolico: "🎭",
  Flematico: "🌿"
}

const optionEmojis: Record<Temperament, Record<string, string>> = {
  Sangineo: {
    "Animado": "🎉", "Juguetón": "🧸", "Sociable": "🤝", "Convincente": "💬",
    "Alentador": "👏", "Vivaz": "✨", "Promotor": "📢", "Espontáneo": "🎪",
    "Optimista": "🌈", "Humorístico": "😂", "Encantador": "🌟", "Alegre": "☀️",
    "Inspirador": "💡", "Cálido": "🤗", "Tratable": "😄", "Conversador": "🗣️",
    "Enérgico": "⚡", "Adorable": "🥰", "Popular": "🎊", "Jovial": "🎵",
    "Estridente": "📣", "Indisciplinado": "😤", "Repetidor": "🔄", "Olvidadizo": "😅",
    "Interrumpe": "✋", "Imprevisible": "🎲", "Descuidado": "😬", "Permisivo": "🤷",
    "Iracundo": "😠", "Ingenuo": "😇", "Quiere el crérdito": "🏆", "Hablador": "🗨️",
    "Desorganizado": "📦", "Inconsistente": "🎭", "Desordenado": "📚", "Ostentoso": "💎",
    "Ruidoso": "🔊", "Precipitado": "🏃", "Inquieto": "🌀", "Variable": "🌊"
  },
  Colerico: {
    "Aventurero": "🗺️", "Persuasivo": "🎯", "Decidido": "💪", "Competitivo": "🏆",
    "Inventivo": "💡", "Autosuficiente": "🦾", "Positivo": "👍", "Seguro": "🛡️",
    "Franco": "📯", "Dominante": "👑", "Osado": "🦁", "Confiado": "😎",
    "Independiente": "🦅", "Decisivo": "⚡", "Influenciador": "📡", "Persistente": "🎯",
    "Líder": "🚀", "Jefe": "👔", "Productivo": "✅", "Atrevido": "🔥",
    "Mandón": "📋", "Antipático": "🥶", "Resistente": "🪨", "Cortante": "🗡️",
    "Impaciente": "⏰", "Frío": "🧊", "Terco": "🫏", "Orgulloso": "🦚",
    "Argumentador": "⚖️", "Adicto al trabajo": "💼", "Indiscreto": "🤫",
    "Intolerante": "🚫", "Manipulador": "🎪", "Testarudo": "🧱", "Prepotente": "👊",
    "Malgeniado": "🤬", "Astuto": "🦊"
  },
  Melancolico: {
    "Analítico": "🔍", "Persistente": "🎯", "Abnegado": "🙏", "Considerado": "💭",
    "Respetuoso": "🎩", "Sensible": "🎨", "Planificador": "📋", "Sigue un horario": "⏰",
    "Ordenado": "📐", "Fiel": "🤝", "Detallista": "🔎", "Culto": "📚",
    "Idealista": "⭐", "Introspectivo": "🧘", "Sensible al arte": "🎭", "Leal": "🛡️",
    "Crea gráficas": "📊", "Perfeccionista": "💎", "Se comparta bien": "🎀",
    "Penoso": "😳", "Implacable": "⚔️", "Resentido": "😤", "Exigente": "📏",
    "Inseguro": "😟", "Impopular": "😶", "Difícil contentar": "😒", "Pesimista": "🌧️",
    "Callado": "🤐", "Negativo": "☁️", "Retraído": "🐌", "Susceptible": "😿",
    "Deprimido": "😔", "Introvertido": "📖", "Desanimado": "😩", "Escéptico": "🤔",
    "Solitario": "🧍", "Suspicaz": "👀", "Vengativo": "🗡️", "Crítico": "📝"
  },
  Flematico: {
    "Adaptable": "🌊", "Sereno": "🧘", "Sumiso": "🕊️", "Controlado": "🎛️",
    "Reservado": "🤫", "Tranquilo": "😌", "Paciente": "⏳", "Tímido": "🙈",
    "Complaciente": "😊", "Amigable": "👋", "Diplomático": "🤝", "Constante": "⛰️",
    "Inofensivo": "🐑", "Humor seco": "😏", "Conciliador": "☮️", "Tolerante": "🌈",
    "Escucha": "👂", "Contento": "😊", "Equilibrado": "⚖️",
    "Monótono": "🔁", "Sin entudiasmo": "😐", "Sarcástico": "😏", "Temeroso": "😨",
    "Indeciso": "🤷", "No comprometido": "🚶", "Vacilante": "⏱️", "Insípido": "💧",
    "Sin objetivos": "🎯", "Despreocupado": "🍃", "Ansioso": "😰", "Dudoso": "🤨",
    "Indiferente": "🗿", "Habla entre dientes": "😶‍🌫️", "Lento": "🐢",
    "Flojo": "🛋️", "Perezoso": "😴", "Poca vountad": "🌱", "Genera riesgos": "⚠️"
  }
}

const getOptionEmoji = (temperament: Temperament, titulo: string): string =>
  optionEmojis[temperament]?.[titulo] ?? temperamentEmojis[temperament]

const temperamentTraits: Record<Temperament, { fortalezas: string[]; debilidades: string[]; parrafo: string }> = {
  Sangineo: {
    fortalezas: ["Sociable", "Entusiasta", "Compasivo", "Comunicativo", "Alegre", "Amigable"],
    debilidades: ["Voluntad débil", "Indisciplinado", "Inestable emocional", "Egocéntrico", "Exagerado"],
    parrafo: "Los sanguíneos son personas cálidas, entusiastas y llenas de vida. Disfrutan estar rodeados de gente, son comunicativos naturales y contagian su alegría a los demás. Su compasión los lleva a ayudar y su optimismo los hace ver siempre el lado bueno. Sin embargo, su voluntad débil los hace propensos a la indisciplina y la inconstancia. Su inestabilidad emocional y tendencia a exagerar pueden generar conflictos, y su necesidad de atención los vuelve egocéntricos si no se controlan."
  },
  Colerico: {
    fortalezas: ["Decidido", "Líder nato", "Optimista", "Práctico", "Productivo", "Audaz"],
    debilidades: ["Orgulloso", "Iracundo", "Insensible", "Autosuficiente", "Dominante"],
    parrafo: "Los coléricos son líderes natos: decididos, prácticos y productivos. Su optimismo los impulsa a lograr grandes metas y su audacia los hace enfrentar desafíos que otros evitarían. Son personas de acción que inspiran a seguirles. Pero su orgullo y autosuficiencia los lleva a creer que no necesitan ayuda. Su ira y falta de sensibilidad hieren a quienes los rodean, y su tendencia dominante puede sofocar a los demás si no aprenden a controlar su carácter."
  },
  Melancolico: {
    fortalezas: ["Analítico", "Abnegado", "Talentoso", "Perfeccionista", "Leal", "Sensible"],
    debilidades: ["Deprimido", "Negativo", "Pesimista", "Crítico", "Vengativo", "Introvertido"],
    parrafo: "Los melancólicos poseen una mente analítica y profunda, son talentosos y perfeccionistas en todo lo que hacen. Su lealtad es inquebrantable y su sensibilidad los hace captar matices que otros pasan por alto. Son abnegados y sacrificados por quienes aman. No obstante, su tendencia a la depresión y el negativismo nubla su perspectiva. El perfeccionismo extremo los vuelve críticos y difíciles de complacer, y su inclinación al rencor y al aislamiento los lleva a la soledad si no se entregan a Dios."
  },
  Flematico: {
    fortalezas: ["Calmado", "Confiable", "Eficiente", "Práctico", "Diplomático", "Humor seco"],
    debilidades: ["Tímido", "Indeciso", "Temeroso", "Evasivo", "Desmotivado"],
    parrafo: "Los flemáticos son personas tranquilas, confiables y eficientes. Su diplomacia y humor seco los hacen agradables en cualquier grupo, y su naturaleza práctica resuelve problemas sin estridencias. Son leales y consistentes, manteniendo la calma bajo presión. Sin embargo, su timidez y temor al conflicto los vuelve indecisos y evasivos. Su tendencia a la desmotivación los hace parecer desinteresados, y prefieren evitar compromisos antes de enfrentar situaciones incómodas."
  }
}

const descriptions: Record<string, { title: string; description: string }> = {
  Sangineo: {
    title: "Sanguíneo",
    description: "😊 Eres una persona comunicativa, optimista y lleno de energía. Tiendes a ser el alma de cualquier reunión y te adaptas fácilmente a situaciones nuevas. Tu entusiasmo es contagioso y traes alegría a quienes te rodean."
  },
  Colerico: {
    title: "Colérico",
    description: "🔥 Eres una persona determinada, líder natural y orientada a metas. Cuando algo te importa, no te rindes hasta lograrlo. Tienes un fuerte sentido de responsabilidad y te gusta tener el control de las situaciones."
  },
  Melancolico: {
    title: "Melancólico",
    description: "🎭 Eres una persona reflexiva, profunda y analítica. Te gusta entender las cosas en profundidad y sueles ser muy observador. Valoras la autenticidad y la profundidad en las relaciones."
  },
  Flematico: {
    title: "Flemático",
    description: "🌿 Eres una persona calmada, pacífica y fácil de tratar. Mantienes la serenidad bajo presión y sabes manejar conflictos de forma armoniosa. Las personas pueden contar contigo para resolver problemas."
  }
}

function WelcomeForm() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const { setUserName } = useNewTestStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError("Por favor ingresa tu nombre")
      return
    }
    setUserName(name.trim())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 p-4 flex items-center justify-center">
      <div className="animate-[fade-in_0.6s_ease-out] w-full max-w-md">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400" />
          <CardHeader className="text-center space-y-4 pt-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center animate-[bounce-in_0.5s_ease-out]">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent font-titulos">
                Test de Temperamentos
              </h1>
              <p className="text-base mt-2 text-gray-500 font-subtitulos">
                40 preguntas para descubrir tu temperamento según los 4 temperamentos clásicos
              </p>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 font-subtitulos">
                  ¿Cuál es tu nombre?
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Escribe tu nombre aquí"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError("")
                  }}
                  className="text-lg py-6 font-texto transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  autoComplete="name"
                />
                {error && (
                  <p className="text-sm text-red-500 font-texto animate-[shake_0.4s_ease-in-out]">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-6 text-lg font-medium font-subtitulos transition-all duration-300 hover:shadow-lg hover:shadow-blue-300/50 active:scale-[0.98]"
              >
                Comenzar Test
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuestionView() {
  const { currentQuestion, shuffledQuestions, selectAnswer, prevQuestion, userName, answers } = useNewTestStore()
  const question = shuffledQuestions[currentQuestion]
  const totalQuestions = shuffledQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100
  const selectedAnswer = answers[question?.num]
  const [animKey, setAnimKey] = useState(0)
  const [exiting, setExiting] = useState(false)

  const orderCache = useRef<Record<number, [Temperament, TemperamentOption][]>>({})

  const shuffledOptions = useMemo(() => {
    if (!orderCache.current[currentQuestion]) {
      orderCache.current[currentQuestion] = shuffleArray([
        ['Sangineo', question.Sangineo],
        ['Colerico', question.Colerico],
        ['Melancolico', question.Melancolico],
        ['Flematico', question.Flematico]
      ])
    }
    return orderCache.current[currentQuestion]
  }, [currentQuestion])

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [currentQuestion])

  const handleSelect = useCallback((temperament: Temperament) => {
    setExiting(true)
    setTimeout(() => {
      selectAnswer(question.num, temperament)
      setExiting(false)
    }, 200)
  }, [selectAnswer, question.num])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 p-3 sm:p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-6 animate-[fade-in_0.4s_ease-out]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 font-subtitulos">
              Pregunta {currentQuestion + 1} de {totalQuestions}
            </span>
            <div className="flex items-center gap-3">
              {currentQuestion > 0 && (
                <button
                  onClick={prevQuestion}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 font-subtitulos flex items-center gap-1 transition-colors active:text-blue-900"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
              )}
              <span className="text-xs sm:text-sm text-gray-500 font-texto">{userName}</span>
            </div>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-cyan-400 [&>div]:transition-all [&>div]:duration-500 [&>div]:ease-out" />
          </div>
        </div>

        <div
          key={animKey}
          className={`transition-all duration-300 ${exiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400" />
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-900 font-titulos px-1 text-balance">
                ¿Con cuál de los enunciados te sientes más identificado?
              </p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {shuffledOptions.map(([key, option], i) => {
                  const isSelected = selectedAnswer === key
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(key)}
                        className={`
                          aspect-square p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300
                          flex flex-col items-center justify-center text-center relative overflow-hidden
                          ${isSelected
                            ? 'border-transparent shadow-xl scale-[1.03] bg-gradient-to-br from-blue-500 to-cyan-400 text-white'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
                          }
                          cursor-pointer active:scale-[0.95]
                          animate-[card-in_0.4s_ease-out]
                        `}
                        style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                        )}
                        <p className={`font-texto text-[11px] sm:text-sm leading-tight relative z-10 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                          {getOptionEmoji(key, option.titulo)} {option.titulo}
                        </p>
                        <p className={`text-[9px] sm:text-[10px] mt-1 leading-tight relative z-10 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                          {option.desc}
                        </p>
                      <div className={`
                        absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ease-out rounded-full
                        ${isSelected ? 'bg-white/50' : 'bg-transparent'}
                      `} />
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedAnswer && currentQuestion < totalQuestions - 1 && (
          <div className="flex justify-center mt-6 animate-[fade-in_0.3s_ease-out]">
            <div className="flex items-center gap-2 text-sm text-gray-400 font-texto">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-[bounce-dot_1.4s_ease-in-out_infinite]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-[bounce-dot_1.4s_ease-in-out_0.2s_infinite]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[bounce-dot_1.4s_ease-in-out_0.4s_infinite]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultsView() {
  const { scores, userName, resetTest } = useNewTestStore()
  const resultsRef = useRef<HTMLDivElement>(null)
  const [capturing, setCapturing] = useState(false)

  const handleShare = useCallback(async () => {
    const el = resultsRef.current
    if (!el) return
    setCapturing(true)
    try {
      const originalHeight = el.style.height
      const originalOverflow = el.style.overflow
      el.style.height = `${el.scrollHeight}px`
      el.style.overflow = "visible"
      await new Promise((r) => setTimeout(r, 300))
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        width: el.scrollWidth,
        height: el.scrollHeight,
        cacheBust: true,
      })
      el.style.height = originalHeight
      el.style.overflow = originalOverflow
      const link = document.createElement("a")
      link.download = `test-temperamentos-${userName}.png`
      link.href = dataUrl
      link.click()
    } catch {
      // fallback silencioso
    }
    setCapturing(false)
  }, [userName])

  const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0) || 1

  const percentages = {
    Sangineo: Math.round((scores.Sangineo / totalAnswers) * 100),
    Colerico: Math.round((scores.Colerico / totalAnswers) * 100),
    Melancolico: Math.round((scores.Melancolico / totalAnswers) * 100),
    Flematico: Math.round((scores.Flematico / totalAnswers) * 100)
  }

  const chartData = [
    { name: "Sanguíneo", value: scores.Sangineo, percentage: percentages.Sangineo, fill: temperamentColors.Sangineo },
    { name: "Colérico", value: scores.Colerico, percentage: percentages.Colerico, fill: temperamentColors.Colerico },
    { name: "Melancólico", value: scores.Melancolico, percentage: percentages.Melancolico, fill: temperamentColors.Melancolico },
    { name: "Flemático", value: scores.Flematico, percentage: percentages.Flematico, fill: temperamentColors.Flematico }
  ].sort((a, b) => b.value - a.value)

  const primary = chartData[0]
  const secondary = chartData[1]

  const primaryKey = (Object.entries(temperamentLabels).find(([, v]) => v === primary.name)?.[0] || 'Sangineo') as Temperament
  const secondaryKey = (Object.entries(temperamentLabels).find(([, v]) => v === secondary.name)?.[0] || 'Flematico') as Temperament
  const profile = descriptions[primaryKey]

  const gradientMap: Record<string, string> = {
    "Sanguíneo": "from-blue-400 to-cyan-300",
    "Colérico": "from-sky-400 to-indigo-300",
    "Melancólico": "from-blue-600 to-purple-500",
    "Flemático": "from-emerald-400 to-teal-300"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 p-3 sm:p-4">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <div ref={resultsRef} className="space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 p-4 rounded-2xl">
        <div className="animate-[fade-in_0.6s_ease-out]">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400" />
            <CardHeader className="text-center pt-8">
              <div className="mx-auto w-22 h-22 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4 animate-[bounce-in_0.6s_ease-out]">
                <span className="text-4xl">🎯</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent font-titulos">
                  ¡Resultados de {userName}!
                </h1>
                <p className="text-sm sm:text-lg text-gray-500 font-subtitulos mt-2">
                  Tu temperamento predominante es{' '}
                  <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {primary.name} — {secondary.name}
                  </span>
                </p>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="animate-[fade-in_0.6s_ease-out_0.2s_both]">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-400 to-pink-400" />
            <CardHeader>
              <h2 className="flex items-center gap-2 font-titulos text-base sm:text-xl">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                  Fortalezas y Debilidades
                </span>
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {([primaryKey, secondaryKey] as Temperament[]).map((key) => {
                  const traits = temperamentTraits[key]
                  const label = temperamentLabels[key]
                  return (
                    <div key={key} className="space-y-3">
                      <h3 className="font-bold font-subtitulos text-lg flex items-center gap-2">
                        <span>{temperamentEmojis[key]}</span>
                        <span style={{ color: temperamentColors[key] }}>{label}</span>
                      </h3>
                      <p className="text-gray-700 font-texto text-sm leading-relaxed">
                        {traits.parrafo}
                      </p>
                      <div>
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1.5">Fortalezas</p>
                        <div className="flex flex-wrap gap-1.5">
                          {traits.fortalezas.map((f) => (
                            <span key={f} className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5">Debilidades</p>
                        <div className="flex flex-wrap gap-1.5">
                          {traits.debilidades.map((d) => (
                            <span key={d} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-[fade-in_0.6s_ease-out_0.4s_both]">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400" />
            <CardHeader>
              <h2 className="text-base sm:text-xl font-titulos bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Porcentajes por Temperamento
              </h2>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 14 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`${value}%`, "Porcentaje"]}
                    />
                    <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={36}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-[fade-in_0.6s_ease-out_0.5s_both]">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
            <CardHeader>
              <h2 className="flex items-center gap-2 font-titulos text-base sm:text-xl">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  Tu Perfil: {profile.title}
                </span>
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed font-texto">{profile.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                {chartData.map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${item.fill}15, ${item.fill}08)`,
                      animation: `fade-in 0.4s ease-out ${0.5 + i * 0.1}s both`
                    }}
                  >
                    <span className="font-medium font-subtitulos">{item.name}</span>
                    <span className="font-bold text-lg" style={{ color: item.fill }}>
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

        <div className="flex gap-2 sm:gap-4 pb-8 animate-[fade-in_0.6s_ease-out_0.6s_both]">
          <Button
            onClick={handleShare}
            disabled={capturing}
            className="flex-1 py-4 sm:py-6 font-subtitulos bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 text-sm sm:text-base"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {capturing ? "Generando..." : "Compartir"}
          </Button>
          <Button
            onClick={resetTest}
            variant="outline"
            className="flex-1 py-4 sm:py-6 font-subtitulos border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Repetir Test
          </Button>
        </div>
      </div>
    </div>
  )
}

export function NewTestWizard() {
  const step = useNewTestStore((state) => state.step)

  switch (step) {
    case "form":
      return <WelcomeForm />
    case "testing":
      return <QuestionView />
    case "results":
      return <ResultsView />
    default:
      return <WelcomeForm />
  }
}
