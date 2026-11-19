import './App.css'
import Navbar from './components/Navbar'
import VehicleCard from './components/VehicleCard'
import { useState } from 'react'


const colors = [
  { name: 'Obsidian Black', value: '#111111' },
  { name: 'Polar White', value: '#f5f5f5' },
  { name: 'Selenite Grey', value: '#777777' },
  { name: 'Hyacinth Red', value: '#8b0000' },
  { name: 'Brilliant Blue', value: '#174ea6' },
]

function App() {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  
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
       <h2>Exterior Colour</h2>

  <div
    style={{
      width: '100%',
      height: '150px',
      backgroundColor: selectedColor.value,
      borderRadius: '12px',
    }}
  />

  <p>Selected: {selectedColor.name}</p>
  <div>
  {colors.map((color) => (
    <button
      key={color.name}
      onClick={() => setSelectedColor(color)}
      style={{
        backgroundColor: color.value,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        margin: '8px',
        outline: 'none',
        cursor: 'pointer',
        border: selectedColor.name === color.name
         ? '3px solid #2563eb'
         : '1px solid #999',
      }}
      aria-label={color.name}
      
    />
  ))}
</div>
    </div>
  )
}

export default App