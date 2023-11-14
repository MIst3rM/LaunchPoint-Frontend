import { useState, useLayoutEffect, RefObject } from "react";

export const useDimensions = (ref: RefObject<HTMLElement>) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const updateDimensions = () => {
            if (ref.current) {
                setDimensions({
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight,
                });
            }
        };

        updateDimensions();

        window.addEventListener("resize", updateDimensions);

        return () => window.removeEventListener("resize", updateDimensions);
    }, [ref]);

    // Return null for unmeasured state
    if (!dimensions.width || !dimensions.height) {
        return null;
    }

    return dimensions;
};
