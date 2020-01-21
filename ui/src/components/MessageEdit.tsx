import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react';
import { Text } from '@digitalasset/daml-json-types';

type Props = {
  sendMessage: (content: Text, sharingWith: string) => Promise<boolean>;
}

/**
 * React component to edit a message to send to a friend.
 */
const MessageEdit: React.FC<Props> = ({sendMessage}) => {
  const [content, setContent] = React.useState('');
  const [sharingWith, setSharingWith] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submitMessage = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await sendMessage(content, sharingWith);
    setIsSubmitting(false);
    if (success) {
      setContent('');
      setSharingWith('');
    }
  }

  return (
    <Form onSubmit={submitMessage}>
      <Input
        fluid
        transparent
        readOnly={isSubmitting}
        loading={isSubmitting}
        placeholder="Send a message"
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />
      <br />
      <Input
        fluid
        transparent
        readOnly={isSubmitting}
        loading={isSubmitting}
        placeholder='Select a friend'
        value={sharingWith}
        onChange={(event) => setSharingWith(event.currentTarget.value)}
      />
      <br />
      <Button type="submit">Send</Button>
    </Form>
  );
};

export default MessageEdit;
