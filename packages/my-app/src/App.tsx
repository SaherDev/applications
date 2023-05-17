import './App.scss';
import '@application/styles';

import { Button } from '@application/common';
import { MAIN_PAGE_MESSAGE } from '@/config';
import { formatDate } from '@application/utilities';
import reactLogo from './assets/react.svg';
import { serviceA } from '@/services';
import { useState } from 'react';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  // console.log(formatDate(new Date()));

  return (
    <div className="">
      <Button onClick={() => {}} disabled>
        <h1>Vite + React</h1>
      </Button>
      <span className="icon-test2-16 icon-size-16-16 "></span>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{MAIN_PAGE_MESSAGE}</h1>
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
  );
}

export default App;
