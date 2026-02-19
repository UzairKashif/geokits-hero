"use client";

import { Suspense } from "react";
import { useScrollPositionMemory } from "@/hooks/useScrollPositionMemory";
import ScrollToHash from "@/components/ScrollToHash";

function ScrollPositionMemoryBoundary() {
  useScrollPositionMemory();
  return null;
}

export default function HomePageEffects() {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollPositionMemoryBoundary />
      </Suspense>
      <ScrollToHash />
    </>
  );
}
