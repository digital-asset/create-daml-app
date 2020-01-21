import React from 'react'
import { List, ListItem } from 'semantic-ui-react';
import { Message } from '../daml/create-daml-app/Message';

type Props = {
  messages: Message[];
}

/**
 * React component to edit a post to share with a bunch of friends.
 */
const Feed: React.FC<Props> = ({messages}) => {
  const showMessage = (message: Message): string => {
    return (message.sender + " says: " + message.content);
  }

  return (
    <List relaxed>
      {messages.map((message) => <ListItem>{showMessage(message)}</ListItem>)}
    </List>
  );
}

export default Feed;
