import * as MRE from "@microsoft/mixed-reality-extension-sdk";

export default function renderImage(
  context: MRE.Context,
  url: String,
  w: number = 0,
  h: number = 0,
  d: number = 0,
  position: MRE.Vector3Like,
  rotation: any,
  parentId: any,
  isPrivate: boolean = false,
  userId: any = null
) {
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
