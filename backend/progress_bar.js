import * as constants from '../public/globals.js';

export default function ProgressBar(fishSpeed, finishCallback, broadcast) {
    let lastSwapPosition;
    let lastSwapAt;
    let direction;
    let state;
    let t1, t2;
    
    let fishDirection, fishLastSwapAt, fishLastSwapPosition;
    let catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition;

    const start = () => {
        lastSwapPosition = constants.PROGRESS_BAR_INITIAL_POSITION;
        lastSwapAt = Date.now();
        direction = "down";
        state = "in_progress";
        broadcast(direction, lastSwapAt, lastSwapPosition, state);
        
        scheduleLimitTimer();
        scheduleTickTimer();
    };

    const scheduleLimitTimer = () => {
        const timeToLimit = constants.timeForProgressBarToReachLimit(direction, lastSwapPosition);
        
        t1 = setTimeout(() => {
            state = direction === "up" ? "successful" : "failed";
            clearInterval(t2);
            finishCallback(state);
            broadcast(direction, lastSwapAt, lastSwapPosition, state);
        }, timeToLimit);
    };

    const scheduleTickTimer = () => {
        t2 = setInterval(() => {
            const catchBarPos = constants.computeCatchBarCurrentPosition(catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition);
            const fishPos = constants.computeFishCurrentPosition(fishDirection, fishLastSwapAt, fishLastSwapPosition, fishSpeed);
            
            const touching = constants.catchBarAndFishTouch(fishPos, catchBarPos);
            
            if ((direction === "down" && touching) || (direction === "up" && !touching)) {
                swapDirection();
            }
        }, constants.PROGRESS_BAR_TICK_FREQUENCY);
    };

    const swapDirection = () => {
        lastSwapPosition = constants.computeProgressBarCurrentPosition(direction, lastSwapAt, lastSwapPosition);
        direction = direction === "up" ? "down" : "up";
        lastSwapAt = Date.now();
        
        broadcast(direction, lastSwapAt, lastSwapPosition, state);
        clearTimeout(t1);
        scheduleLimitTimer();
    };

    const fishSwappedDirection = (newDirection, newLastSwapAt, newLastSwapPosition) => {
        fishDirection = newDirection;
        fishLastSwapAt = newLastSwapAt;
        fishLastSwapPosition = newLastSwapPosition;
    };

    const catchBarSwappedDirection = (newDirection, newLastSwapAt, newLastSwapPosition) => {
        catchBarDirection = newDirection;
        catchBarLastSwapAt = newLastSwapAt;
        catchBarLastSwapPosition = newLastSwapPosition;
    };

    const getInfo = () => {
        return {
            direction: direction,
            lastSwapAt: lastSwapAt,
            lastSwapPosition: lastSwapPosition,
            state: state
        };
    };

    return {
        start,
        fishSwappedDirection,
        catchBarSwappedDirection,
        getInfo
    };
}