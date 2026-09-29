"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  id?: string;
  disabled?: boolean;
}

const OFFSET_PX = 28;

const buildVariants = (direction: Direction, reduce: boolean): Variants => {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    };
  }
  switch (direction) {
    case "up":    return { hidden: { opacity: 0, y: OFFSET_PX  }, visible: { opacity: 1, y: 0 } };
    case "down":  return { hidden: { opacity: 0, y: -OFFSET_PX }, visible: { opacity: 1, y: 0 } };
    case "left":  return { hidden: { opacity: 0, x: -OFFSET_PX }, visible: { opacity: 1, x: 0 } };
    case "right": return { hidden: { opacity: 0, x: OFFSET_PX  }, visible: { opacity: 1, x: 0 } };
    case "scale": return { hidden: { opacity: 0, scale: 0.94   }, visible: { opacity: 1, scale: 1 } };
    case "fade":
    default:      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  }
};

export default function AnimatedSection({
  children, className, delay = 0, direction = "up", id, disabled = false,
}: AnimatedSectionProps) {
  const reduce = useReducedMotion() ?? false;
  if (disabled) return <div id={id} className={className}>{children}</div>;
  return (
    <motion.div
      id={id}
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={buildVariants(direction, reduce)}
      transition={{ duration: reduce ? 0.2 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
