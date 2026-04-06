"use client"

import { motion } from "framer-motion"
import React from "react"
import { ImagesSlider } from "@/ui/images-slider"
import { FlipWordsDemo } from "./FlipWordsDemo"

export function ImagesSliderDemo() {
  const images = ["/Home/teamcivil.jpg", "/Home/iitiSocCivil.jpg", "/Home/groupPhoto.jpg"]

  return (
    <ImagesSlider className="h-[46rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          <FlipWordsDemo />
        </motion.p>
      </motion.div>
    </ImagesSlider>
  )
}
