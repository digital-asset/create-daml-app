import React from 'react'
import { List } from 'semantic-ui-react'
import ListActionItem from './ListActionItem';
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
      {[...users].sort((x, y) => x.username.localeCompare(y.username)).map((user) =>
        <ListActionItem
          key={user.username}
          icon='user'
          action={{
            icon: 'add user',
            onClick: () => onAddFriend(user.username),
          }}
          outer
        >
          <List.Header>{user.username}</List.Header>
          <List.List>
            {[...user.friends].sort((x, y) => x.localeCompare(y)).map((friend) =>
              <ListActionItem
                key={friend}
                icon='user outline'
                action={{
                  icon: 'add user',
                  onClick: () => onAddFriend(friend),
                }}
              >
                <List.Header>{friend}</List.Header>
              </ListActionItem>
            )}
          </List.List>
        </ListActionItem>
      )}
    </List>
  );
};

export default UserList;
