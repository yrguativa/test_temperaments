"use client"

import { useState } from "react"
import { useTestStore } from "@/store/testStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function WelcomeForm() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const { setUserName, step } = useTestStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError("Por favor ingresa tu nombre")
      return
    }
    setUserName(name.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🌟</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-purple-900">
              Test de Temperamentos
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Descubre tu tipo de temperamento según los 4 temperamentos clásicos: Sanguíneo, Colérico, Melancólico y Flemático
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
                className="text-lg py-6"
                autoComplete="name"
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium"
            >
              Comenzar Test
            </Button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">
            Este test tiene 10 preguntas sobre situaciones cotidianas en tu vida espiritual y personal.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}