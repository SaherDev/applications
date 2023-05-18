import './App.scss';
import '@application/styles';

import { useCallback, useState } from 'react';

import { Button } from '@application/common';
import { IUser } from '@/models';
import { MAIN_PAGE_MESSAGE } from '@/config';
import reactLogo from './assets/react.svg';
import { roleService } from './providers/role.service';
import { userService } from '@/providers';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<IUser>({
    userName: '',
  });
  const [permissions, setPermissions] = useState<string[]>([]);
  const loginHandler = useCallback(async () => {
    const response = await userService.login('string', 'string');

    if (!response) {
      alert('login failed');
      return;
    }

    setUser({
      userName: response.userName,
    });
  }, [user]);

  const createRoleHandler = useCallback(async () => {
    const response = await roleService.createRole(new Date().toISOString(), [
      'permission-1',
      'permission-2',
    ]);

    if (!response) {
      alert('creation failed');
      return;
    }
    setPermissions(response.permissions);
  }, []);

  return (
    <div className="">
      <Button onClick={loginHandler}>
        <h3>login</h3>
      </Button>
      <Button onClick={createRoleHandler}>
        <h3>create Role </h3>
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
      <h3> {permissions.concat('_')}</h3>
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
