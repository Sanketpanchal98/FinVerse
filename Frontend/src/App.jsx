import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Hero } from './Partials/Hero'
import { Features } from './Partials/Features'
import { Footer } from './Partials/Footer'
import Header from './Partials/Header'
import { RealLifeScenarios } from './Partials/RealLifeScenarios'
import { GamifiedFinance } from './Partials/GamifiedFinance'

const App = () => {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");

  return (
    <div className={`${theme === "dark" ? "bg-[#2C3E50] text-white" : "bg-[#F4F7F8] text-[#2C3E50]"} font-sans transition-all duration-500`}>
      <Header theme={theme} setTheme={setTheme}/>
      <Hero/>
      <Features id='features'/>
      <RealLifeScenarios />
      <GamifiedFinance />
      <Footer />
    </div>
  )
}

export default App
