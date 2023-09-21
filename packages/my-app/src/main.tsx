import 'reflect-metadata';
import './index.css';

import {
  APP_CONFIG_SERVICE,
  IApplicationConfig,
  initializeConTainer,
} from './providers';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

const bootstrap = async () => {
  const conTainer = initializeConTainer();

  try {
    await conTainer
      .get<IApplicationConfig>(APP_CONFIG_SERVICE)
      .waitTillConfigIsSynced();
  } catch (error) {
    console.log(error);
  }
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

bootstrap();
