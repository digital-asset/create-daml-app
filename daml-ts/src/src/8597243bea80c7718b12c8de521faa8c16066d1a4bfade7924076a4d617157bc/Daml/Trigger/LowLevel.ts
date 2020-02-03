// Generated from Daml/Trigger/LowLevel.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@daml/types';

export type CompletionStatus = 
  |  { tag: 'Failed'; value: CompletionStatus.Failed }
  |  { tag: 'Succeeded'; value: CompletionStatus.Succeeded }
export const CompletionStatus:
  daml.Serializable<CompletionStatus> & {
    Failed: daml.Serializable<CompletionStatus.Failed>;
    Succeeded: daml.Serializable<CompletionStatus.Succeeded>;
  } = ({
  decoder: () => jtv.oneOf<CompletionStatus>(
    jtv.object({tag: jtv.constant('Failed'), value: jtv.lazy(() => CompletionStatus.Failed.decoder())}),
    jtv.object({tag: jtv.constant('Succeeded'), value: jtv.lazy(() => CompletionStatus.Succeeded.decoder())}),
  ),
  Failed: ({
    decoder: () => jtv.object({
      status: daml.Int.decoder(),
      message: daml.Text.decoder(),
    }),
  }),
  Succeeded: ({
    decoder: () => jtv.object({
      transactionId: TransactionId.decoder(),
    }),
  }),
});
daml.STATIC_IMPLEMENTS_SERIALIZABLE_CHECK<CompletionStatus>(CompletionStatus)

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompletionStatus {
  export type Failed = {
    status: daml.Int;
    message: string;
  }
} //namespace CompletionStatus

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompletionStatus {
  export type Succeeded = {
    transactionId: TransactionId;
  }
} //namespace CompletionStatus

export type Completion = {
  commandId: CommandId;
  status: CompletionStatus;
}
export const Completion: daml.Serializable<Completion> = ({
  decoder: () => jtv.object({
    commandId: CommandId.decoder(),
    status: CompletionStatus.decoder(),
  }),
})

export type CommandId = {
  unpack: string;
}
export const CommandId: daml.Serializable<CommandId> = ({
  decoder: () => jtv.object({
    unpack: daml.Text.decoder(),
  }),
})

export type EventId = {
  unpack: string;
}
export const EventId: daml.Serializable<EventId> = ({
  decoder: () => jtv.object({
    unpack: daml.Text.decoder(),
  }),
})

export type TransactionId = {
  unpack: string;
}
export const TransactionId: daml.Serializable<TransactionId> = ({
  decoder: () => jtv.object({
    unpack: daml.Text.decoder(),
  }),
})
