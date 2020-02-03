"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated from Daml/Trigger/LowLevel.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
var jtv = require("@mojotech/json-type-validation");
var daml = require("@daml/types");
exports.CompletionStatus = ({
    decoder: function () { return jtv.oneOf(jtv.object({ tag: jtv.constant('Failed'), value: jtv.lazy(function () { return exports.CompletionStatus.Failed.decoder(); }) }), jtv.object({ tag: jtv.constant('Succeeded'), value: jtv.lazy(function () { return exports.CompletionStatus.Succeeded.decoder(); }) })); },
    Failed: ({
        decoder: function () { return jtv.object({
            status: daml.Int.decoder(),
            message: daml.Text.decoder(),
        }); },
    }),
    Succeeded: ({
        decoder: function () { return jtv.object({
            transactionId: exports.TransactionId.decoder(),
        }); },
    }),
});
daml.STATIC_IMPLEMENTS_SERIALIZABLE_CHECK(exports.CompletionStatus);
exports.Completion = ({
    decoder: function () { return jtv.object({
        commandId: exports.CommandId.decoder(),
        status: exports.CompletionStatus.decoder(),
    }); },
});
exports.CommandId = ({
    decoder: function () { return jtv.object({
        unpack: daml.Text.decoder(),
    }); },
});
exports.EventId = ({
    decoder: function () { return jtv.object({
        unpack: daml.Text.decoder(),
    }); },
});
exports.TransactionId = ({
    decoder: function () { return jtv.object({
        unpack: daml.Text.decoder(),
    }); },
});
//# sourceMappingURL=LowLevel.js.map