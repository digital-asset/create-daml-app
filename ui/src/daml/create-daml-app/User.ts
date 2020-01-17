// Generated from User.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from './../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template';
import * as post from './Post';

export type WritePost = {
  content: string;
  sharingWith: daml.Party[];
}
export const WritePost: daml.Serializable<WritePost> = ({
  decoder: () => jtv.object({
    content: daml.Text.decoder(),
    sharingWith: daml.List(daml.Party).decoder(),
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
  WritePost: daml.Choice<User, WritePost, daml.ContractId<post.Post>, daml.Party>;
} = {
  templateId: '683c86bd70a2b335e45f5fb6fdcada320e9673566c584fe9902be95bf8e0eccb:User:User',
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
  WritePost: {
    template: () => User,
    choiceName: 'WritePost',
    argumentDecoder: WritePost.decoder,
    resultDecoder: () => daml.ContractId(post.Post).decoder(),
  },
};
daml.registerTemplate(User);
