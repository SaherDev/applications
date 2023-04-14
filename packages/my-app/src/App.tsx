import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@monorepo/common/dist'
import { formatDate } from '@monorepo/utilities/dist'
import {kkfkjfk} from  "@/services"
function App() {
  const [count, setCount] = useState(0)
  
 console.log( formatDate(new Date))

  return (
    <div className={'button'}>
      <Button onClick={()=>{}} disabled={true} >

      <h1>Vite + React</h1>

      </Button>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App