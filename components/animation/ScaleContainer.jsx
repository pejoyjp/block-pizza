"use client"
import { motion } from "framer-motion"
import React from 'react'

const ScaleContainer = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

export default ScaleContainer