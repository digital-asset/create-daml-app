import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party } from '@digitalasset/daml-json-types';
import { User } from '../daml/create-daml-app/User';
import { Message } from '../daml/create-daml-app/Message';
import { useParty, useReload, usePseudoExerciseByKey, useFetchByKey, useQuery } from '../daml-react-hooks';
import UserList from './UserList';
import PartyListEdit from './PartyListEdit';
import MessageEdit from './MessageEdit';
import Feed from './Feed';

const MainView: React.FC = () => {
  const party = useParty();
  const myUser = useFetchByKey(User, () => party, [party]).contract?.payload;
  const allUsers = useQuery(User, () => ({}), []).contracts.map((user) => user.payload);
  const messages = useQuery(Message, () => ({}), []).contracts.map((message) => message.payload);
  const reload = useReload();

  const [exerciseAddFriend] = usePseudoExerciseByKey(User.AddFriend);
  const [exerciseRemoveFriend] = usePseudoExerciseByKey(User.RemoveFriend);
  const [exerciseSendMessage] = usePseudoExerciseByKey(User.SendMessage);

  const addFriend = async (friend: Party): Promise<boolean> => {
    try {
      await exerciseAddFriend({party}, {friend});
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  const removeFriend = async (friend: Party): Promise<void> => {
    try {
      await exerciseRemoveFriend({party}, {friend});
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
    }
  }

  const sendMessage = async (content: string, parties: string): Promise<boolean> => {
    try {
      const receivers = parties.replace(/\s/g, "").split(",");
      await exerciseSendMessage({party}, {content, receivers});
      return true;
    } catch (error) {
      alert("Error while sending message:\n" + JSON.stringify(error));
      return false;
    }
  }

  React.useEffect(() => {
    const interval = setInterval(reload, 5000);
    return () => clearInterval(interval);
  }, [reload]);

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUser ? `Welcome, ${myUser.party}!` : 'Loading...'}
            </Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column>
            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {myUser?.party ?? 'Loading...'}
                  <Header.Subheader>Me and my friends</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={myUser?.friends ?? []}
                onAddParty={addFriend}
                onRemoveParty={removeFriend}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='globe' />
                <Header.Content>
                  The Network
                  <Icon
                    link
                    name='sync alternate'
                    size='small'
                    style={{marginLeft: '0.5em'}}
                    onClick={reload}
                  />
                  <Header.Subheader>Others and their friends</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <UserList
                users={allUsers.sort((user1, user2) => user1.party.localeCompare(user2.party))}
                onAddFriend={addFriend}
              />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment>
              <Header as='h2'>
                <Icon name='pencil square' />
                <Header.Content>
                  Messages
                  <Header.Subheader>Send a message to some friends!</Header.Subheader>
                </Header.Content>
              </Header>
              <MessageEdit
                sendMessage={sendMessage}
              />
            <Divider />
            <Feed messages={messages} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
