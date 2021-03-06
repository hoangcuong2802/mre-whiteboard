import * as MRE from '@microsoft/mixed-reality-extension-sdk';

const fetch = require('node-fetch');
const url = require('url');
const PHOTOS_URL = 'https://account.altvr.com/api/public/photos?';
const WELCOME_TEXT = 'Bloom Uploader Tool';
const INFO_TEXT_HEIGHT = 1.2;
const BUTTON_HEIGHT = 0.6;
const SAMPLE_HASHTAG = 'campfire';
const TELEPORTER_BASE = -0.5;
const PAGE_SIZE = 25;

type PhotoDescriptor = {
  photoId: string;
  name: string;
  image: string;
  worldId: string;
};


/**
 * The main class of this app. All the logic goes here.
 */
export default class WorldSearch {
  private assets: MRE.AssetContainer;


  private libraryActors: MRE.Actor[] = [];

  // Load the database.
  // tslint:disable-next-line:no-var-requires variable-name
  private photoDatabase: { [key: string]: PhotoDescriptor } = {};
  
  private teleporterSpacing = 0.8;
  private teleporterScale = {x: 0.5, y: 0.5, z: 0.5};
  private previewImageWidth = 1.4;
  private previewImageHeight = 1;
  private previewImageDepth = 0.02;
  private previewImagePosition = {y: 2};
  private moreInfoHeight = 0.2;
  private moreInfoPosition = {y: 2.8};
  private photos : any;
  private infoText : any;

  public cleanup() {
    this.assets.unload();
  }

  constructor(private context: MRE.Context) {
    this.assets = new MRE.AssetContainer(context);
  }
  /**
   * Once the context is "started", initialize the app.
   */
  public async started() {
    const app = this;
    const root = MRE.Actor.Create(this.context, {
    })
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
          if(res.submitted){
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

          if(res.submitted && res.text.length > 0){
            this.createImg(res.text, 0 ,0);
          }
          else{
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

  private createImg(url: string, x: number, y: number) {
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
