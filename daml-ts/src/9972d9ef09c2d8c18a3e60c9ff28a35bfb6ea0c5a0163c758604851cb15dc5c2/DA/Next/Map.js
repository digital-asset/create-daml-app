"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated from DA/Next/Map.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
var jtv = require("@mojotech/json-type-validation");
var daml = require("@daml/types");
exports.Map = function (k_a9Pz, v_a9PA) { return ({
    decoder: function () { return jtv.object({
        textMap: daml.TextMap(v_a9PA).decoder(),
    }); },
}); };
//# sourceMappingURL=Map.js.map