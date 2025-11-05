import * as constants from '../public/globals.js';

export default function CatchBar(swappedDirectionCallback){
    let lastSwapAt;
    let lastSwapPosition;
    let direction;

    const start = () => {
        lastSwapAt = Date.now();
        lastSwapPosition = constants.CATCH_BAR_INITIAL_POSITION;
        direction = "down";

        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    }

    const updateDirection = newDirection => {
        lastSwapPosition = constants.computeCatchBarCurrentPosition(direction, lastSwapAt, lastSwapPosition);
        direction = newDirection;
        lastSwapAt = Date.now();

        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    }

    const getInfo = () => {
        return {
            direction: direction,
            lastSwapAt: lastSwapAt,
            lastSwapPosition: lastSwapPosition
        }
    }

    return {
        start,
        updateDirection,
        getInfo
    }
}