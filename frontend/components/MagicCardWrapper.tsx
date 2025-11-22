"use client";

import MagicCard from "@/components/MagicBento";
import { ReactNode } from "react";

export default function MagicCardWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl"> 
      <MagicCard
        textAutoHide
        enableBorderGlow
        clickEffect
        spotlightRadius={300}
        particleCount={0}
        glowColor="255, 255, 255"
      >
        {children}
      </MagicCard>
    </div>
  );
}
