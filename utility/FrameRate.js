import React, { useEffect, useRef } from 'react';

const useFrameRateStandardization = (targetFPS = 60) => {
    const frameDuration = 1000 / targetFPS;
    const lastFrameTime = useRef(Date.now());

    useEffect(() => {
        const frameCallback = () => {
            const now = Date.now();
            const delta = now - lastFrameTime.current;

            if (delta >= frameDuration) {
                lastFrameTime.current = now - (delta % frameDuration);
            }

            requestAnimationFrame(frameCallback);
        };

        const handle = requestAnimationFrame(frameCallback);

        return () => cancelAnimationFrame(handle);
    }, [frameDuration]);
};

export default useFrameRateStandardization;
