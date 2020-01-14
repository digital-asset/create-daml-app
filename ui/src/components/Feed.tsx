import React from 'react'
import { List, ListItem } from 'semantic-ui-react';
import { Post } from '../daml/create-daml-app/Post';

type Props = {
  posts: Post[];
}

/**
 * React component to edit a post to share with a bunch of friends.
 */
const Feed: React.FC<Props> = ({posts}) => {
  const renderPost = (post: Post): string => {
    const author = post.author;
    const content = post.content;
    return (author + " says: " + content);
  }

  return (
    <List relaxed>
      {posts.map((post) => <ListItem>{renderPost(post)}</ListItem>)}
    </List>
  );
}

export default Feed;
