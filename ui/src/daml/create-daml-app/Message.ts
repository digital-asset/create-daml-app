// Generated from Message.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from './../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template';

export type Message = {
  sender: daml.Party;
  content: string;
  receivers: daml.Party[];
}
export const Message: daml.Template<Message, undefined> & {
  Archive: daml.Choice<Message, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive, {}, undefined>;
} = {
  templateId: '3dac2c229edd4e558a5a4ff8898cedb79ad5d45519066f447e3008c28dd5c127:Message:Message',
  keyDecoder: () => jtv.constant(undefined),
  decoder: () => jtv.object({
    sender: daml.Party.decoder(),
    content: daml.Text.decoder(),
    receivers: daml.List(daml.Party).decoder(),
  }),
  Archive: {
    template: () => Message,
    choiceName: 'Archive',
    argumentDecoder: pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive.decoder,
    resultDecoder: () => daml.Unit.decoder(),
  },
};
daml.registerTemplate(Message);
