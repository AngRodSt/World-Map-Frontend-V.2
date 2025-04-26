"use client";

import Modal from "react-modal";
import { useEffect } from "react";
import dynamic from "next/dynamic";

export default function Home() {
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  /*
   * Dynamically imports the WorldMap component with server-side rendering (SSR) disabled.
   * This ensures the component is only loaded on the client side, avoiding potential SSR-related issues.
   */

  const WorldMap = dynamic(() => import("@/components/ui/WorldMap"), {
    ssr: false,
  });

  return (
    <>
      <div className=" justify-center items-center m-4 md:mt-0">
        <WorldMap />
      </div>
    </>
  );
}
