import CatchingMinigame from "./catching_minigame.js"
import * as constants from '../public/globals.js';

export default function Game(broadcast) {
    let playerState = "standing";
    let attemptNumber = 0;
    let bitePromiseResolve = null;
    let biteTimer = null;
    let escapeTimer = null;
    let catchingMinigame = CatchingMinigame(
        () => {playerState = "standing"},
        broadcast);

    const castLine = () => {
        if (playerState != "standing"){
            return playerState;
        }
        playerState = "line_cast";

        biteTimer = setTimeout(() => {
            playerState = "fish_bit";
            if (bitePromiseResolve) {
                bitePromiseResolve();
            }

            escapeTimer = setTimeout(() => {
                playerState = "standing";
            }, constants.PULL_ROD_TIMEOUT_MS);
        }, constants.FISH_BIT_TIMEOUT_MS);

        return null;
    }

    const waitForBite = () => {
        if (playerState !== "line_cast") {
            return Promise.reject(playerState);
        }
        return new Promise((resolve) => {
            bitePromiseResolve = resolve;
        });
    };

    const reelIn = () => {
        if (playerState === "line_cast") {

            clearTimeout(biteTimer);
            playerState = "standing";

            if (bitePromiseResolve) {
                bitePromiseResolve = null;
            }

            return { errorCode: playerState };
        } else if (playerState === "fish_bit") {
                
            clearTimeout(escapeTimer);

            playerState = "playing_minigame";
            const selectedDifficulty = constants.ATTEMPTS_DIFFICULTY[attemptNumber];
            catchingMinigame.start(selectedDifficulty);

            attemptNumber = (attemptNumber + 1) % constants.ATTEMPTS_DIFFICULTY.length;

            return { difficulty: selectedDifficulty };
        }
        return { errorCode: "standing" };
    };

    const updateCatchBarDirection = (direction) => {
        catchingMinigame.updateCatchBarDirection(direction);
    };

    const getCatchingMiniGameInfo = () => {
        return catchingMinigame.getInfo();
    };

    return {
        castLine,
        waitForBite,
        reelIn,
        updateCatchBarDirection,
        getCatchingMiniGameInfo
    };
}