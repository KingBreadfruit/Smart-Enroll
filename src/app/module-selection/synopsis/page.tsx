"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Layers, CheckCircle, Calendar, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// This would normally be fetched from an API
const getModuleData = (moduleCode: string) => {
  const modules = {
    CIT2018: {
      moduleCode: "CIT2018",
      module: "Database Design",
      occurence: "UE3",
      dateTime: "Mon-2-pm-4-pm",
      status: "24/50",
      description: "Introduction to database design principles, SQL, and relational database management systems.",
    },
    UM2021: {
      moduleCode: "UM2021",
      module: "Web Development",
      occurence: "UM2",
      dateTime: "Tue-10-am-12-pm",
      status: "18/50",
      description: "Learn modern web development techniques using HTML, CSS, JavaScript, and popular frameworks.",
    },
    UN3056: {
      moduleCode: "UN3056",
      module: "Software Engineering",
      occurence: "UN1",
      dateTime: "Wed-1-pm-3-pm",
      status: "40/50",
      description: "Study software development methodologies, project management, and software design patterns.",
    },
    UE4045: {
      moduleCode: "UE4045",
      module: "Computer Networks",
      occurence: "UE1",
      dateTime: "Thu-9-am-11-am",
      status: "5/50",
      description: "Explore network protocols, architecture, security, and implementation of computer networks.",
    },
    UM1234: {
      moduleCode: "UM1234",
      module: "Programming Fundamentals",
      occurence: "UM1",
      dateTime: "Fri-3-pm-5-pm",
      status: "10/50",
      description: "Introduction to programming concepts, algorithms, and problem-solving techniques.",
    },
    UM5678: {
      moduleCode: "UM5678",
      module: "Mobile App Development",
      occurence: "UM3",
      dateTime: "Mon-4-pm-6-pm",
      status: "35/50",
      description: "Learn to develop mobile applications for iOS and Android platforms.",
    },
    UN9876: {
      moduleCode: "UN9876",
      module: "Artificial Intelligence",
      occurence: "UN4",
      dateTime: "Tue-1-pm-3-pm",
      status: "30/50",
      description: "Study AI concepts, machine learning algorithms, and neural networks.",
    },
    UE6543: {
      moduleCode: "UE6543",
      module: "Data Structures & Algorithms",
      occurence: "UE2",
      dateTime: "Wed-11-am-1-pm",
      status: "50/50",
      description: "Learn essential data structures and algorithms for efficient problem solving.",
    },
    UM2468: {
      moduleCode: "UM2468",
      module: "Cybersecurity",
      occurence: "UM4",
      dateTime: "Thu-2-pm-4-pm",
      status: "12/50",
      description: "Explore security principles, threats, vulnerabilities, and protection mechanisms.",
    },
    UE1357: {
      moduleCode: "UE1357",
      module: "Cloud Computing",
      occurence: "UE1",
      dateTime: "Fri-10-am-12-pm",
      status: "8/50",
      description: "Introduction to cloud services, deployment models, and cloud infrastructure.",
    },
  }

  return modules[moduleCode as keyof typeof modules] || null
}

// Format the dateTime string for display
const formatDateTime = (dateTime: string) => {
  const daysOfWeek: { [key: string]: string } = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  }

  const parts = dateTime.split("-")
  if (parts.length >= 5) {
    const day = daysOfWeek[parts[0].toLowerCase()] || parts[0] // Convert to full day name
    return `${day}, ${parts[1]} ${parts[2]} - ${parts[3]} ${parts[4]}`
  }
  return dateTime
}

export default function SynopsisPage() {
  const searchParams = useSearchParams()
  const moduleIds = searchParams.get("modules")?.split(",") || []
  const [registeredModules, setRegisteredModules] = useState<any[]>([])
  const contentRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const fetchModules = async () => {
      const modules = await Promise.all(moduleIds.map((id) => getModuleData(id)))
      setRegisteredModules(modules.filter(Boolean)) // Ensure no `null` values
    }
  
    if (moduleIds.length > 0) {
      fetchModules()
    }
  }, [moduleIds])

  // Calculate total credit hours (assuming each module is 3 credits)
  const totalCredits = registeredModules.length * 3

  // Function to generate and download PDF
  const handleDownloadPDF = () => {
    // In a real application, you would use a library like jsPDF and html2canvas
    // Here we'll simulate the download with a data URL
    const studentId = "2023001234"
    const date = new Date().toLocaleDateString()

    // Create a text version of the registration
    let content = `UTECH MODULE REGISTRATION RECEIPT\n\n`
    content += `Student ID: ${studentId}\n`
    content += `Registration Date: ${date}\n`
    content += `Total Modules: ${registeredModules.length}\n`
    content += `Total Credits: ${totalCredits}\n\n`
    content += `REGISTERED MODULES:\n\n`

    registeredModules.forEach((module, index) => {
      content += `${index + 1}. ${module.moduleCode}: ${module.module}\n`
      content += `   Schedule: ${formatDateTime(module.dateTime)}\n`
      content += `   Occurrence: ${module.occurence}\n\n`
    })

    // Create a Blob with the content
    const blob = new Blob([content], { type: "text/plain" })

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `module_registration_${studentId}_${date.replace(/\//g, "-")}.txt`
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
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
            <Link href="/module-selection" className="text-sm font-medium">
              Back to Selection
            </Link>
            <Button variant="outline" size="sm">
              Log Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" style={{ color: "#E67700" }}>
              Registration Complete
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Your module registration has been successfully processed.
            </p>
          </div>
        </section>

        <section className="container py-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle style={{ color: "#E67700" }}>Registration Summary</CardTitle>
              <CardDescription>Academic Year 2024/2025 - Semester 1</CardDescription>
            </CardHeader>
            <CardContent ref={contentRef}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Student ID</h3>
                    <p className="text-lg font-medium">2023001234</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Registration Date</h3>
                    <p className="text-lg font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Modules</h3>
                    <p className="text-lg font-medium">{registeredModules.length}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Credits</h3>
                    <p className="text-lg font-medium">{totalCredits} credits</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Registered Modules</h3>
                  {registeredModules.length > 0 ? (
                    <div className="space-y-4">
                      {registeredModules.map((module, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-bold" style={{ color: "#E67700" }}>
                                  {module.moduleCode}: {module.module}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatDateTime(module.dateTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>Occurrence: {module.occurence}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No modules registered.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-center mt-8">
            <Link href="/">
              <Button variant="outline" size="lg">
                Return to Home Page
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

/*<Link href="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-xl font-bold">UT-MAS</span>
          </Link>*/ 
