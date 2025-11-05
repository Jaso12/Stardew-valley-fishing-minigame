<template>
    <div id="capturesWrapper">
        <img alt="capturesLeftMargin" :src="capturesLeftMargin" />
        <div>
            <img
                v-for="i in ATTEMPTS_DIFFICULTY.length"
                class="captureResultWrapper"
                :src="captureResultWrapper"
            />
        </div>
        <div id="capturedFishWrapper">
            <slot />
        </div>
        <img alt="capturesRightMargin" :src="capturesRightMargin" />
    </div>
</template>

<script>
import capturesLeftMargin from '@/assets/img/captures_left_margin.png';
import capturesRightMargin from '@/assets/img/captures_right_margin.png';
import captureResultWrapper from '@/assets/img/capture_result_wrapper.png';
import { ATTEMPTS_DIFFICULTY, SCALE_FACTOR } from '@/../public/globals';

export default {
    name: "BaseCaptures",
    data() {
        return {
            SCALE_FACTOR,
            ATTEMPTS_DIFFICULTY,
            capturesLeftMargin,
            capturesRightMargin,
            captureResultWrapper
        };
    },
    computed: {
        wrapperLeft() {
            const marginImgWidth = 4;
            const marginsWidth = marginImgWidth * 2 * SCALE_FACTOR;
            const captureResultWrapperWidth = 24;
            const capturesWidth = ATTEMPTS_DIFFICULTY.length * captureResultWrapperWidth * SCALE_FACTOR;
            return (window.screen.width / 2) - (marginsWidth / 2) - (capturesWidth / 2);
        }
    }
};
</script>

<style scoped>
#capturesWrapper {
    position: absolute;
    top: 60px;
    left: 765px;  
    image-rendering: pixelated;
    transform: scale(v-bind(SCALE_FACTOR));
    transform-origin: top left;
    display: flex;
    height: 24px;
}

.captureResultWrapper {
    height: 100%;
}

#capturedFishWrapper {
    position: absolute;
    top: 4px;
    left: 4px;
}
</style>
