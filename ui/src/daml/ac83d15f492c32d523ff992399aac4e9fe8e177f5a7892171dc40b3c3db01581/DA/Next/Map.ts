// Generated from DA/Next/Map.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

export type Map<k_a9I7, v_a9I8> = {
  textMap: { [key: string]: v_a9I8 };
}
export const Map = <k_a9I7, v_a9I8>(k_a9I7: daml.Serializable<k_a9I7>, v_a9I8: daml.Serializable<v_a9I8>): daml.Serializable<Map<k_a9I7, v_a9I8>> => ({
  decoder: () => jtv.object({
    textMap: daml.TextMap(v_a9I8).decoder(),
  }),
})
