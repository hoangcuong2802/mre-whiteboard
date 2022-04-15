"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
function renderImage(context, url, w = 0, h = 0, d = 0, position, rotation, parentId, isPrivate = false, userId = null) {
    const assets = new MRE.AssetContainer(context);
    const tex = assets.createTexture("uvgrid", {
        uri: `${url}`,
    });
    const mat = assets.createMaterial("previewMaterial", {
        color: MRE.Color3.Black(),
        emissiveColor: MRE.Color3.White(),
        emissiveTextureId: tex.id,
    });
    const mesh = assets.createBoxMesh("window", w, h, d);
    return MRE.Actor.Create(context, {
        actor: {
            exclusiveToUser: isPrivate ? userId : null,
            name: "window",
            appearance: {
                meshId: mesh.id,
                materialId: mat.id,
            },
            transform: {
                local: {
                    position: position,
                    rotation: rotation,
                },
            },
            collider: {
                geometry: {
                    shape: MRE.ColliderType.Box,
                    size: { x: w, y: h, z: 0.01 },
                },
            },
            parentId: parentId,
        },
    });
}
exports.default = renderImage;
//# sourceMappingURL=Img-render.js.map