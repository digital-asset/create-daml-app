import * as daml from '@daml/types';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from './../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template';
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
export declare const User: daml.Template<User, User.Key, '5944e48e36e9b9382b0876c3fa700de2966a82e7bec9552ef92c1f8185d5814f:User:User'> & {
    AddFriend: daml.Choice<User, AddFriend, daml.ContractId<User>, User.Key>;
    Archive: daml.Choice<User, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive, {}, User.Key>;
    RemoveFriend: daml.Choice<User, RemoveFriend, daml.ContractId<User>, User.Key>;
};
export declare namespace User {
    type Key = daml.Party;
}
