import * as MRE from "@microsoft/mixed-reality-extension-sdk";
export default class WhiteBoard {
    private context;
    private assets;
    expectedResultDescription: string;
    private drawSurface;
    private drawColor;
    private eraseButton;
    private surfaceBehavior;
    private iconmoveBehavior;
    private drawMesh;
    private hoverMaterial;
    private drawMaterial;
    private redDrawMaterial;
    private drawObjects;
    private diagramObjects;
    private icon;
    private pointerposition;
    private pinpoint;
    private textButton;
    private inputText;
    cleanup(): void;
    constructor(context: MRE.Context);
    started(): Promise<boolean>;
    private selectMaterial;
    private spawnTargetObjects;
    private eraseDrawObjects;
    private createGeometryButtons;
    private createDrawSurface;
    private createEraseButton;
    private createImg;
    private createColorButton;
    private createIconButton;
    private createTextButton;
}
//# sourceMappingURL=whiteboard.d.ts.map