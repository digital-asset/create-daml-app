// Generated from Message.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from './../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template';

export type Message = {
  sender: daml.Party;
  receiver: daml.Party;
  content: string;
}
export const Message: daml.Template<Message, undefined> & {
  Archive: daml.Choice<Message, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive, {}, undefined>;
} = {
  templateId: 'a8e738599894aaf6c4a173614c38c900ff449e637a679c7b2ef4e86be26ebee4:Message:Message',
  keyDecoder: () => jtv.constant(undefined),
  decoder: () => jtv.object({
    sender: daml.Party.decoder(),
    receiver: daml.Party.decoder(),
    content: daml.Text.decoder(),
  }),
  Archive: {
    template: () => Message,
    choiceName: 'Archive',
    argumentDecoder: pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive.decoder,
    resultDecoder: () => daml.Unit.decoder(),
  },
};
daml.registerTemplate(Message);
