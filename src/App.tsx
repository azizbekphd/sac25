import * as cover from './utils/tile-cover'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Impacts } from './routes/Impacts/Impacts'

function App() {
  return <Routes>
    <Route path="/" element={ <p>1</p> } />
    <Route path="/sac25/impact/" element={ <Impacts /> } />
    <Route path="/sac25/amogus/" element={
      <p>{ JSON.stringify(cover.tiles({ type: 'Point', coordinates: [27.987695, 86.925267]}, { max_zoom: 14, min_zoom: 7 })) }</p>
    } />
  </Routes>
}

export default App
