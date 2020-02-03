"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated from User.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
var jtv = require("@mojotech/json-type-validation");
var daml = require("@daml/types");
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template = require("./../d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/DA/Internal/Template");
exports.RemoveFriend = ({
    decoder: function () { return jtv.object({
        friend: daml.Party.decoder(),
    }); },
});
exports.AddFriend = ({
    decoder: function () { return jtv.object({
        friend: daml.Party.decoder(),
    }); },
});
exports.User = {
    templateId: '5944e48e36e9b9382b0876c3fa700de2966a82e7bec9552ef92c1f8185d5814f:User:User',
    keyDecoder: function () { return daml.Party.decoder(); },
    decoder: function () { return jtv.object({
        username: daml.Party.decoder(),
        friends: daml.List(daml.Party).decoder(),
    }); },
    AddFriend: {
        template: function () { return exports.User; },
        choiceName: 'AddFriend',
        argumentDecoder: exports.AddFriend.decoder,
        resultDecoder: function () { return daml.ContractId(exports.User).decoder(); },
    },
    Archive: {
        template: function () { return exports.User; },
        choiceName: 'Archive',
        argumentDecoder: pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662_DA_Internal_Template.Archive.decoder,
        resultDecoder: function () { return daml.Unit.decoder(); },
    },
    RemoveFriend: {
        template: function () { return exports.User; },
        choiceName: 'RemoveFriend',
        argumentDecoder: exports.RemoveFriend.decoder,
        resultDecoder: function () { return daml.ContractId(exports.User).decoder(); },
    },
};
daml.registerTemplate(exports.User);
//# sourceMappingURL=User.js.map