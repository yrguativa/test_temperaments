"use client"

import { useState, useEffect, useRef } from "react"
import { useTestStore, questions } from "@/store/testStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function QuestionWizard() {
  const { 
    currentQuestion, 
    setAnswer, 
    nextQuestion, 
    prevQuestion, 
    answers,
    goToResults,
    userName,
    shuffledQuestions
  } = useTestStore()

  const question = shuffledQuestions.length > 0 ? shuffledQuestions[currentQuestion] : questions[currentQuestion]
  const selectedAnswer = answers[question.id]
  const totalQuestions = shuffledQuestions.length > 0 ? shuffledQuestions.length : questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100
  const shuffledOptionsMap = useRef<Record<number, [string, string][]>>({})
  const [shuffledOptions, setShuffledOptions] = useState<[string, string][]>([])

  useEffect(() => {
    if (!shuffledOptionsMap.current[question.id]) {
      const entries = Object.entries(question.options) as [string, string][]
      shuffledOptionsMap.current[question.id] = shuffleArray(entries)
    }
    setShuffledOptions(shuffledOptionsMap.current[question.id])
  }, [currentQuestion, question.id, question.options])

  const handleSelect = (temperament: 'sanguineo' | 'colerico' | 'melancolico' | 'flematico') => {
    setAnswer(question.id, temperament)
    if (currentQuestion < totalQuestions - 1) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 font-subtitulos">
              Pregunta {currentQuestion + 1} de {totalQuestions}
            </span>
            <span className="text-sm text-gray-500 font-texto">{userName}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-blue-900 leading-relaxed font-titulos">
              {question.situation}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shuffledOptions.map(
              ([key, value]) => {
                const info = temperamentLabels[key as keyof typeof temperamentLabels]
                const isSelected = selectedAnswer === key
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(key as keyof typeof temperamentLabels)}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                      flex items-start gap-3
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                    `}>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      {/* <span className={`
                        inline-block px-2 py-0.5 rounded text-xs font-medium mb-1
                        ${info.color}
                      `}>
                        {info.emoji} {info.label}
                      </span> */}
                      <p className="text-gray-700 font-texto">{value}</p>
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
            className="px-6 font-subtitulos"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          {currentQuestion === totalQuestions - 1 && selectedAnswer ? (
             <Button
               onClick={goToResults}
               className="bg-[#0077cc] hover:bg-blue-700 px-6 font-subtitulos"
             >
               Ver Resultados
               <ChevronRight className="w-4 h-4 ml-2" />
             </Button>
           ) : (
             <Button
               onClick={nextQuestion}
               disabled={currentQuestion === totalQuestions - 1}
               className="bg-[#0077cc] hover:bg-blue-700 px-6 font-subtitulos"
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