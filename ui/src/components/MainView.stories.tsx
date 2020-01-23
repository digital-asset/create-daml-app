import { storiesOf } from '@storybook/react';
import React from 'react';
import MainView, { Props } from "./MainView";
import { Party } from '@digitalasset/daml-json-types';
import { User } from '../daml/create-daml-app/User';

const addFriend = async (friend: Party): Promise<boolean> => { alert('Add friend: ' + friend); return true; }
const removeFriend = async (friend: Party) => { alert('Remove friend: ' + friend); }
const sendMessage = async (content: string, receivers: string) => { alert('Sending message "' + content + '" to friends ' + receivers); return true; }
const reload = () => { alert('Load all users'); }

const makeProps = (user: User, allUsers: User[]): Props => ({
  myUser: user,
  allUsers,
  messages: [],
  onAddFriend: addFriend,
  onRemoveFriend: removeFriend,
  onMessage: sendMessage,
  onReload: reload,
})

const alice: User = { party: 'Alice', friends: ['Bob', 'Charlie']};
const bob: User = { party: 'Bob', friends: ['Dave']};
const charlie: User = { party: 'Charlie', friends: []}

storiesOf("MainView", module)
  .add("default", () => (
    <>{MainView(makeProps(alice, [alice, bob, charlie]))}</>
  ))
  .add("empty", () => (
    <>{MainView(makeProps(charlie, []))}</>
  ))
  ;
