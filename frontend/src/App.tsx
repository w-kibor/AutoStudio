import './App.css'
import Navbar from './components/Navbar'
import VehicleCard from './components/VehicleCard'


function App() {
  
  return (
    <div>
      <Navbar />
      <VehicleCard
  name="C-Class"
  brand="Mercedes-Benz"
  year={2026}
/>
<VehicleCard
  name="911 Carrera"
  brand="Porsche"
  year={2026}
/>
      <h1>Welcome to AutoStudio</h1>
      <p>Build your dream car, one detail at a time.</p>
    </div>
  )
}

export default App