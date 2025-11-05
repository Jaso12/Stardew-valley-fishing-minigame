import * as constants from '../public/globals.js';
import ProgressBar from './progress_bar.js';
import CatchBar from './catch_bar.js';
import Fish from './fish.js';

export default function CatchingMinigame(finishCallback, broadcast) {
    let progressBar;
    let catchBar;
    let fish;

    const start = (difficulty) => {
        const fishSpeed = constants.DIFFICULTY_TO_FISH_SPEED[difficulty];

        progressBar = new ProgressBar(fishSpeed, () => {
            fish.finish();
            finishCallback();
        }, (direction, lastSwapAt, lastSwapPosition, state) => {
            broadcast({
                type: 'progressBarInfo',
                data: {direction, lastSwapAt, lastSwapPosition, state}
            });
        });
        
        catchBar = new CatchBar((direction, lastSwapAt, lastSwapPosition) => {
            progressBar.catchBarSwappedDirection(direction, lastSwapAt, lastSwapPosition);
            broadcast({
                type: 'catchBarInfo',
                data: { direction, lastSwapAt, lastSwapPosition }
            });
        });
        
        fish = new Fish(fishSpeed, (direction, lastSwapAt, lastSwapPosition) => {
            progressBar.fishSwappedDirection(direction, lastSwapAt, lastSwapPosition);
            broadcast({
                type: 'fishInfo',
                data: { direction, lastSwapAt, lastSwapPosition, speed: fishSpeed }
            });
        });

        progressBar.start();
        catchBar.start();
        fish.start();
    };

    const getInfo = () => {
        return {
            progressBarInfo: progressBar.getInfo(),
            catchBarInfo: catchBar.getInfo(),
            fishInfo: fish.getInfo()
        };
    };

    const updateCatchBarDirection = (newDirection) => {
        catchBar.updateDirection(newDirection);
    };

    return {
        start,
        getInfo,
        updateCatchBarDirection
    };
}
