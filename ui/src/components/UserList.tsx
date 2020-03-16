import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { Party } from '@daml/types';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';

type Props = {
  users: User[];
  onAddFriend: (friend: Party) => void;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const UserList: React.FC<Props> = ({users, onAddFriend}) => {
  return (
    <List divided relaxed>
      {[...users].sort((x, y) => x.username.localeCompare(y.username)).map(user =>
        <List.Item key={user.username}>
          <List.Icon name='user' />
          <List.Content>
            <List.Content floated='right'>
              <Icon
                name='add user'
                link
                className='test-select-add-user-icon'
                onClick={() => onAddFriend(user.username)} />
            </List.Content>
            <List.Header className='test-select-user-in-network'>{user.username}</List.Header>
          </List.Content>
          <List.List>
            {[...user.friends].sort((x, y) => x.localeCompare(y)).map(friend =>
              <List.Item key={friend}>
                <List.Content floated='right'>
                  <Icon
                    name='add user'
                    link
                    className='test-select-add-friend-of-user-icon'
                    onClick={() => onAddFriend(friend)} />
                </List.Content>
                <List.Icon name='user outline' />
                <List.Content>
                  <List.Header>{friend}</List.Header>
                </List.Content>
              </List.Item>
            )}
          </List.List>
        </List.Item>
      )}
    </List>
  );
};

export default UserList;
