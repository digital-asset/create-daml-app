import React from 'react'
import { List } from 'semantic-ui-react'
import ListActionItem from './ListActionItem';
import { Party } from '@daml/types';
import { User } from '@daml2ts/create-daml-app/src/create-daml-app/User';

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
      {users.map((user) =>
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
            {user.friends.map((friend) =>
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
