import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import './App.css';
import Main from './pages/Main';
import { BrowserRouter } from 'react-router-dom';
import Admin from './pages/Admin';
import { ContextProvider } from './utils/context';

function App() {

  console.log('Window location ', window.location.host.split(/\./)[0]);

  return (
    <ContextProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications />
        <BrowserRouter basename='/'>
          {window.location.host.split(/\./)[0] === 'admin' ? <Admin /> :
            <Main />
          }
        </BrowserRouter>
      </MantineProvider>
    </ContextProvider>
  );
}

export default App;
