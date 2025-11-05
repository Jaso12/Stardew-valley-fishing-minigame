<template>
    <div id="fishingPopupWrapper" :style="fishingPopupWrapperStyle">
        <img id="fishingPopupBackgroud" :src="fishingPopup" alt="fishingPopup" />
        <img id="spool" :src="spool" alt="spool" :class="spoolClass" />
        <slot />
    </div>
</template>

<script>
import spool from '@/assets/img/spool.png';
import fishingPopup from '@/assets/img/fishing_popup.png';
import { SCALE_FACTOR } from '@/../public/globals';

export default {
    name: "BaseMinigame",
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        spoolRotationType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            spool,
            fishingPopup,
            SCALE_FACTOR
        };
    },
    computed: {
        fishingPopupWrapperStyle() {
            return this.visible ? '' : 'opacity: 0;';
        },
        spoolClass() {
            return this.spoolRotationType === 'clockwise' ? 'rotateClockWise' : 'rotateAntiClockWise';
        }
    }
};
</script>

<style scoped>
#fishingPopupWrapper {
    position: absolute;
    top: 200px;
    left: 530px;
    image-rendering: pixelated;
}
#fishingPopupBackgroud {
    position: absolute;
    transform-origin: top left;
    transform: scale(v-bind(SCALE_FACTOR));
}
@keyframes rotateSpoolClockWise {
    from {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(0deg);
    }
    to {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(360deg);
    }
}
@keyframes rotateSpoolAntiClockWise {
    from {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(0deg);
    }
    to {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(-360deg);
    }
}
#spool {
    position: absolute;
    top: 522px;
    left: 37px;
    transform-origin: 50% 100%;
}
.rotateClockWise {
    animation: rotateSpoolClockWise 0.25s linear infinite;
}
.rotateAntiClockWise {
    animation: rotateSpoolAntiClockWise 1s linear infinite;
}
</style>
