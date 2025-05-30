import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Mesh, PlaneGeometry, Texture } from "three";
import { isFloor, useGetMaterial } from "../Hooks/Materials/useGetMaterial";

interface FolioModelProps {
  path: string;
  floorShadowPath: string;
}

export default function FolioModel({ path, floorShadowPath }: FolioModelProps) {
  const gltf = useGLTF(path);
  const floorShadowTexture = useTexture(floorShadowPath);
  const getMaterial = useGetMaterial();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!gltf?.scene || !floorShadowTexture?.image) return;

    gltf.scene.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      if (isFloor(child.name)) {
        child.geometry = new PlaneGeometry();
      }

      child.material = getMaterial(child.name, floorShadowTexture as Texture);
    });

    setReady(true);
  }, [gltf, floorShadowTexture, getMaterial]);

  if (!ready) return null;

  return <primitive object={gltf.scene} />;
}
