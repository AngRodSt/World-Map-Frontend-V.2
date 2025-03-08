'use client'

import Modal from "react-modal";
import { useEffect } from "react";
import dynamic from "next/dynamic";


export default function Home() {
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const WorldMap = dynamic(() => import("@/components/WorldMap"), {
    ssr: false,
  });
  return (
    <>
      <div className=" justify-center items-center m-4 md:mt-0">
        <WorldMap />
      </div>
    </>
  )
}