import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import PartyListEdit from './PartyListEdit';
import UserList from './UserList';
import { User } from '../daml/create-daml-app/User';
import { Post } from '../daml/create-daml-app/Post';
import { Party } from '@digitalasset/daml-json-types';
import PostEdit from './PostEdit';
import Feed from './Feed';

export type Props = {
  myUser: User | undefined;
  allUsers: User[];
  posts: Post[];
  onAddFriend: (friend: Party) => Promise<boolean>;
  onRemoveFriend: (friend: Party) => Promise<void>;
  onPost: (content: string, parties: string) => Promise<boolean>;
  onReload: () => void;
}

/**
 * React component for the view of the `MainScreen`.
 */
const MainView: React.FC<Props> = (props) => {
  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {props.myUser ? `Welcome, ${props.myUser.party}!` : 'Loading...'}
            </Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column>
            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {props.myUser?.party ?? 'Loading...'}
                  <Header.Subheader>Me and my friends</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={props.myUser?.friends ?? []}
                onAddParty={props.onAddFriend}
                onRemoveParty={props.onRemoveFriend}
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
                    onClick={props.onReload}
                  />
                  <Header.Subheader>Others and their friends</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <UserList
                users={props.allUsers.sort((user1, user2) => user1.party.localeCompare(user2.party))}
                onAddFriend={props.onAddFriend}
              />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment>
              <Header as='h2'>
                <Icon name='pencil square' />
                <Header.Content>
                  Posts
                  <Header.Subheader>Share a post with some friends</Header.Subheader>
                </Header.Content>
              </Header>
              <PostEdit
                writePost={props.onPost}
              />
            <Divider />
            <Feed posts={props.posts} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
