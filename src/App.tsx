import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Impacts } from './routes/Impacts/Impacts'
import { Orrery } from './routes/Orrery/Orrery'

function App() {
  return <Routes>
    <Route path="sac25">
      <Route index element={<Orrery />} />
      <Route path="impact" element={ <Impacts /> } />
    </Route>
  </Routes>
}

export default App
