import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Live from "./components/Live"
import Database from "./components/Database"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={<Live />} />
            <Route path="/database" element={<Database />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
