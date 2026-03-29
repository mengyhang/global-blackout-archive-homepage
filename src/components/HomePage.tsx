import { useState } from "react";
import NarrativePreview from "./NarrativePreview";
import NarrativeModal from "./NarrativeModal";
import ArchiveGrid from "./ArchiveGrid";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 上半部分：叙事预览 */}
      <NarrativePreview onEnter={() => setIsModalOpen(true)} />

      {/* 下半部分：档案网格 */}
      <ArchiveGrid />

      {/* 全屏叙事模态框 */}
      <NarrativeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
