import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import muiTheme from './styles/muiTheme';

import './index.css';
import router from './routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={muiTheme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);
