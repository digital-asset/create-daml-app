import * as daml from '@daml/types';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from '@daml.js/daml-template/DA/Internal/Template';
export declare type RemoveFriend = {
    friend: daml.Party;
};
export declare const RemoveFriend: daml.Serializable<RemoveFriend>;
export declare type AddFriend = {
    friend: daml.Party;
};
export declare const AddFriend: daml.Serializable<AddFriend>;
export declare type User = {
    username: daml.Party;
    friends: daml.Party[];
};
export declare const User: daml.Template<User, User.Key, '3aa5962a30ed7c9b0e90b6d8c8a2f56aa80f90846caaea4500b3507a7df84ed3:User:User'> & {
    AddFriend: daml.Choice<User, AddFriend, daml.ContractId<User>, User.Key>;
    Archive: daml.Choice<User, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive, {}, User.Key>;
    RemoveFriend: daml.Choice<User, RemoveFriend, daml.ContractId<User>, User.Key>;
};
export declare namespace User {
    type Key = daml.Party;
}
