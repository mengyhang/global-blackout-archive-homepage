import ActSection from "./ActSection";
import { acts } from "../data/blackouts";

/**
 * Scene 3-7: 五幕故事导览
 * 按序渲染五个 ActSection
 */
export default function FiveActsScene() {
  return (
    <div className="relative w-full bg-deep-black">
      {acts.map((actInfo) => (
        <ActSection key={actInfo.act} actInfo={actInfo} />
      ))}
    </div>
  );
}
