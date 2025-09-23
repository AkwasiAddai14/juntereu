'use client'

import { motion, Variants } from 'framer-motion'

// Animation variants for different effects
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const fadeIn: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Reusable animation components
interface AnimatedDivProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

export function AnimatedDiv({ 
  children, 
  variants = fadeInUp, 
  className = "",
  delay = 0,
  duration = 0.6,
  once = true
}: AnimatedDivProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.2
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ staggerChildren: staggerDelay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function StaggerItem({ 
  children, 
  className = "",
  delay = 0
}: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// Specialized animation components for common use cases
export function FadeInUp({ children, className = "", delay = 0 }: AnimatedDivProps) {
  return (
    <AnimatedDiv variants={fadeInUp} className={className} delay={delay}>
      {children}
    </AnimatedDiv>
  )
}

export function FadeInLeft({ children, className = "", delay = 0 }: AnimatedDivProps) {
  return (
    <AnimatedDiv variants={fadeInLeft} className={className} delay={delay}>
      {children}
    </AnimatedDiv>
  )
}

export function FadeInRight({ children, className = "", delay = 0 }: AnimatedDivProps) {
  return (
    <AnimatedDiv variants={fadeInRight} className={className} delay={delay}>
      {children}
    </AnimatedDiv>
  )
}

export function ScaleIn({ children, className = "", delay = 0 }: AnimatedDivProps) {
  return (
    <AnimatedDiv variants={scaleIn} className={className} delay={delay}>
      {children}
    </AnimatedDiv>
  )
}

// Animation for text that reveals character by character
export const textReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
}

export const letterReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

// Simple fallback animations that always work
export const simpleFadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const simpleStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

export const simpleStaggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  return (
    <motion.span
      variants={textReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={letterReveal}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Simple fallback components that are more reliable
export function SimpleStaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.15
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={simpleStaggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ staggerChildren: staggerDelay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SimpleStaggerItem({ 
  children, 
  className = "",
  delay = 0
}: StaggerItemProps) {
  return (
    <motion.div
      variants={simpleStaggerItem}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export function SimpleFadeIn({ children, className = "", delay = 0 }: AnimatedDivProps) {
  return (
    <motion.div
      variants={simpleFadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
