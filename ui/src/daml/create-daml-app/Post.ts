// Generated from Post.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template from './../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template';

export type Post = {
  author: daml.Party;
  content: string;
  sharingWith: daml.Party[];
}
export const Post: daml.Template<Post, undefined> & {
  Archive: daml.Choice<Post, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive, {}, undefined>;
} = {
  templateId: '683c86bd70a2b335e45f5fb6fdcada320e9673566c584fe9902be95bf8e0eccb:Post:Post',
  keyDecoder: () => jtv.constant(undefined),
  decoder: () => jtv.object({
    author: daml.Party.decoder(),
    content: daml.Text.decoder(),
    sharingWith: daml.List(daml.Party).decoder(),
  }),
  Archive: {
    template: () => Post,
    choiceName: 'Archive',
    argumentDecoder: pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive.decoder,
    resultDecoder: () => daml.Unit.decoder(),
  },
};
daml.registerTemplate(Post);
