import FolioModel from "../../Components/FolioModel";

export default function IntroSectionComponent() {
  const base = import.meta.env.BASE_URL;

  return (
    <FolioModel
      path={base + "models/intro/static/base.glb"}
      floorShadowPath={base + "models/intro/static/floorShadow.png"}
    />
  );
}
