import * as daml from '@daml/types';
export declare type CompletionStatus = {
    tag: 'Failed';
    value: CompletionStatus.Failed;
} | {
    tag: 'Succeeded';
    value: CompletionStatus.Succeeded;
};
export declare const CompletionStatus: daml.Serializable<CompletionStatus> & {
    Failed: daml.Serializable<CompletionStatus.Failed>;
    Succeeded: daml.Serializable<CompletionStatus.Succeeded>;
};
export declare namespace CompletionStatus {
    type Failed = {
        status: daml.Int;
        message: string;
    };
}
export declare namespace CompletionStatus {
    type Succeeded = {
        transactionId: TransactionId;
    };
}
export declare type Completion = {
    commandId: CommandId;
    status: CompletionStatus;
};
export declare const Completion: daml.Serializable<Completion>;
export declare type CommandId = {
    unpack: string;
};
export declare const CommandId: daml.Serializable<CommandId>;
export declare type EventId = {
    unpack: string;
};
export declare const EventId: daml.Serializable<EventId>;
export declare type TransactionId = {
    unpack: string;
};
export declare const TransactionId: daml.Serializable<TransactionId>;
