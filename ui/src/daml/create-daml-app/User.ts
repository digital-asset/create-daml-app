// Generated from User.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from './../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template';

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
} = {
  templateId: 'a8210e1fa0121192b9a02d42e9faf7a05ba061fe79a418668d6e7fff061b2020:User:User',
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
};
daml.registerTemplate(User);
