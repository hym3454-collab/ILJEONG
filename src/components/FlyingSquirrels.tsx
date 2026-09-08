import { motion } from 'motion/react';

export function FlyingSquirrels() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Squirrel 1 */}
      <motion.div
        className="absolute text-3xl select-none"
        initial={{ x: -50, y: 40 }}
        animate={{
          x: ['0vw', '105vw'],
          y: [40, 120, 60, 150, 40],
          rotate: [0, 15, -10, 20, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🐿️✨
      </motion.div>

      {/* Squirrel 2 (Flying higher, opposite direction or slower) */}
      <motion.div
        className="absolute text-2xl select-none"
        initial={{ x: '105vw', y: 150 }}
        animate={{
          x: ['105vw', '-5vw'],
          y: [150, 80, 200, 100, 160],
          rotate: [0, -15, 10, -20, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      >
        🌰🐿️
      </motion.div>

      {/* Floating Acorns */}
      <motion.div
        className="absolute text-xl select-none"
        initial={{ x: '30vw', y: -20 }}
        animate={{
          y: ['0vh', '85vh'],
          x: ['30vw', '33vw', '27vw', '30vw'],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
          delay: 2,
        }}
      >
        🌰
      </motion.div>

      <motion.div
        className="absolute text-xl select-none"
        initial={{ x: '75vw', y: -20 }}
        animate={{
          y: ['0vh', '80vh'],
          x: ['75vw', '72vw', '78vw', '75vw'],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
          delay: 7,
        }}
      >
        🌰
      </motion.div>
    </div>
  );
}
