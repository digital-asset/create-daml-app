import React from 'react'
import { Form, Input, Dropdown, Button } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { useParty, useExerciseByKey } from '@daml/react';

type Props = {
  users: Party[];
}

/**
 * React component to edit a message to send to a friend.
 */
const MessageEdit: React.FC<Props> = ({users}) => {
  const sender = useParty();
  const [receiver, setReceiver] = React.useState('');
  const [content, setContent] = React.useState('');
  const [exerciseSendMessage] = useExerciseByKey(User.SendMessage);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const sendMessage = async (content: string, receiver: string): Promise<boolean> => {
    try {
      await exerciseSendMessage(receiver, {sender, content});
      return true;
    } catch (error) {
      alert("Error sending message:\n" + JSON.stringify(error));
      return false;
    }
  }

  const submitMessage = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await sendMessage(content, receiver);
    setIsSubmitting(false);
    if (success) {
      setReceiver('');
      setContent('');
    }
  }

  // Sorted array of friends of the current user
  const friends =
    users
    .filter(user => user !== sender)
    .sort((x, y) => x.localeCompare(y))

  // Options for dropdown menu
  const friendOptions = friends.map((f) => ({ key: f, text: f, value: f }));

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
