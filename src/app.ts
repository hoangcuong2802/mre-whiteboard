import * as MRE from "@microsoft/mixed-reality-extension-sdk";

import WhiteBoard from './modules/whiteboard'
import SignupForm from "./modules/signupform";
import UploaderTool from "./modules/uploadertool";

export default class Continuum {
  private assets: MRE.AssetContainer;
  private _whiteBoard: WhiteBoard;
  private _signupForm: SignupForm;
  private _uploaderTool: UploaderTool;


  constructor(private context: MRE.Context, private params: MRE.ParameterSet) {
    this._whiteBoard = new WhiteBoard(context);
    this._signupForm = new SignupForm(context);
    this._uploaderTool = new UploaderTool(context);


    this.context.onStarted(() => {
      switch (this.params.module) {
        case "whiteBoard":
          this._whiteBoard.started();
          break;
        case "signupForm":
          this._signupForm.started();
          break;
        case "uploaderTool":
          this._uploaderTool.started();
          break;
        default:
          break;
      }
    });
  }
}
