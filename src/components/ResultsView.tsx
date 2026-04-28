"use client"

import { useTestStore, Temperament, questions } from "@/store/testStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { RotateCcw, Home, Award } from "lucide-react"

export function ResultsView() {
  const { scores, userName, resetTest } = useTestStore()

  const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0) || 1

  const percentages = {
    sanguineo: Math.round((scores.sanguineo / totalAnswers) * 100),
    colerico: Math.round((scores.colerico / totalAnswers) * 100),
    melancolico: Math.round((scores.melancolico / totalAnswers) * 100),
    flematico: Math.round((scores.flematico / totalAnswers) * 100)
  }

  const chartData = [
    { name: "Sanguíneo", value: scores.sanguineo, percentage: percentages.sanguineo, fill: "#ef4444" },
    { name: "Colérico", value: scores.colerico, percentage: percentages.colerico, fill: "#eab308" },
    { name: "Melancólico", value: scores.melancolico, percentage: percentages.melancolico, fill: "#3b82f6" },
    { name: "Flemático", value: scores.flematico, percentage: percentages.flematico, fill: "#22c55e" }
  ].sort((a, b) => b.value - a.value)

  const primary = chartData[0]
  const secondary = chartData[1]

  const descriptions: Record<Temperament, { title: string; description: string; emoji: string }> = {
    sanguineo: {
      emoji: "😊",
      title: "Sanguíneo",
      description: "Eres una persona comunicativa, optimista y lleno de energía. Tiendes a ser el alma de cualquier reunión y te adaptas fácilmente a situaciones nuevas. Tu entusiasmo es contagioso y bring alegría a quienes te rodean."
    },
    colerico: {
      emoji: "💪",
      title: "Colérico",
      description: "Eres una persona determinada, líder natural y orientada a metas. Cuando algo te importa, no te rindes hasta lograrlo. Tienes un fuerte sentido de responsabilidad y te gusta tener el control de las situaciones."
    },
    melancolico: {
      emoji: "🎭",
      title: "Melancólico",
      description: "Eres una persona reflexiva, profunda y analytica. Te gusta entender las cosas en profundidad y sueles ser muy observador. Valoras la autenticidad y la profundidad en las relaciones."
    },
    flematico: {
      emoji: "😌",
      title: "Flemático",
      description: "Eres una persona calmada, pacífica y fácil de tratar. Mantienes la serenidad bajo presión y sabes manejar conflictos de forma harmoniosa. Las personas pueden contar contigo para resolver problemas."
    }
  }

  const combinations: Record<string, { title: string; description: string }> = {
    "sanguineo-colerico": {
      title: "Líder Carismático",
      description: "Combinas la energía del sanguíneo con el liderazgo del colérico. Eres capaz de motivar a otros mientras logras tus metas."
    },
    "sanguineo-melancolico": {
      title: "Emocional y Artístico",
      description: "Tienes la creatividad del sanguíneo con la profundidad del melancólico. Expresas tus emociones de manera única y profunda."
    },
    "sanguineo-flematico": {
      title: "Sociable y Tranquilo",
      description: "Combinas la alegría del sanguíneo con la serenidad del flemático. Eres amable y adaptable, manteniendo la paz mientras disfrutas la vida."
    },
    "colerico-melancolico": {
      title: "Líder Perfeccionista",
      description: "Juntas la determinación del colérico con el análisis del melancólico. Buscas la excelencia en todo lo que haces."
    },
    "colerico-flematico": {
      title: "Líder Tranquilo",
      description: "Combinas la fuerza del colérico con la calma del flemático.Tienes el drive para liderar pero con paciencia y sensatez."
    },
    "melancolico-flematico": {
      title: "Tranquilo y Profundo",
      description: "Juntas la reflexión del melancólico con la paz del flemático. Eres observador, calmado y analítico."
    },
    "sanguineo-sanguineo": descriptions.sanguineo,
    "colerico-colerico": descriptions.colerico,
    "melancolico-melancolico": descriptions.melancolico,
    "flematico-flematico": descriptions.flematico
  }

  const comboKey = `${primary.name.toLowerCase()}-${secondary.name.toLowerCase()}`
  const targetDesc = descriptions[primary.name.toLowerCase() as Temperament]
  const combination = combinations[comboKey] || { title: primary.name, description: targetDesc?.description || "" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <CardTitle className="text-2xl text-purple-900">
              ¡Resultados de {userName}!
            </CardTitle>
            <CardDescription className="text-lg">
              Tu temperamento predominante es <span className="font-bold">{primary.name}</span>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Porcentajes por Columna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 14 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Tu Perfil: {combination.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{combination.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: `${item.fill}15` }}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="font-bold" style={{ color: item.fill }}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={resetTest}
            variant="outline"
            className="flex-1 py-6"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Repetir Test
          </Button>
        </div>
      </div>
    </div>
  )
}