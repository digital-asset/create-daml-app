import * as daml from '@daml/types';
export declare type Set<a_aauw> = {
    textMap: {
        [key: string]: {};
    };
};
export declare const Set: <a_aauw>(a_aauw: daml.Serializable<a_aauw>) => daml.Serializable<Set<a_aauw>>;
