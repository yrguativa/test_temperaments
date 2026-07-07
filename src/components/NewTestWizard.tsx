"use client"

import { useState, useEffect, useCallback } from "react"
import { useNewTestStore, Temperament, TemperamentOption } from "@/store/newTestStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { RotateCcw, Sparkles } from "lucide-react"

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
  const { currentQuestion, shuffledQuestions, selectAnswer, userName, answers } = useNewTestStore()
  const question = shuffledQuestions[currentQuestion]
  const totalQuestions = shuffledQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100
  const selectedAnswer = answers[question.num]
  const [animKey, setAnimKey] = useState(0)
  const [exiting, setExiting] = useState(false)

  const [shuffledOptions, setShuffledOptions] = useState<[Temperament, TemperamentOption][]>([])

  useEffect(() => {
    setAnimKey((k) => k + 1)
    const entries: [Temperament, TemperamentOption][] = [
      ['Sangineo', question.Sangineo],
      ['Colerico', question.Colerico],
      ['Melancolico', question.Melancolico],
      ['Flematico', question.Flematico]
    ]
    setShuffledOptions(shuffleArray(entries))
  }, [currentQuestion, question])

  const handleSelect = useCallback((temperament: Temperament) => {
    if (selectedAnswer) return
    setExiting(true)
    setTimeout(() => {
      selectAnswer(question.num, temperament)
      setExiting(false)
    }, 200)
  }, [selectedAnswer, selectAnswer, question.num])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 animate-[fade-in_0.4s_ease-out]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 font-subtitulos">
              Pregunta {currentQuestion + 1} de {totalQuestions}
            </span>
            <span className="text-sm text-gray-500 font-texto">{userName}</span>
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
            <CardHeader className="pb-2">
              <p className="text-lg font-semibold text-blue-900 font-titulos">
                ¿Con cuál de los enunciados te sientes más identificado?
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {shuffledOptions.map(([key, option], i) => {
                  const isSelected = selectedAnswer === key
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(key)}
                      disabled={!!selectedAnswer}
                      className={`
                        aspect-square p-4 rounded-2xl border-2 transition-all duration-300
                        flex flex-col items-center justify-center text-center relative overflow-hidden
                        ${isSelected
                          ? 'border-transparent shadow-xl scale-[1.03] bg-gradient-to-br from-blue-500 to-cyan-400 text-white'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
                        }
                        ${selectedAnswer ? 'cursor-default' : 'cursor-pointer active:scale-[0.95]'}
                        animate-[card-in_0.4s_ease-out]
                      `}
                      style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                      )}
                      <p className={`font-texto text-sm leading-tight relative z-10 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                        {temperamentEmojis[key]} {option.titulo}
                      </p>
                      <p className={`text-[10px] mt-1 leading-tight relative z-10 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="animate-[fade-in_0.6s_ease-out]">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400" />
            <CardHeader className="text-center pt-8">
              <div className="mx-auto w-22 h-22 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4 animate-[bounce-in_0.6s_ease-out]">
                <span className="text-4xl">🎯</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent font-titulos">
                  ¡Resultados de {userName}!
                </h1>
                <p className="text-lg text-gray-500 font-subtitulos mt-2">
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
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400" />
            <CardHeader>
              <h2 className="text-xl font-titulos bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Porcentajes por Temperamento
              </h2>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
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

        <div className="animate-[fade-in_0.6s_ease-out_0.4s_both]">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
            <CardHeader>
              <h2 className="flex items-center gap-2 font-titulos text-xl">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  Tu Perfil: {profile.title}
                </span>
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed font-texto">{profile.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {chartData.map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
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

        <div className="flex gap-4 pb-8 animate-[fade-in_0.6s_ease-out_0.6s_both]">
          <Button
            onClick={resetTest}
            variant="outline"
            className="flex-1 py-6 font-subtitulos border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
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
