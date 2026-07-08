import { create } from 'zustand'
import questionsData from '../../test_temperamentos.json'

export type Temperament = 'Sangineo' | 'Colerico' | 'Melancolico' | 'Flematico'

export interface TemperamentOption {
  titulo: string
  desc: string
}

export interface JsonQuestion {
  num: number
  tipo: string
  Sangineo: TemperamentOption
  Colerico: TemperamentOption
  Melancolico: TemperamentOption
  Flematico: TemperamentOption
}

const allQuestions = questionsData as JsonQuestion[]

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export type Step = 'form' | 'testing' | 'results'

export interface NewTestState {
  step: Step
  currentQuestion: number
  userName: string
  answers: Record<number, Temperament>
  scores: Record<Temperament, number>
  shuffledQuestions: JsonQuestion[]

  setUserName: (name: string) => void
  selectAnswer: (num: number, temperament: Temperament) => void
  prevQuestion: () => void
  resetTest: () => void
}

const temperaments: Temperament[] = ['Sangineo', 'Colerico', 'Melancolico', 'Flematico']

const initialScores: Record<Temperament, number> = {
  Sangineo: 0,
  Colerico: 0,
  Melancolico: 0,
  Flematico: 0
}

export const useNewTestStore = create<NewTestState>((set, get) => ({
  step: 'form',
  currentQuestion: 0,
  userName: '',
  answers: {},
  scores: { ...initialScores },
  shuffledQuestions: [],

  setUserName: (name) => set({
    userName: name,
    step: 'testing',
    shuffledQuestions: shuffleArray(allQuestions)
  }),

  selectAnswer: (num, temperament) => {
    const { answers, scores, currentQuestion, shuffledQuestions } = get()

    const newAnswers = { ...answers, [num]: temperament }
    const newScores = { ...scores }

    const previousAnswer = answers[num]
    if (previousAnswer) {
      if (previousAnswer !== temperament) {
        newScores[previousAnswer] = Math.max(newScores[previousAnswer] - 1, 0)
        newScores[temperament]++
      }
    } else {
      newScores[temperament]++
    }

    const nextQuestion = currentQuestion + 1
    const isLast = nextQuestion >= shuffledQuestions.length

    set({
      answers: newAnswers,
      scores: newScores,
      currentQuestion: isLast ? currentQuestion : nextQuestion,
      step: isLast ? 'results' : 'testing'
    })
  },

  prevQuestion: () => set((state) => ({
    currentQuestion: Math.max(state.currentQuestion - 1, 0)
  })),

  resetTest: () => set({
    step: 'form',
    currentQuestion: 0,
    userName: '',
    answers: {},
    scores: { ...initialScores },
    shuffledQuestions: []
  })
}))
