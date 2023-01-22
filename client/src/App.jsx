import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
     <h1>Welcome</h1>
     <a href="/Login">LOGIN</a>
    </div>
  )
}

export default App
