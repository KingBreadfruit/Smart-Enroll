"use client"

import type React from "react"

import { ModuleSelectionProvider } from "./module-selection-context"

export default function ModuleSelectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ModuleSelectionProvider>{children}</ModuleSelectionProvider>
}

