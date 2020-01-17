// Generated from DA/Upgrade.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

export type MetaEquiv<m1_a4NE, m2_a4NF> = {
}
export const MetaEquiv = <m1_a4NE, m2_a4NF>(m1_a4NE: daml.Serializable<m1_a4NE>, m2_a4NF: daml.Serializable<m2_a4NF>): daml.Serializable<MetaEquiv<m1_a4NE, m2_a4NF>> => ({
  decoder: () => jtv.object({
  }),
})
