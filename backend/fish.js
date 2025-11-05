import * as constants from '../public/globals.js';

export default function Fish(speed, swappedDirectionCallback) {
    let lastSwapPosition;
    let lastSwapAt;
    let direction;
    let swapTimer;

    const start = () => {
        lastSwapPosition = Math.random() * constants.FISH_MAX_POS;
        lastSwapAt = Date.now();
        direction = "down";

        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
        scheduleNextSwap();
    };

    const scheduleNextSwap = () => {
        const timeToNextSwap = constants.computeFishTimeToNextSwap(direction, lastSwapPosition, speed);
        
        swapTimer = setTimeout(() => {
            lastSwapPosition = constants.computeFishCurrentPosition(direction, lastSwapAt, lastSwapPosition, speed);
            lastSwapAt = Date.now();
            direction = direction === "up" ? "down" : "up";

            swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
            scheduleNextSwap();
        }, timeToNextSwap);
    };

    const getInfo = () => {
        return {
            direction: direction,
            lastSwapAt: lastSwapAt,
            lastSwapPosition: lastSwapPosition
        };
    };

    const finish = () => {
        clearTimeout(swapTimer);
    };

    return {
        start,
        getInfo,
        finish
    };
}
