// Generated from User.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from './../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template';
import * as Message from './Message';

export type SendMessage = {
  sender: daml.Party;
  content: string;
}
export const SendMessage: daml.Serializable<SendMessage> = ({
  decoder: () => jtv.object({
    sender: daml.Party.decoder(),
    content: daml.Text.decoder(),
  }),
})

export type RemoveFriend = {
  friend: daml.Party;
}
export const RemoveFriend: daml.Serializable<RemoveFriend> = ({
  decoder: () => jtv.object({
    friend: daml.Party.decoder(),
  }),
})

export type AddFriend = {
  friend: daml.Party;
}
export const AddFriend: daml.Serializable<AddFriend> = ({
  decoder: () => jtv.object({
    friend: daml.Party.decoder(),
  }),
})

export type User = {
  party: daml.Party;
  friends: daml.Party[];
}
export const User: daml.Template<User, daml.Party> & {
  AddFriend: daml.Choice<User, AddFriend, daml.ContractId<User>, daml.Party>;
  RemoveFriend: daml.Choice<User, RemoveFriend, daml.ContractId<User>, daml.Party>;
  Archive: daml.Choice<User, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive, {}, daml.Party>;
  SendMessage: daml.Choice<User, SendMessage, daml.ContractId<Message.Message>, daml.Party>;
} = {
  templateId: 'a8e738599894aaf6c4a173614c38c900ff449e637a679c7b2ef4e86be26ebee4:User:User',
  keyDecoder: () => daml.Party.decoder(),
  decoder: () => jtv.object({
    party: daml.Party.decoder(),
    friends: daml.List(daml.Party).decoder(),
  }),
  AddFriend: {
    template: () => User,
    choiceName: 'AddFriend',
    argumentDecoder: AddFriend.decoder,
    resultDecoder: () => daml.ContractId(User).decoder(),
  },
  RemoveFriend: {
    template: () => User,
    choiceName: 'RemoveFriend',
    argumentDecoder: RemoveFriend.decoder,
    resultDecoder: () => daml.ContractId(User).decoder(),
  },
  Archive: {
    template: () => User,
    choiceName: 'Archive',
    argumentDecoder: pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive.decoder,
    resultDecoder: () => daml.Unit.decoder(),
  },
  SendMessage: {
    template: () => User,
    choiceName: 'SendMessage',
    argumentDecoder: SendMessage.decoder,
    resultDecoder: () => daml.ContractId(Message.Message).decoder(),
  },
};
daml.registerTemplate(User);
