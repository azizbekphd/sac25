import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Impacts } from './routes/Impacts/Impacts'

function App() {
  return <Routes>
    <Route path='sac25'>
      <Route index element={<p>1</p>} />
      <Route path='impact' element={ <Impacts /> } />
    </Route>
  </Routes>
}

export default App
