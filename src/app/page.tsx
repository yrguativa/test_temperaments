"use client"

import { useTestStore } from "@/store/testStore"
import { WelcomeForm } from "@/components/WelcomeForm"
import { QuestionWizard } from "@/components/QuestionWizard"
import { ResultsView } from "@/components/ResultsView"

export default function Home() {
  const step = useTestStore((state) => state.step)

  switch (step) {
    case "form":
      return <WelcomeForm />
    case "testing":
      return <QuestionWizard />
    case "results":
      return <ResultsView />
    default:
      return <WelcomeForm />
  }
}