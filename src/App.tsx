import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Impacts } from './routes/Impacts/Impacts'

function App() {
  return <Routes>
    <Route path="/" element={ <p>1</p> } />
    <Route path="/sac25/impact/" element={ <Impacts /> } />
  </Routes>
}

export default App
