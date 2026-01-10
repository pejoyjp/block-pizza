"use client"
import { motion } from "framer-motion"
import React from 'react'

const RotateContainer = ({ children }) => {
  return (
    <motion.div
      initial={{ rotate: -180 }}
      animate={{ rotate: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

export default RotateContainer