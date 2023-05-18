import './App.scss';
import '@application/styles';

import { AUTH_SERVICE_BASE_URL, MAIN_PAGE_MESSAGE } from '@/config';
import { useCallback, useState } from 'react';

import { Button } from '@application/common';
import { formatDate } from '@application/utilities';
import reactLogo from './assets/react.svg';
import { serviceA } from '@/services';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<any>({
    name: '',
  });
  // console.log(formatDate(new Date()));

  const loginHandler = useCallback(async () => {
    const response = await fetch(`${AUTH_SERVICE_BASE_URL}/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: 'string',
        password: 'string',
      }),
    });

    const data = await response.json();

    if (!response.ok || response.status === 403) {
      throw new Error(data.message || 'Forbidden');
    }
    setUser({
      name: data.userName,
    });
  }, [user]);

  return (
    <div className="">
      <Button onClick={loginHandler}>
        <h3>login</h3>
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
      <h3>{`hello : ${user.name}`}</h3>

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
