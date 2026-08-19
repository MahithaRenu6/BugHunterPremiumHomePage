import { motion } from "motion/react";
import monster from "@/assets/bug-monster.png";

type Props = {
  className?: string;
};

/**
 * Hero creature: an organic bug-monster with a glowing core eye.
 * Image + motion layers (breathing scale, slow drift, pulsing aura).
 */
export function BugCreature({ className = "" }: Props) {
  return (
    <motion.div
      className={`pointer-events-none relative select-none ${className}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      {/* aura behind the creature */}
      <motion.div
        className="absolute inset-[12%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-magenta) 55%, transparent) 0%, color-mix(in oklab, var(--color-violet) 35%, transparent) 45%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* red core glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(255,40,60,0.85), transparent 70%)" }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src={monster}
        alt="Animated bug monster with a glowing red eye"
        width={1024}
        height={1024}
        className="relative h-full w-full object-contain drop-shadow-[0_0_60px_rgba(217,70,239,0.35)]"
        animate={{ y: [0, -22, 0], rotate: [-1.5, 1.5, -1.5], scale: [1, 1.03, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
