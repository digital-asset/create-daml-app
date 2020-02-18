// Generated from User.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@daml/types';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from '@daml.js/daml-template/lib/DA/Internal/Template';

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
  username: daml.Party;
  friends: daml.Party[];
}
export const User: daml.Template<User, User.Key, '3aa5962a30ed7c9b0e90b6d8c8a2f56aa80f90846caaea4500b3507a7df84ed3:User:User'> & {
  AddFriend: daml.Choice<User, AddFriend, daml.ContractId<User>, User.Key>;
  Archive: daml.Choice<User, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive, {}, User.Key>;
  RemoveFriend: daml.Choice<User, RemoveFriend, daml.ContractId<User>, User.Key>;
} = {
  templateId: '3aa5962a30ed7c9b0e90b6d8c8a2f56aa80f90846caaea4500b3507a7df84ed3:User:User',
  keyDecoder: () => daml.Party.decoder(),
  decoder: () => jtv.object({
    username: daml.Party.decoder(),
    friends: daml.List(daml.Party).decoder(),
  }),
  AddFriend: {
    template: () => User,
    choiceName: 'AddFriend',
    argumentDecoder: AddFriend.decoder,
    resultDecoder: () => daml.ContractId(User).decoder(),
  },
  Archive: {
    template: () => User,
    choiceName: 'Archive',
    argumentDecoder: pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive.decoder,
    resultDecoder: () => daml.Unit.decoder(),
  },
  RemoveFriend: {
    template: () => User,
    choiceName: 'RemoveFriend',
    argumentDecoder: RemoveFriend.decoder,
    resultDecoder: () => daml.ContractId(User).decoder(),
  },
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace User {
  export type Key = daml.Party
}
daml.registerTemplate(User);
