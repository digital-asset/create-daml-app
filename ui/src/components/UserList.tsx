import React from 'react'
import { List } from 'semantic-ui-react'
import ListActionItem from './ListActionItem';
import { Party } from '@digitalasset/daml-json-types';
import { User } from '../daml/create-daml-app/User';

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
      {users.map((u) =>
        <ListActionItem
          key={u.user}
          icon='user'
          action={{
            icon: 'add user',
            onClick: () => onAddFriend(u.user),
          }}
          outer
        >
          <List.Header>{u.user}</List.Header>
          <List.List>
            {u.friends.map((friend) =>
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
