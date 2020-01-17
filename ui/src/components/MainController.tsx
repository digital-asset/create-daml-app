import React from 'react';
import MainView from './MainView';
import { Party } from '@digitalasset/daml-json-types';
import { User } from '../daml/create-daml-app/User';
import { Post } from '../daml/create-daml-app/Post';
import { useParty, useReload, usePseudoExerciseByKey, useFetchByKey, useQuery } from '../daml-react-hooks';

/**
 * React component to control the `MainView`.
 */
const MainController: React.FC = () => {
  const party = useParty();
  const myUser = useFetchByKey(User, () => party, [party]);
  const allUsers = useQuery(User, () => ({}), []);
  const posts = useQuery(Post, () => ({}), []);
  const reload = useReload();

  const [exerciseAddFriend] = usePseudoExerciseByKey(User.AddFriend);
  const [exerciseRemoveFriend] = usePseudoExerciseByKey(User.RemoveFriend);
  const [exerciseWritePost] = usePseudoExerciseByKey(User.WritePost);

  const addFriend = async (friend: Party): Promise<boolean> => {
    try {
      await exerciseAddFriend({party}, {friend});
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  const removeFriend = async (friend: Party): Promise<void> => {
    try {
      await exerciseRemoveFriend({party}, {friend});
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
    }
  }

  const writePost = async (content: string, parties: string): Promise<boolean> => {
    try {
      const sharingWith = parties.replace(/\s/g, "").split(",");
      await exerciseWritePost({party}, {content, sharingWith});
      return true;
    } catch (error) {
      alert("Unknown error while writing post:\n" + JSON.stringify(error));
      return false;
    }
  }

  React.useEffect(() => {
    const interval = setInterval(reload, 5000);
    return () => clearInterval(interval);
  }, [reload]);

  const props = {
    myUser: myUser.contract?.payload,
    allUsers: allUsers.contracts.map((user) => user.payload),
    posts: posts.contracts.map((post) => post.payload),
    onAddFriend: addFriend,
    onRemoveFriend: removeFriend,
    onPost: writePost,
    onReload: reload,
  };

  return MainView(props);
}

export default MainController;
