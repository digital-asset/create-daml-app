// Generated from DA/Next/Set.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@daml/types';

export type Set<a_aauw> = {
  textMap: { [key: string]: {} };
}
export const Set = <a_aauw>(a_aauw: daml.Serializable<a_aauw>): daml.Serializable<Set<a_aauw>> => ({
  decoder: () => jtv.object({
    textMap: daml.TextMap(daml.Unit).decoder(),
  }),
})
