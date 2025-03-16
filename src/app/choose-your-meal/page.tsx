import { Container } from "lucide-react"
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

 
async function getData(): Promise<Payment[]> {
  // RECIEVE/FETCH data from the API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "Processing",
      meal: "Fried Chicken",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "Processing",
      meal: "Barbeque Chicken",
    },
    {
      id: "a1b2c3d4",
      amount: 200,
      status: "Processing",
      meal: "Stir Fry",
    },
    {
      id: "e5f6g7h8",
      amount: 50,
      status: "Out of Stock",
      meal: "Pizza",
    },
    {
      id: "i9j0k1l2",
      amount: 175,
      status: "Processing",
      meal: "Fried Rice",
    },
    {
      id: "m3n4o5p6",
      amount: 300,
      status: "Processing",
      meal: "Fried Chicken Wraps",
    },
    {
      id: "q7r8s9t0",
      amount: 80,
      status: "Processing",
      meal: "Brown Stew Fish",
    },
    {
      id: "u1v2w3x4",
      amount: 225,
      status: "Ready to Go",
      meal: "Sweet and Sour Pork",
    },
    {
      id: "y5z6a7b8",
      amount: 150,
      status: "Out of Stock",
      meal: "Beef Burger",
    },
    {
      id: "c9d0e1f2",
      amount: 275,
      status: "Processing",
      meal: "Cheese Burger",
    },
]

}
 
export default async function DemoPage() {
  const data = await getData()
 
  return (
    
        <div className="w-full max-w-screen-2xl mx-auto py-10 px-4" style={{ backgroundColor: "oklch(0.18 0.042 264.695)" }}>
            <h2 style={{ color: "#E67700"}}>Meal Availability</h2>
            <DataTable columns={columns} data={data} />
        </div>
  )
}