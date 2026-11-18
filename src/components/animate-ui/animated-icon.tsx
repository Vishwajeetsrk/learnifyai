"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"
import type { LucideIcon } from "lucide-react"

interface AnimatedHugeIconProps extends Omit<HugeiconsIconProps, "icon"> {
  icon: any
  animateOnHover?: boolean
  className?: string
}

export function AnimatedHugeIcon({
  icon,
  animateOnHover = true,
  className,
  ...props
}: AnimatedHugeIconProps) {
  const reduce = useReducedMotion()

  return (
    <motion.span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      whileHover={reduce || !animateOnHover ? {} : { scale: 1.15, rotate: 6 }}
      whileTap={reduce || !animateOnHover ? {} : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} {...props} />
    </motion.span>
  )
}

interface AnimatedLucideIconProps extends React.ComponentProps<"svg"> {
  icon: LucideIcon
  animateOnHover?: boolean
  className?: string
}

export function AnimatedLucideIcon({
  icon: Icon,
  animateOnHover = true,
  className,
  ...props
}: AnimatedLucideIconProps) {
  const reduce = useReducedMotion()

  return (
    <motion.span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      whileHover={reduce || !animateOnHover ? {} : { scale: 1.15, rotate: -6 }}
      whileTap={reduce || !animateOnHover ? {} : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Icon className={cn("size-4", className)} {...(props as any)} />
    </motion.span>
  )
}
