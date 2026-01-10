"use client"
import { motion } from "framer-motion"
import React from 'react'

const SlideInContainer = ({ children }) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export default SlideInContainer