import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ScrollReveal = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    threshold = 0.1
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold
    });

    const directions = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 },
        fade: { y: 0, x: 0 }
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directions[direction]
            }}
            animate={inView ? {
                opacity: 1,
                y: 0,
                x: 0
            } : {}}
            transition={{
                duration,
                delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
