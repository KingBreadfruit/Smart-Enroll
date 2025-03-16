"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Layers, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import { Timetable } from "./timetable"
import { useModuleSelection } from "./module-selection-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

// This would normally be fetched from an API
const getData = (): Payment[] => {
  return [
    {
      moduleCode: "CIT2018",
      module: "Database Design",
      occurence: "UE3",
      dateTime: "Mon-2-pm-4-pm",
      status: "24/50",
    },
    {
      moduleCode: "UM2021",
      module: "Web Development",
      occurence: "UM2",
      dateTime: "Tue-10-am-12-pm",
      status: "18/50",
    },
    {
      moduleCode: "UN3056",
      module: "Software Engineering",
      occurence: "UN1",
      dateTime: "Wed-1-pm-3-pm",
      status: "40/50",
    },
    {
      moduleCode: "UE4045",
      module: "Computer Networks",
      occurence: "UE1",
      dateTime: "Thu-9-am-11-am",
      status: "5/50",
    },
    {
      moduleCode: "UM1234",
      module: "Programming Fundamentals",
      occurence: "UM1",
      dateTime: "Fri-3-pm-5-pm",
      status: "10/50",
    },
    {
      moduleCode: "UM5678",
      module: "Mobile App Development",
      occurence: "UM3",
      dateTime: "Mon-4-pm-6-pm",
      status: "35/50",
    },
    {
      moduleCode: "UN9876",
      module: "Artificial Intelligence",
      occurence: "UN4",
      dateTime: "Tue-1-pm-3-pm",
      status: "30/50",
    },
    {
      moduleCode: "UE6543",
      module: "Data Structures & Algorithms",
      occurence: "UE2",
      dateTime: "Wed-11-am-1-pm",
      status: "50/50",
    },
    {
      moduleCode: "UM2468",
      module: "Cybersecurity",
      occurence: "UM4",
      dateTime: "Thu-2-pm-4-pm",
      status: "12/50",
    },
    {
      moduleCode: "UE1357",
      module: "Cloud Computing",
      occurence: "UE1",
      dateTime: "Fri-10-am-12-pm",
      status: "8/50",
    },
  ]
}

export default function ModuleSelectionPage() {
  const data = getData()
  const { selectedModules } = useModuleSelection()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const router = useRouter()

  const handleRegister = () => {
    setConfirmDialogOpen(true)
  }

  const handleConfirm = () => {
    // In a real app, you would send the registration to the server here
    // Then navigate to the synopsis page
    const moduleIds = selectedModules.map((m) => m.moduleCode).join(",")
    router.push(`/module-selection/synopsis?modules=${moduleIds}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-xl font-bold">UT-MAS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Button variant="outline" size="sm">
              Log Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="grid gap-6">
            <div className="flex flex-col items-start space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" style={{ color: "#E67700" }}>
                Module Selection
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Select your modules for the upcoming semester.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Module Table */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#E67700" }}>
                Module Availability
              </h2>
              <DataTable columns={columns} data={data} />
            </div>

            {/* Timetable */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#E67700" }}>
                Your Timetable
              </h2>
              <p className="text-muted-foreground mb-4">This timetable updates automatically as you select modules.</p>
              <Timetable />

              <div className="flex justify-end mt-6">
                <Button
                  size="lg"
                  style={{ backgroundColor: "#E67700" }}
                  onClick={handleRegister}
                  disabled={selectedModules.length === 0}
                >
                  Register Selected Modules
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Advisor section commented out for later
        <section className="container py-12">
          <div className="rounded-lg bg-muted p-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Need assistance?</h2>
                <p className="text-muted-foreground">
                  Our academic advisors are available to help with your module selection.
                </p>
              </div>
              <Button size="lg" className="w-full md:w-auto" style={{ backgroundColor: "#E67700" }}>
                Contact Advisor
              </Button>
            </div>
          </div>
        </section>
        */}
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ color: "#E67700" }}>Confirm Module Registration</DialogTitle>
            <DialogDescription>Please review your selected modules before confirming registration.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h3 className="font-medium mb-2">Selected Modules:</h3>
            {selectedModules.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedModules.map((module, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-3 flex items-start gap-2">
                      <Check className="h-4 w-4 mt-1 text-green-600" />
                      <div>
                        <div className="font-medium">
                          {module.moduleCode}: {module.module}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {module.occurence} • {module.dateTime}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No modules selected.</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#E67700" }}
              onClick={handleConfirm}
              disabled={selectedModules.length === 0}
            >
              Confirm Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

