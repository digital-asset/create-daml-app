// Generated from DA/Next/Set.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

export type Set<a_aan4> = {
  textMap: { [key: string]: {} };
}
export const Set = <a_aan4>(a_aan4: daml.Serializable<a_aan4>): daml.Serializable<Set<a_aan4>> => ({
  decoder: () => jtv.object({
    textMap: daml.TextMap(daml.Unit).decoder(),
  }),
})
