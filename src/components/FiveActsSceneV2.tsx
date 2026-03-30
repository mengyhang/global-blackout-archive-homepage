import ActSectionV2 from "./ActSectionV2";
import { acts } from "../data/blackouts";

/**
 * 五幕场景V2 - 使用新的ActSectionV2
 */
export default function FiveActsSceneV2() {
  return (
    <div className="relative w-full bg-deep-black">
      {acts.map((actInfo) => (
        <ActSectionV2 key={actInfo.act} actInfo={actInfo} />
      ))}
    </div>
  );
}
