"use client"

import { useTestStore, questions } from "@/store/testStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"

export function QuestionWizard() {
  const { 
    currentQuestion, 
    setAnswer, 
    nextQuestion, 
    prevQuestion, 
    answers,
    goToResults,
    userName 
  } = useTestStore()

  const question = questions[currentQuestion]
  const selectedAnswer = answers[question.id]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleSelect = (temperament: 'sanguineo' | 'colerico' | 'melancolico' | 'flematico') => {
    setAnswer(question.id, temperament)
    if (currentQuestion < questions.length - 1) {
      nextQuestion()
    } else {
      goToResults()
    }
  }

  const temperamentLabels = {
    sanguineo: { emoji: "😊", label: "Sanguíneo", color: "bg-red-100 text-red-800 border-red-200" },
    colerico: { emoji: "💪", label: "Colérico", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    melancolico: { emoji: "🎭", label: "Melancólico", color: "bg-blue-100 text-blue-800 border-blue-200" },
    flematico: { emoji: "😌", label: "Flemático", color: "bg-green-100 text-green-800 border-green-200" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm text-gray-500">{userName}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-purple-900 leading-relaxed">
              {question.situation}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.entries(question.options) as [keyof typeof question.options, string][]).map(
              ([key, value]) => {
                const info = temperamentLabels[key]
                const isSelected = selectedAnswer === key
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(key as keyof typeof temperamentLabels)}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                      flex items-start gap-3
                      ${isSelected 
                        ? 'border-purple-500 bg-purple-50 shadow-md' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}
                    `}>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`
                        inline-block px-2 py-0.5 rounded text-xs font-medium mb-1
                        ${info.color}
                      `}>
                        {info.emoji} {info.label}
                      </span>
                      <p className="text-gray-700">{value}</p>
                    </div>
                  </button>
                )
              }
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          {currentQuestion === questions.length - 1 && selectedAnswer ? (
            <Button
              onClick={goToResults}
              className="bg-purple-600 hover:bg-purple-700 px-6"
            >
              Ver Resultados
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="bg-purple-600 hover:bg-purple-700 px-6"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}