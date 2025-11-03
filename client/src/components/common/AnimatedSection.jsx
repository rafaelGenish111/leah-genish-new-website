import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedSection = ({ children, delay = 0, direction = 'up' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const directions = {
        up: { y: 60, opacity: 0 },
        down: { y: -60, opacity: 0 },
        left: { x: -60, opacity: 0 },
        right: { x: 60, opacity: 0 },
        scale: { scale: 0.8, opacity: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={directions[direction]}
            animate={isInView ? { x: 0, y: 0, scale: 1, opacity: 1 } : {}}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.4, 0, 0.2, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
