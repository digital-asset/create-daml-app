// Generated from DA/Next/Map.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@daml/types';

export type Map<k_a9Pz, v_a9PA> = {
  textMap: { [key: string]: v_a9PA };
}
export const Map = <k_a9Pz, v_a9PA>(k_a9Pz: daml.Serializable<k_a9Pz>, v_a9PA: daml.Serializable<v_a9PA>): daml.Serializable<Map<k_a9Pz, v_a9PA>> => ({
  decoder: () => jtv.object({
    textMap: daml.TextMap(v_a9PA).decoder(),
  }),
})
