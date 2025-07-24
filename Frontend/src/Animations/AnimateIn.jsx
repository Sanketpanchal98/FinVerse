// AnimateIn.js
import { motion } from "framer-motion";
export const AnimateIn = ({ children, delay = 0, direction = "up" }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 48 : direction === "down" ? -48 : 0, 
      x: direction === "left" ? 48 : direction === "right" ? -48 : 0
    },
    show: { opacity: 1, y: 0, x: 0 }
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.24 }}
      variants={variants}
      transition={{ duration: 0.7, delay, type: "spring", bounce: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
