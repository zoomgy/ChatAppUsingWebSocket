import { useState } from 'react'
import Home from './pages/Home'
import Chat from './pages/Chat';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/chat' element={<Chat/>}></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
