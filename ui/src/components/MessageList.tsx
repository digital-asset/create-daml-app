import React from 'react'
import { List, ListItem } from 'semantic-ui-react';
import { Message } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { useStreamQuery } from '@daml/react';

/**
 * React component displaying the list of messages for the current user.
 */
const MessageList: React.FC = () => {
  const messagesResult = useStreamQuery(Message);

  return (
    <List relaxed>
      {messagesResult.contracts.map(message => {
        const {sender, receiver, content} = message.payload;
        return (
          <ListItem
            className='test-select-message'
            key={message.contractId}>
            <strong>{sender} &rarr; {receiver}:</strong> {content}
          </ListItem>
        );
      })}
    </List>
  );
};

export default MessageList;
