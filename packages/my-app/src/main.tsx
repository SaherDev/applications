import './index.css';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { configService } from '@/providers/app-config.service';

const bootstrap = async () => {
  try {
    await configService.waitTillConfigIsSynced();
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
