import React from 'react';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import DamlLedger from '../daml-react/DamlLedger';
import Credentials from '../daml-react/credentials';

/**
 * React component for the entry point into the application.
 */
const App: React.FC = () => {
  const [credentials, setCredentials] = React.useState<Credentials | undefined>();

  return credentials
    ? <DamlLedger credentials={credentials}>
        <MainScreen onLogout={() => setCredentials(undefined)}/>
      </DamlLedger>
    : <LoginScreen onLogin={setCredentials} />
}

export default App;
