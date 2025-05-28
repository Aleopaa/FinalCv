import { Canvas } from "@react-three/fiber";
import { LinearEncoding, NoToneMapping } from "three";
import Folio from "./Folio";

export default function FolioCanvas() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        zIndex: 0,
      }}
      resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
      gl={{
        pixelRatio: 2,
        physicallyCorrectLights: true,
        autoClear: false,
        outputEncoding: LinearEncoding,
        toneMapping: NoToneMapping,
      }}
    >
      <color attach="background" args={[0x000000]} />
      <Folio />
    </Canvas>
  );
}
