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
class WhiteBoard {
    constructor(context) {
        this.context = context;
        this.expectedResultDescription = "Draw on the surface to place red ink";
        this.drawColor = 'red';
        this.drawObjects = [];
        this.pinpoint = [];
        this.assets = new MRE.AssetContainer(context);
    }
    cleanup() {
        this.assets.unload();
    }
    async started() {
        const root = MRE.Actor.Create(this.context, {});
        this.assets = new MRE.AssetContainer(this.context);
        this.drawMesh = this.assets.createSphereMesh('drawPoint', .007);
        this.hoverMaterial = this.assets.createMaterial('hoverMaterial', {
            color: MRE.Color3.White()
        });
        this.drawMaterial = this.assets.createMaterial('drawMaterial', {
            color: MRE.Color3.Black()
        });
        this.redDrawMaterial = this.assets.createMaterial('redDrawMaterial', {
            color: MRE.Color3.Red()
        });
        this.createDrawSurface(root);
        this.createEraseButton();
        this.createColorButton();
        this.createGeometryButtons();
        // Create scene light
        MRE.Actor.Create(this.context, {
            actor: {
                name: "Light",
                parentId: root.id,
                light: {
                    type: 'point',
                    range: 5,
                    intensity: 2,
                    color: { r: 1, g: 0.5, b: 0.3 }
                },
            }
        });
        return true;
    }
    selectMaterial() {
        if (this.drawColor === 'black') {
            return this.drawMaterial.id;
        }
        return this.redDrawMaterial.id;
    }
    spawnTargetObjects(targetingState, drawPoints) {
        const materialId = (targetingState === 'hover') ? this.hoverMaterial.id : this.selectMaterial();
        const drawActors = drawPoints.map(drawPoint => {
            return MRE.Actor.Create(this.context, {
                actor: {
                    name: targetingState === 'hover' ? 'hoverBall' : 'drawBall',
                    parentId: this.drawSurface.id,
                    transform: { local: { position: drawPoint } },
                    appearance: {
                        materialId: materialId,
                        meshId: this.drawMesh.id
                    }
                }
            });
        });
        if (targetingState === 'hover') {
            setTimeout(() => drawActors.forEach(actor => actor.destroy()), 1500);
        }
        else {
            this.drawObjects = this.drawObjects.concat(drawActors);
        }
    }
    eraseDrawObjects() {
        this.drawObjects.forEach(actor => actor.destroy());
        this.drawObjects = [];
        this.diagramObjects.destroy();
        for (let i = 0; i < this.pinpoint.length; i++) {
            this.pinpoint[i].destroy();
        }
    }
    createGeometryButtons() {
        const contactButton = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Diagram Button',
                transform: {
                    local: {
                        position: { x: -0.7, y: 0.25, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.1, y: 0.1, z: 0.1 } } }
            }
        });
        contactButton.setBehavior(MRE.ButtonBehavior).onClick((user) => {
            this.createIconButton("https://i.imgur.com/XXUfGl6.png", -1.25, 1.15, 'https://cdn-content-ingress.altvr.com/uploads/model/gltf/1975358144481591813/Torus.glb');
            this.createIconButton("https://i.imgur.com/OV4PMk0.png", -1.25, 1.4, 'https://cdn-content-ingress.altvr.com/uploads/model/gltf/1978860124105605768/ARROW.glb');
            this.createIconButton("https://i.imgur.com/2yS3V9h.png", -1.25, 0.9, 'https://cdn-content-ingress.altvr.com/uploads/model/gltf/1978864964030431263/RECTANGLE2.glb');
            //this.createIconButton("https://i.imgur.com/4mLUgRX.png", -1.25, 0.65, 'https://cdn-content-ingress.altvr.com/uploads/model/gltf/1979533887797199471/Sketchfab_2019_04_14_17_30_55.glb')
            this.createTextButton();
        });
    }
    createDrawSurface(root) {
        const surfaceMesh = this.assets.createBoxMesh('drawSurface', 2, 1, .01);
        // Create draw surface
        this.drawSurface = MRE.Actor.Create(this.context, {
            actor: {
                name: 'drawSurface',
                parentId: root.id,
                transform: { local: { position: { y: 1 }, scale: { x: 1.1, y: 1.1, z: 1.1 } } },
                appearance: { meshId: surfaceMesh.id },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        // Create label for draw surface.
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'label',
                parentId: this.drawSurface.id,
                transform: { local: { position: { y: 0.1 } } },
                text: {
                    contents: 'Use surface to hove and draw over',
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.BottomCenter,
                    color: MRE.Color3.Teal()
                }
            }
        });
        this.surfaceBehavior = this.drawSurface.setBehavior(MRE.ButtonBehavior);
        // Hover handlers
        this.surfaceBehavior.onHover('enter', (_, data) => {
            // this.spawnTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onHover('hovering', (_, data) => {
            // this.spawnTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onHover('exit', (_, data) => {
            // this.spawnTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        // Button handlers
        this.surfaceBehavior.onButton('pressed', (_, data) => {
            this.spawnTargetObjects('draw', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onButton('holding', (_, data) => {
            this.spawnTargetObjects('draw', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onButton('released', (_, data) => {
            this.spawnTargetObjects('draw', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
    }
    createEraseButton() {
        // Create erase button for the surface
        const buttonMesh = this.assets.createBoxMesh('eraseButton', .2, .2, .01);
        this.eraseButton = MRE.Actor.Create(this.context, {
            actor: {
                name: 'eraseButton',
                parentId: this.drawSurface.id,
                transform: { local: { position: { y: -.7 } } },
                appearance: { meshId: buttonMesh.id },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        const eraseButtonBehavior = this.eraseButton.setBehavior(MRE.ButtonBehavior);
        eraseButtonBehavior.onClick((_, __) => this.eraseDrawObjects());
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
        const mesh = this.assets.createBoxMesh("eraseButton", .15, .2, .01);
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
                parentId: this.drawSurface.id,
            },
        });
    }
    createColorButton() {
        const black = this.createImg("https://cdn-icons-png.flaticon.com/512/0/8.png", .3, -.7);
        const red = this.createImg("https://cdn-icons-png.flaticon.com/512/3124/3124822.png", .5, -.7);
        black.setBehavior(MRE.ButtonBehavior)
            .onClick((user) => {
            this.drawColor = 'black';
        });
        red.setBehavior(MRE.ButtonBehavior)
            .onClick((user) => {
            this.drawColor = 'red';
        });
    }
    createIconButton(url, positionx, positiony, uri) {
        const assets = new MRE.AssetContainer(this.context);
        const tex = assets.createTexture("uvgrid", {
            uri: url,
        });
        const mesh = assets.createBoxMesh("window", .2, .2, .01);
        const mat = assets.createMaterial("previewMaterial", {
            color: MRE.Color3.Black(),
            emissiveColor: MRE.Color3.White(),
            emissiveTextureId: tex.id,
        });
        const iconButton = MRE.Actor.Create(this.context, {
            actor: {
                name: "window",
                appearance: {
                    meshId: mesh.id,
                    materialId: mat.id,
                },
                transform: {
                    local: {
                        position: { x: positionx, y: positiony, z: 0 },
                    },
                },
                collider: {
                    geometry: {
                        shape: MRE.ColliderType.Box,
                        size: { x: .1, y: .1, z: .1 },
                    },
                },
            },
        });
        iconButton.setBehavior(MRE.ButtonBehavior).onClick((user) => {
            this.diagramObjects = MRE.Actor.CreateFromGltf(this.assets, {
                //uri: `https://cdn-content-ingress.altvr.com/uploads/model/gltf/1975358144481591813/Torus.glb`,
                uri: uri,
                colliderType: "mesh",
                actor: {
                    name: "TriangleShape",
                    transform: {
                        local: {
                            scale: { x: .1, y: .1, z: .1 },
                            position: { x: 0, y: 1, z: -0.25 },
                            rotation: { x: 0, y: 0, z: 0 },
                        },
                    },
                },
            });
            // //Try adding moving with continuous positions
            // this.iconmoveBehavior = this.drawSurface.setBehavior(MRE.ButtonBehavior);
            //  // Hover handlers
            // this.iconmoveBehavior.onHover('enter', (_, data: MRE.ButtonEventData) => {
            // // this.followTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
            // });
            // this.iconmoveBehavior.onHover('hovering', (_, data) => {
            // // this.followTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
            // });
            // this.iconmoveBehavior.onHover('exit', (_, data: MRE.ButtonEventData) => {
            // // this.followTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
            // });
            // this.iconmoveBehavior.onButton('pressed', (_, data: MRE.ButtonEventData) => {
            //   this.followTargetObjects('move', data.targetedPoints.map(pointData => pointData.localSpacePoint));
            // });
            // this.iconmoveBehavior.onButton('holding', (_, data) => {
            //   this.followTargetObjects('move', data.targetedPoints.map(pointData => pointData.localSpacePoint));
            // });
            // this.iconmoveBehavior.onButton('released', (_, data: MRE.ButtonEventData) => {
            //   this.followTargetObjects('move', data.targetedPoints.map(pointData => pointData.localSpacePoint));
            // });
            // Moving with static positions
            this.diagramObjects.setBehavior(MRE.ButtonBehavior).onClick((user) => {
                console.log("Get pointer transform");
                this.pinpoint[0] = MRE.Actor.Create(this.context, {
                    actor: {
                        name: "pinpoint",
                        //parentId: this.diagramObjects.id,
                        appearance: {
                            meshId: this.drawMesh.id,
                            materialId: mat.id,
                        },
                        transform: {
                            local: {
                                position: { x: this.diagramObjects.transform.local.position.x + 0.2, y: this.diagramObjects.transform.local.position.y, z: this.diagramObjects.transform.local.position.z },
                                scale: { x: 1.5, y: 1.5, z: 1.5 },
                            },
                        },
                        collider: {
                            geometry: {
                                shape: MRE.ColliderType.Box,
                                size: { x: .2, y: .2, z: .2 },
                            },
                        },
                    },
                });
                this.pinpoint[0].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                    this.diagramObjects.transform.local.position.x += 0.2;
                    for (let i = 0; i < this.pinpoint.length; i++) {
                        this.pinpoint[i].transform.local.position.x += 0.2;
                    }
                });
                this.pinpoint[1] = MRE.Actor.Create(this.context, {
                    actor: {
                        name: "pinpoint",
                        //parentId: this.diagramObjects.id,
                        appearance: {
                            meshId: this.drawMesh.id,
                            materialId: mat.id,
                        },
                        transform: {
                            local: {
                                position: { x: this.diagramObjects.transform.local.position.x - 0.2, y: this.diagramObjects.transform.local.position.y, z: this.diagramObjects.transform.local.position.z },
                                scale: { x: 1.5, y: 1.5, z: 1.5 },
                            },
                        },
                        collider: {
                            geometry: {
                                shape: MRE.ColliderType.Box,
                                size: { x: .2, y: .2, z: .2 },
                            },
                        },
                    },
                });
                this.pinpoint[1].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                    this.diagramObjects.transform.local.position.x -= 0.2;
                    for (let i = 0; i < this.pinpoint.length; i++) {
                        this.pinpoint[i].transform.local.position.x -= 0.2;
                    }
                });
                this.pinpoint[2] = MRE.Actor.Create(this.context, {
                    actor: {
                        name: "pinpoint",
                        //parentId: this.diagramObjects.id,
                        appearance: {
                            meshId: this.drawMesh.id,
                            materialId: mat.id,
                        },
                        transform: {
                            local: {
                                position: { x: this.diagramObjects.transform.local.position.x, y: this.diagramObjects.transform.local.position.y + 0.25, z: this.diagramObjects.transform.local.position.z },
                                scale: { x: 1.5, y: 1.5, z: 1.5 },
                            },
                        },
                        collider: {
                            geometry: {
                                shape: MRE.ColliderType.Box,
                                size: { x: .2, y: .2, z: .2 },
                            },
                        },
                    },
                });
                this.pinpoint[2].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                    this.diagramObjects.transform.local.position.y += 0.2;
                    for (let i = 0; i < this.pinpoint.length; i++) {
                        this.pinpoint[i].transform.local.position.y += 0.2;
                    }
                });
                this.pinpoint[3] = MRE.Actor.Create(this.context, {
                    actor: {
                        name: "pinpoint",
                        //parentId: this.diagramObjects.id,
                        appearance: {
                            meshId: this.drawMesh.id,
                            materialId: mat.id,
                        },
                        transform: {
                            local: {
                                position: { x: this.diagramObjects.transform.local.position.x, y: this.diagramObjects.transform.local.position.y - 0.25, z: this.diagramObjects.transform.local.position.z },
                                scale: { x: 1.5, y: 1.5, z: 1.5 },
                            },
                        },
                        collider: {
                            geometry: {
                                shape: MRE.ColliderType.Box,
                                size: { x: .2, y: .2, z: .2 },
                            },
                        },
                    },
                });
                this.pinpoint[3].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                    this.diagramObjects.transform.local.position.y -= 0.2;
                    for (let i = 0; i < this.pinpoint.length; i++) {
                        this.pinpoint[i].transform.local.position.y -= 0.2;
                    }
                });
                this.pinpoint[4] = MRE.Actor.Create(this.context, {
                    actor: {
                        name: "pinpoint",
                        //parentId: this.diagramObjects.id,
                        appearance: {
                            meshId: this.drawMesh.id,
                            materialId: mat.id,
                        },
                        transform: {
                            local: {
                                position: { x: this.diagramObjects.transform.local.position.x, y: this.diagramObjects.transform.local.position.y, z: this.diagramObjects.transform.local.position.z },
                                scale: { x: 1.5, y: 1.5, z: 1.5 },
                            },
                        },
                        collider: {
                            geometry: {
                                shape: MRE.ColliderType.Box,
                                size: { x: .05, y: .05, z: .05 },
                            },
                        },
                    },
                });
                this.pinpoint[4].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                    this.diagramObjects.transform.local.scale.x += 0.1;
                    this.diagramObjects.transform.local.scale.y += 0.1;
                    if (this.diagramObjects.transform.local.scale.x >= 0.5 || this.diagramObjects.transform.local.scale.y >= 0.5) {
                        this.diagramObjects.transform.local.scale.x -= 0.1;
                        this.diagramObjects.transform.local.scale.y -= 0.1;
                    }
                });
            });
        });
    }
    createTextButton() {
        const assets = new MRE.AssetContainer(this.context);
        const tex = assets.createTexture("uvgrid", {
            uri: 'https://i.imgur.com/4mLUgRX.png',
        });
        const mesh = assets.createBoxMesh("window", .2, .2, .01);
        const mat = assets.createMaterial("previewMaterial", {
            color: MRE.Color3.Black(),
            emissiveColor: MRE.Color3.White(),
            emissiveTextureId: tex.id,
        });
        this.textButton = MRE.Actor.Create(this.context, {
            actor: {
                name: "window",
                appearance: {
                    meshId: mesh.id,
                    materialId: mat.id,
                },
                transform: {
                    local: {
                        position: { x: -1.25, y: 0.65, z: 0 },
                    },
                },
                collider: {
                    geometry: {
                        shape: MRE.ColliderType.Box,
                        size: { x: .1, y: .1, z: .1 },
                    },
                },
            },
        });
        this.textButton.setBehavior(MRE.ButtonBehavior).onClick((user) => {
            user.prompt(`
          Enter your text to whiteboard
          (e.g. Jira).`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    this.inputText = MRE.Actor.Create(this.context, {
                        actor: {
                            name: 'ResultLabel',
                            transform: { local: { position: { x: 0, y: 0.75, z: -0.1 }
                                }
                            },
                            text: {
                                contents: res.text,
                                height: .1,
                                anchor: MRE.TextAnchorLocation.MiddleCenter,
                                color: MRE.Color3.White()
                            },
                            collider: {
                                geometry: {
                                    shape: MRE.ColliderType.Box,
                                    size: { x: .1, y: .1, z: .1 },
                                },
                            }
                        }
                    });
                    this.inputText.setBehavior(MRE.ButtonBehavior).onClick((user) => {
                    });
                    //this.infoText.text.contents = this.resultMessageFor(res.text);
                    //this.search(res.text);
                }
                else {
                    // user clicked 'Cancel'
                }
                this.inputText.setBehavior(MRE.ButtonBehavior).onClick((user) => {
                    console.log("Get Text transform");
                    this.pinpoint[0] = MRE.Actor.Create(this.context, {
                        actor: {
                            name: "pinpoint",
                            //parentId: this.diagramObjects.id,
                            appearance: {
                                meshId: this.drawMesh.id,
                                materialId: mat.id,
                            },
                            transform: {
                                local: {
                                    position: { x: this.inputText.transform.local.position.x + 0.2, y: this.inputText.transform.local.position.y, z: this.inputText.transform.local.position.z },
                                    scale: { x: 1.5, y: 1.5, z: 1.5 },
                                },
                            },
                            collider: {
                                geometry: {
                                    shape: MRE.ColliderType.Box,
                                    size: { x: .2, y: .2, z: .2 },
                                },
                            },
                        },
                    });
                    this.pinpoint[0].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                        this.inputText.transform.local.position.x += 0.2;
                        for (let i = 0; i < this.pinpoint.length; i++) {
                            this.pinpoint[i].transform.local.position.x += 0.2;
                        }
                    });
                    this.pinpoint[1] = MRE.Actor.Create(this.context, {
                        actor: {
                            name: "pinpoint",
                            //parentId: this.diagramObjects.id,
                            appearance: {
                                meshId: this.drawMesh.id,
                                materialId: mat.id,
                            },
                            transform: {
                                local: {
                                    position: { x: this.inputText.transform.local.position.x - 0.2, y: this.inputText.transform.local.position.y, z: this.inputText.transform.local.position.z },
                                    scale: { x: 1.5, y: 1.5, z: 1.5 },
                                },
                            },
                            collider: {
                                geometry: {
                                    shape: MRE.ColliderType.Box,
                                    size: { x: .2, y: .2, z: .2 },
                                },
                            },
                        },
                    });
                    this.pinpoint[1].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                        this.inputText.transform.local.position.x -= 0.2;
                        for (let i = 0; i < this.pinpoint.length; i++) {
                            this.pinpoint[i].transform.local.position.x -= 0.2;
                        }
                    });
                    this.pinpoint[2] = MRE.Actor.Create(this.context, {
                        actor: {
                            name: "pinpoint",
                            //parentId: this.diagramObjects.id,
                            appearance: {
                                meshId: this.drawMesh.id,
                                materialId: mat.id,
                            },
                            transform: {
                                local: {
                                    position: { x: this.inputText.transform.local.position.x, y: this.inputText.transform.local.position.y + 0.25, z: this.inputText.transform.local.position.z },
                                    scale: { x: 1.5, y: 1.5, z: 1.5 },
                                },
                            },
                            collider: {
                                geometry: {
                                    shape: MRE.ColliderType.Box,
                                    size: { x: .2, y: .2, z: .2 },
                                },
                            },
                        },
                    });
                    this.pinpoint[2].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                        this.inputText.transform.local.position.y += 0.2;
                        for (let i = 0; i < this.pinpoint.length; i++) {
                            this.pinpoint[i].transform.local.position.y += 0.2;
                        }
                    });
                    this.pinpoint[3] = MRE.Actor.Create(this.context, {
                        actor: {
                            name: "pinpoint",
                            //parentId: this.diagramObjects.id,
                            appearance: {
                                meshId: this.drawMesh.id,
                                materialId: mat.id,
                            },
                            transform: {
                                local: {
                                    position: { x: this.inputText.transform.local.position.x, y: this.inputText.transform.local.position.y - 0.25, z: this.inputText.transform.local.position.z },
                                    scale: { x: 1.5, y: 1.5, z: 1.5 },
                                },
                            },
                            collider: {
                                geometry: {
                                    shape: MRE.ColliderType.Box,
                                    size: { x: .2, y: .2, z: .2 },
                                },
                            },
                        },
                    });
                    this.pinpoint[3].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                        this.inputText.transform.local.position.y -= 0.2;
                        for (let i = 0; i < this.pinpoint.length; i++) {
                            this.pinpoint[i].transform.local.position.y -= 0.2;
                        }
                    });
                    this.pinpoint[4] = MRE.Actor.Create(this.context, {
                        actor: {
                            name: "pinpoint",
                            //parentId: this.diagramObjects.id,
                            appearance: {
                                meshId: this.drawMesh.id,
                                materialId: mat.id,
                            },
                            transform: {
                                local: {
                                    position: { x: this.inputText.transform.local.position.x, y: this.inputText.transform.local.position.y, z: this.inputText.transform.local.position.z },
                                    scale: { x: 1.5, y: 1.5, z: 1.5 },
                                },
                            },
                            collider: {
                                geometry: {
                                    shape: MRE.ColliderType.Box,
                                    size: { x: .05, y: .05, z: .05 },
                                },
                            },
                        },
                    });
                    this.pinpoint[4].setBehavior(MRE.ButtonBehavior).onClick((user) => {
                        this.inputText.transform.local.scale.x += 0.1;
                        this.inputText.transform.local.scale.y += 0.1;
                        if (this.inputText.transform.local.scale.x >= 0.5 || this.inputText.transform.local.scale.y >= 0.5) {
                            this.inputText.transform.local.scale.x -= 0.1;
                            this.inputText.transform.local.scale.y -= 0.1;
                        }
                    });
                });
            })
                .catch(err => {
                console.error(err);
            });
        });
    }
}
exports.default = WhiteBoard;
//# sourceMappingURL=whiteboard.js.map