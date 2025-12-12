import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Live from './components/Live'
import Database from './components/Database'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Live />}></Route>
        <Route path="/database" element={<Database />}></Route>
      </Routes>
    </BrowserRouter>
  )
}