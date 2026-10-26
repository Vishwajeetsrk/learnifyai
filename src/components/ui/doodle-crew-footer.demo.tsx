"use client"

import * as React from "react"
import { DoodleCrewFooter } from "./doodle-crew-footer"

export default function Demo() {
  return (
    <div className="w-full min-h-screen bg-[#05060a] flex flex-col justify-end">
      <DoodleCrewFooter
        wordmark="LEARNIFY"
        brand="Learnify AI"
        logoUrl="/assets/learnify-logo.png"
        preset="night"
      />
    </div>
  )
}
