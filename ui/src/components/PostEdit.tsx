import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react';
import { Text } from '@digitalasset/daml-json-types';

type Props = {
  writePost: (content: Text, sharingWith: string) => Promise<boolean>;
}

/**
 * React component to edit a post to share with a bunch of friends.
 */
const PostEdit: React.FC<Props> = ({writePost}) => {
  const [content, setContent] = React.useState('');
  const [sharingWith, setSharingWith] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submitPost = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await writePost(content, sharingWith);
    setIsSubmitting(false);
    if (success) {
      setContent('');
      setSharingWith('');
    }
  }

  return (
    <Form onSubmit={submitPost}>
      <Input
        fluid
        transparent
        readOnly={isSubmitting}
        loading={isSubmitting}
        placeholder="What's on your mind?"
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />
      <br />
      <Input
        fluid
        transparent
        readOnly={isSubmitting}
        loading={isSubmitting}
        placeholder='Friends to share this with'
        value={sharingWith}
        onChange={(event) => setSharingWith(event.currentTarget.value)}
      />
      <br />
      <Button type="submit">Post</Button>
    </Form>
  );
};

export default PostEdit;
