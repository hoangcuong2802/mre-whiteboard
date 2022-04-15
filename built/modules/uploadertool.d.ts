import * as MRE from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class WorldSearch {
    private context;
    private assets;
    private libraryActors;
    private photoDatabase;
    private teleporterSpacing;
    private teleporterScale;
    private previewImageWidth;
    private previewImageHeight;
    private previewImageDepth;
    private previewImagePosition;
    private moreInfoHeight;
    private moreInfoPosition;
    private photos;
    private infoText;
    cleanup(): void;
    constructor(context: MRE.Context);
    /**
     * Once the context is "started", initialize the app.
     */
    started(): Promise<void>;
    private createImg;
}
//# sourceMappingURL=uploadertool.d.ts.map