import PrologueScene from "./PrologueScene";
import EmpathyScene from "./EmpathyScene";
import GlobalMapScene from "./GlobalMapScene";
import ActSectionV2 from "./ActSectionV2";
import FinaleSceneV2 from "./FinaleSceneV2";
import SceneNavigator from "./SceneNavigator";
import { acts } from "../data/blackouts";

export default function MainScenes() {
  const scenes = [
    {
      id: "empathy",
      component: <EmpathyScene />
    },
    {
      id: "prologue",
      component: <PrologueScene />
    },
    {
      id: "map",
      component: <GlobalMapScene />
    },
    ...acts.map(act => ({
      id: `act-${act.act}`,
      component: <ActSectionV2 key={act.act} actInfo={act} />
    })),
    {
      id: "finale",
      component: <FinaleSceneV2 />
    }
  ];

  return <SceneNavigator scenes={scenes} />;
}
