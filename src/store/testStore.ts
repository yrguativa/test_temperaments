import { create } from 'zustand'

export type Temperament = 'sanguineo' | 'colerico' | 'melancolico' | 'flematico'

export interface Question {
  id: number
  situation: string
  options: {
    sanguineo: string
    colerico: string
    melancolico: string
    flematico: string
  }
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export interface TestState {
  step: 'form' | 'testing' | 'results'
  currentQuestion: number
  userName: string
  answers: Record<number, Temperament>
  scores: Record<Temperament, number>
  shuffledQuestions: Question[]
  
  setUserName: (name: string) => void
  setAnswer: (questionId: number, temperament: Temperament) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToResults: () => void
  resetTest: () => void
}

const questions: Question[] = [
  {
    id: 1,
    situation: "En tu grupo de jóvenes de la iglesia, surge la oportunidad de organizar un evento especial. ¿Cómo reaccionas?",
    options: {
      sanguineo: "¡Me emociono rápido! Voy a proponer ideas creativas y novedosas para que sea algo diferente",
      colerico: "Tomo el control. Hacer una lista de tareas y asignar responsabilidades a cada uno",
      melancolico: "Analizo todos los detalles: lugar, tiempo, presupuesto y materiales necesarios",
      flematico: "Prefiero esperar a que otros propongan algo y luego ayudar con lo que se necesite"
    }
  },
  {
    id: 2,
    situation: "Un nuevo miembro llega a la iglesia y no conoce a nadie. ¿Qué haces?",
    options: {
      sanguineo: "Ir directo a hablarle, Presentarle a todos los demás y hacerlo sentir bienvenido",
      colerico: "Acércate de forma directa, le preguntas qué necesita y cómo puedes ayudarle",
      melancolico: "Te acercas con calma, le preguntas cómo llegó y compartes información de la iglesia",
      flematico: "Lo observas un poco y cuando ves que está más cómodo, le hablas con amistad"
    }
  },
  {
    id: 3,
    situation: "Se acerca el domingo de献. Hay mucho trabajo por hacer y el tiempo es corto. ¿Cómo respondes?",
    options: {
      sanguineo: "Me preocupo pero sigo optimista, total siempre se acomoda algo",
      colerico: "Empiezo a organizar todo inmediatamente, delego tareas y me aseguro que todo esté listo",
      melancolico: "Hago una lista de prioridades y trabajo con cuidado para que todo quede perfecto",
      flematico: "Trabajo en lo que me asignen sin着急, pero tampoco me preocupo demas"
    }
  },
  {
    id: 4,
    situation: "Alguien de tu grupo dice algo que te lastima. ¿Qué haces?",
    options: {
      sanguineo: "Lo expreso inmediatamente, puede que hasta llore, pero lo digo con el corazón",
      colerico: "Le digo directamente que eso no me parece correcto y busco resolverlo rápido",
      melancolico: "Lo analizo mucho, me quedo pensando si entendí bien y luego busco hablar en privado",
      flematico: "Prefiero no hacer conflicto, lo dejo pasar para mantener la paz"
    }
  },
  {
    id: 5,
    situation: "El pastor te pide ayuda para un proyecto importante de la iglesia. ¿Cómo respondes?",
    options: {
      sanguineo: "¡Con entusiasmo! Me emociona que me hayan pensado para algo especial",
      colerico: "Acepto con determinación, pregunto qué necesita y me comprometo a cumplirlo",
      melancolico: "Acepto pero con condiciones, necesito saber exactamente qué se espera de mí",
      flematico: "Acepto si no es mucha carga, pero prefiero no comprometerme de más"
    }
  },
  {
    id: 6,
    situation: "Hay una disagreement en el grupo de jóvenes sobre qué actividad hacer. ¿Qué sucede?",
    options: {
      sanguineo: "Propongo投票ar y hacer lo que la mayoría quiera, total nos divertiremos",
      colerico: "Tomo la decisión basado en lo que es mejor para el grupo, aunque algunos no estén de acuerdo",
      melancolico: "Analizo los pros y contras de cada opción y busco una solución que funcione para todos",
      flematico: "Me mantengo neutral y acepto lo que la mayoría decida"
    }
  },
  {
    id: 7,
    situation: "Cuando oras en público, ¿cómo te sientes?",
    options: {
      sanguineo: "¡Me emociona! Oro con energía y fervor, a veces me salgo de lo que tenía preparado",
      colerico: "Oro con propósito y determinación, pido cosas específicas y claras",
      melancolico: "Me cuesta un poco, pienso mucho en las palabras y oro con profundidad",
      flematico: "Prefiero orar en silencio o de manera breve, me siento más cómodo así"
    }
  },
  {
    id: 8,
    situation: "Un amigo de la iglesia atraviesa una situación difícil. ¿Cómo le apoyas?",
    options: {
      sanguineo: "Le llamo, le visito, le hago reír y le animo a seguir adelante",
      colerico: "Le ayudo de forma práctica: resuelvo problemas, busco soluciones concretas",
      melancolico: "Le escucho con atención, me compadezco y le orar profundamente por su situación",
      flematico: "Estoy ahí para lo que necesite, le orar y le mantengo en mis oraciones"
    }
  },
  {
    id: 9,
    situation: "Tienes que dar una teaching o compartir algo en la iglesia. ¿Cómo te preparas?",
    options: {
      sanguineo: "Improviso un poco, me basco en mi entusiasmo y lo que me sale del corazón",
      colerico: "Me preparo muy bien, tengo todo listo y estudiado antes de presentar",
      melancolico: "Repaso muchas veces, me aseguro que todo esté correcto y perfecto",
      flematico: "Hago algo básico, total no necesito tanto preparativo"
    }
  },
  {
    id: 10,
    situation: "Viene alguien nuevo a lider y te dice que tienes que hacer las cosas diferente. ¿Qué sientes?",
    options: {
      sanguineo: "Me adapto rápido y con buena actitud, me gusta lo nuevo",
      colerico: "Defiendo lo que función bien pero también escucho nuevas ideas",
      melancolico: "Analizo si es realmente mejor, no cambio solo por cambiar",
      flematico: "No me afecta mucho, sigo haciendo las cosas como siempre"
    }
  }
]

const initialScores: Record<Temperament, number> = {
  sanguineo: 0,
  colerico: 0,
  melancolico: 0,
  flematico: 0
}

export const useTestStore = create<TestState>((set, get) => ({
  step: 'form',
  currentQuestion: 0,
  userName: '',
  answers: {},
  scores: { ...initialScores },
  shuffledQuestions: [],
  
  setUserName: (name) => set({ userName: name, step: 'testing', shuffledQuestions: shuffleArray(questions) }),
  
  setAnswer: (questionId, temperament) => {
    const { answers, scores } = get()
    const currentAnswer = answers[questionId]
    
    const newAnswers = { ...answers, [questionId]: temperament }
    const newScores = { ...scores }
    
    if (currentAnswer) {
      newScores[currentAnswer]--
    }
    newScores[temperament]++
    
    set({ answers: newAnswers, scores: newScores })
  },
  
  nextQuestion: () => set((state) => {
    const total = state.shuffledQuestions.length > 0 ? state.shuffledQuestions.length : questions.length
    return { currentQuestion: Math.min(state.currentQuestion + 1, total - 1) }
  }),
  
  prevQuestion: () => set((state) => ({
    currentQuestion: Math.max(state.currentQuestion - 1, 0)
  })),
  
  goToResults: () => set({ step: 'results' }),
  
  resetTest: () => set({
    step: 'form',
    currentQuestion: 0,
    userName: '',
    answers: {},
    scores: { ...initialScores },
    shuffledQuestions: []
  })
}))

export { questions }