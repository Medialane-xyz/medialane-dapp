'use client'

import { useEffect, useState } from 'react'
import { motion } from "motion/react"

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">


      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 5% 20%,rgba(139, 0, 255, 0.25), transparent 100%)',
            'radial-gradient(circle at 60% 80%,rgba(0, 255, 255, 0.15), transparent 60%)',
            'radial-gradient(circle at 0% 50%,rgba(255, 0, 255, 0.25), transparent 80%)',
            'radial-gradient(circle at 80% 80%,rgba(255, 153, 0, 0.2), transparent 60%)',
            'radial-gradient(circle at 5% 20%,rgba(139, 0, 255, 0.25), transparent 100%)',
          ],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />


      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  )
}