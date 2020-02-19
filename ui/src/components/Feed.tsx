import React from 'react'
import { List, ListItem } from 'semantic-ui-react';
import { Message } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { useParty, useQuery } from '@daml/react';

/**
 * React component to show a feed of messages for the current user.
 */
const Feed: React.FC = () => {
  const username = useParty();
  const messagesResult = useQuery(Message, () => ({receiver: username}), []);
  const messages = messagesResult.contracts.map(message => message.payload);

  const showMessage = (message: Message): string => {
    return (message.sender + ": " + message.content);
  }

  return (
    <List relaxed>
      {messages.map(message => <ListItem>{showMessage(message)}</ListItem>)}
    </List>
  );
}

export default Feed;
