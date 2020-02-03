import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@daml/types';
export declare type MetaSel0 = {
    mbRecordName: daml.Optional<{}>;
    sourceUnpackedness: SourceUnpackedness;
    sourceStrictness: SourceStrictness;
};
export declare const MetaSel0: daml.Serializable<MetaSel0>;
export declare type MetaData0 = {
    name: {};
    module_: {};
    package: {};
    isNewType: boolean;
};
export declare const MetaData0: daml.Serializable<MetaData0>;
export declare enum DecidedStrictness {
    DecidedLazy = "DecidedLazy",
    DecidedStrict = "DecidedStrict",
    DecidedUnpack = "DecidedUnpack"
}
export declare namespace DecidedStrictness {
    const decoder: () => jtv.Decoder<DecidedStrictness>;
}
export declare enum SourceStrictness {
    NoSourceStrictness = "NoSourceStrictness",
    SourceLazy = "SourceLazy",
    SourceStrict = "SourceStrict"
}
export declare namespace SourceStrictness {
    const decoder: () => jtv.Decoder<SourceStrictness>;
}
export declare enum SourceUnpackedness {
    NoSourceUnpackedness = "NoSourceUnpackedness",
    SourceNoUnpack = "SourceNoUnpack",
    SourceUnpack = "SourceUnpack"
}
export declare namespace SourceUnpackedness {
    const decoder: () => jtv.Decoder<SourceUnpackedness>;
}
export declare enum Associativity {
    LeftAssociative = "LeftAssociative",
    RightAssociative = "RightAssociative",
    NotAssociative = "NotAssociative"
}
export declare namespace Associativity {
    const decoder: () => jtv.Decoder<Associativity>;
}
export declare type Infix0 = {
    associativity: Associativity;
    fixity: daml.Int;
};
export declare const Infix0: daml.Serializable<Infix0>;
export declare type Fixity = {
    tag: 'Prefix';
    value: {};
} | {
    tag: 'Infix';
    value: Infix0;
};
export declare const Fixity: daml.Serializable<Fixity> & {};
export declare type K1<i_a2De, c_a2Df, p_a2Dg> = {
    unK1: c_a2Df;
};
export declare const K1: <i_a2De, c_a2Df, p_a2Dg>(i_a2De: daml.Serializable<i_a2De>, c_a2Df: daml.Serializable<c_a2Df>, p_a2Dg: daml.Serializable<p_a2Dg>) => daml.Serializable<K1<i_a2De, c_a2Df, p_a2Dg>>;
export declare type Par1<p_a2Dj> = {
    unPar1: p_a2Dj;
};
export declare const Par1: <p_a2Dj>(p_a2Dj: daml.Serializable<p_a2Dj>) => daml.Serializable<Par1<p_a2Dj>>;
export declare type U1<p_a2Dk> = {};
export declare const U1: <p_a2Dk>(p_a2Dk: daml.Serializable<p_a2Dk>) => daml.Serializable<U1<p_a2Dk>>;
