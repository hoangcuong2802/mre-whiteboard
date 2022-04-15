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
const fetch = require('node-fetch');
const url = require('url');
const PHOTOS_URL = 'https://account.altvr.com/api/public/photos?';
const WELCOME_TEXT = 'Bloom Uploader Tool';
const INFO_TEXT_HEIGHT = 1.2;
const BUTTON_HEIGHT = 0.6;
const SAMPLE_HASHTAG = 'campfire';
const TELEPORTER_BASE = -0.5;
const PAGE_SIZE = 25;
/**
 * The main class of this app. All the logic goes here.
 */
class WorldSearch {
    constructor(context) {
        this.context = context;
        this.libraryActors = [];
        // Load the database.
        // tslint:disable-next-line:no-var-requires variable-name
        this.photoDatabase = {};
        this.teleporterSpacing = 0.8;
        this.teleporterScale = { x: 0.5, y: 0.5, z: 0.5 };
        this.previewImageWidth = 1.4;
        this.previewImageHeight = 1;
        this.previewImageDepth = 0.02;
        this.previewImagePosition = { y: 2 };
        this.moreInfoHeight = 0.2;
        this.moreInfoPosition = { y: 2.8 };
        this.assets = new MRE.AssetContainer(context);
    }
    cleanup() {
        this.assets.unload();
    }
    /**
     * Once the context is "started", initialize the app.
     */
    async started() {
        const app = this;
        const root = MRE.Actor.Create(this.context, {});
        // set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
        this.assets = new MRE.AssetContainer(this.context);
        this.infoText = MRE.Actor.Create(this.context, {
            actor: {
                name: 'Info Text',
                transform: { local: { position: { x: 0, y: INFO_TEXT_HEIGHT, z: -1 } } },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } },
                text: {
                    contents: WELCOME_TEXT,
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Center
                }
            }
        });
        const helpButton = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Help Button',
                transform: { local: { position: { x: 0.2, y: BUTTON_HEIGHT, z: -1 } } },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } }
            }
        });
        helpButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
Share an image,doc, pdf file by adding a url and checking "Share with Bloomers"`).then(res => {
                if (res.submitted) {
                    //this.search(SAMPLE_HASHTAG);
                }
                else
                    this.infoText.text.contents = WELCOME_TEXT;
            })
                .catch(err => {
                console.error(err);
            });
        });
        const hashtagButton = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1579239194507608147',
            actor: {
                name: 'Hashtag Button',
                transform: { local: { position: { x: -0.2, y: BUTTON_HEIGHT, z: -1 } } },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } }
            }
        });
        hashtagButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
Enter an url and click "OK"
(e.g. 'https://i.imgur.com/2yS3V9h.png'.`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    this.createImg(res.text, 0, 0);
                }
                else {
                    // user clicked 'Cancel'
                }
            })
                .catch(err => {
                console.error(err);
            });
        });
        // allow the user to preset a query (e.g. /?q=campfire)
        //if(this.params.q){
        //this.search(String(this.params.q));
        //}
        //https://dl.dropboxusercontent.com/s/cpsxkfo4jifud6n/Get%20Started%20with%20Dropbox.pdf?dl=0
    }
    createImg(url, x, y) {
        const tex = this.assets.createTexture("uvgrid", {
            uri: url,
        });
        const mat = this.assets.createMaterial("previewMaterial", {
            color: MRE.Color3.Black(),
            emissiveColor: MRE.Color3.White(),
            emissiveTextureId: tex.id,
        });
        const mesh = this.assets.createBoxMesh("eraseButton", 1, 1, .02);
        return MRE.Actor.Create(this.context, {
            actor: {
                name: "window",
                appearance: {
                    meshId: mesh.id,
                    materialId: mat.id,
                },
                transform: {
                    local: { position: { y, x } }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
            },
        });
    }
}
exports.default = WorldSearch;
//# sourceMappingURL=uploadertool.js.map