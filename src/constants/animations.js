/**
 * Framer Motion animation variants used across components
 */

/**
 * Fade in from bottom animation
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
}

/**
 * Fade in from left animation
 */
export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
}

/**
 * Fade in from right animation
 */
export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

/**
 * Scale up animation
 */
export const scaleUp = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
}

/**
 * Stagger children animation
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/**
 * Card hover animation
 */
export const cardHover = {
  scale: 1.02,
  y: -5,
  transition: { duration: 0.3 },
}

/**
 * Button hover animation
 */
export const buttonHover = {
  scale: 1.05,
}

/**
 * Button tap animation
 */
export const buttonTap = {
  scale: 0.95,
}

/**
 * Page transition
 */
export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

/**
 * Gradient animation for text
 */
export const gradientAnimation = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  },
  transition: {
    duration: 5,
    repeat: Infinity,
  },
}

/**
 * Float animation
 */
export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

/**
 * Rotate animation
 */
export const rotateAnimation = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  },
}

/**
 * Default transition duration
 */
export const DEFAULT_DURATION = 0.6

/**
 * Default delay between staggered items
 */
export const STAGGER_DELAY = 0.1

export default {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleUp,
  staggerContainer,
  cardHover,
  buttonHover,
  buttonTap,
  pageTransition,
  gradientAnimation,
  floatAnimation,
  rotateAnimation,
  DEFAULT_DURATION,
  STAGGER_DELAY,
}
