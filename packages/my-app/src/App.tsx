import './App.scss';
import '@application/styles';

import { AUTH_SIGN_IN_URL, MAIN_PAGE_MESSAGE } from '@/config';
import { useCallback, useState } from 'react';

import { Button } from '@application/common';
import { IUser } from '@/models';
import { formatDate } from '@application/utilities';
import { httpService } from '@/services';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<IUser>({
    userName: '',
  });
  // console.log(formatDate(new Date()));

  const loginHandler = useCallback(async () => {
    let response: IUser | null = null;
    try {
      response = await httpService.fetch<IUser>(AUTH_SIGN_IN_URL, 'POST', {
        data: {
          userName: 'string',
          password: 'string',
        },
      });
    } catch (error) {}

    if (!response) return;

    setUser({
      userName: response.userName,
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
      <h3>{`hello : ${user.userName}`}</h3>

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
