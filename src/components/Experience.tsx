"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useFrameSequence } from "@/hooks/useFrameSequence";
import { SEQUENCE } from "@/lib/config";
import { Preloader } from "@/components/ui/Preloader";
import { Hero } from "@/sections/Hero";
import { FrameSequence } from "@/sections/FrameSequence";
import { PersistentStory } from "@/sections/PersistentStory";
import { Craftsmanship } from "@/sections/Craftsmanship";
import { Manifesto } from "@/sections/Manifesto";
import { Immersive } from "@/sections/Immersive";
import { CollectionShowcase } from "@/sections/CollectionShowcase";
import { Finale } from "@/sections/Finale";
import { CallToAction } from "@/sections/CallToAction";

// Three.js scene is client-only and non-critical → load lazily, no SSR.
const AmbientField = dynamic(
  () => import("@/components/three/AmbientField").then((m) => m.AmbientField),
  { ssr: false },
);

export function Experience() {
  useSmoothScroll();
  const { store, progress, ready, drawTick } = useFrameSequence(SEQUENCE);

  // Once the critical frames are ready and the preloader curtain lifts, the
  // hero entrance + font swap have settled. Re-measure all ScrollTriggers so
  // the pinned sequence's start/end (and scroll→frame mapping) are correct.
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <>
      <Preloader progress={progress} done={ready} />
      <AmbientField />

      <main className="relative z-10">
        <Hero />
        <FrameSequence store={store} drawTick={drawTick} />
        <PersistentStory />
        <Craftsmanship />
        <Manifesto />
        <Immersive />
        <CollectionShowcase />
        <Finale />
        <CallToAction />
      </main>
    </>
  );
}
