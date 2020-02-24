import React from 'react'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import Credentials, { computeCredentials } from '../Credentials';
import Ledger from '@daml/ledger';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';

type Props = {
  onLogin: (credentials: Credentials) => void;
}

/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({onLogin}) => {
  const [username, setUsername] = React.useState('');

  const handleLogin = async (event?: React.FormEvent) => {
    try {
      if (event) {
        event.preventDefault();
      }
      const credentials = computeCredentials(username);
      const ledger = new Ledger({token: credentials.token});
      const user = await ledger.lookupByKey(User, username);
      if (user === null) {
        alert("You have not yet signed up.");
        return;
      }
      onLogin(credentials);
    } catch(error) {
      alert("Unknown error:\n" + error);
    }
  }

  const handleSignup = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const credentials = computeCredentials(username);
      const ledger = new Ledger({token: credentials.token});
      const user: User = {username, friends: []};
      await ledger.create(User, user);
      await handleLogin();
    } catch(error) {
        // const {errors} = error;
        // if (errors.length === 1 && errors[0].includes("DuplicateKey")) {
        //   alert("You are already signed up.");
        //   return;
        // }
      alert("Unknown error:\n" + JSON.stringify(error));
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center' size='huge' style={{color: '#223668'}}>
          <Header.Content>
            Create
            <Image
              as='a'
              href='https://www.daml.com/'
              target='_blank'
              src='/daml.svg'
              alt='DAML Logo'
              spaced
              size='small'
              verticalAlign='middle'
            />
            App
          </Header.Content>
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
            />
            <Button.Group fluid size='large'>
              <Button
                primary
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button
                secondary
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Button.Group>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginScreen;
