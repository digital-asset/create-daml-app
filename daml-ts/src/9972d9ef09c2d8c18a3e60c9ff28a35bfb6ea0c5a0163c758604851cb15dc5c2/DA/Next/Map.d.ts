import * as daml from '@daml/types';
export declare type Map<k_a9Pz, v_a9PA> = {
    textMap: {
        [key: string]: v_a9PA;
    };
};
export declare const Map: <k_a9Pz, v_a9PA>(k_a9Pz: daml.Serializable<k_a9Pz>, v_a9PA: daml.Serializable<v_a9PA>) => daml.Serializable<Map<k_a9Pz, v_a9PA>>;
