import React from 'react'
import { Form, Input, Dropdown, Button } from 'semantic-ui-react';
import { Text } from '@daml/types';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';

type Props = {
  friends: User[];
  sendMessage: (content: Text, receiver: string) => Promise<boolean>;
}

/**
 * React component to edit a message to send to a friend.
 */
const MessageEdit: React.FC<Props> = ({friends, sendMessage}) => {
  const [content, setContent] = React.useState('');
  const [receiver, setReceiver] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submitMessage = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await sendMessage(content, receiver);
    setIsSubmitting(false);
    if (success) {
      setContent('');
      setReceiver('');
    }
  }

  const friendOptions =
    [...friends]
    .map((friend) => friend.username)
    .sort((x, y) => x.localeCompare(y))
    .map((friend) => (
      { key: friend,
        text: friend,
        value: friend }));

  return (
    <Form onSubmit={submitMessage}>
      <Dropdown
        fluid
        selection
        placeholder='Select friend'
        options={friendOptions}
        value={receiver}
        onChange={(event) => setReceiver(event.currentTarget.textContent ?? '')}
      />
      <br />
      <Input
        fluid
        transparent
        readOnly={isSubmitting}
        loading={isSubmitting}
        placeholder="Write a message"
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />
      <br />
      <Button type="submit">Send</Button>
    </Form>
  );
};

export default MessageEdit;
