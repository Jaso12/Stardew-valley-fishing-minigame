<template>
    <div id="caughtFishDialog">
        <img id="caughtFishDialogBackground" :src="caughtFishDialog" alt="caughtFishDialogBackground" />
        <div id="caughtFishDialogFishNameWrapper">
            <div id="caughtFishDialogFishName">
                <slot name="fishName" />
            </div>
        </div>
        <BaseFishIcon id="caughtFishDialogFishIcon" :fishType="fishType" />
        <div id="caughtFishDialogLength">
            <slot name="fishInchesLabel" />
        </div>
        <div id="caughtFishDialogInches">
            <slot name="fishInches" />
        </div>
    </div>
</template>

<script>
import BaseFishIcon from './BaseFishIcon.vue';
import caughtFishDialog from '@/assets/img/caught_fish_dialog.png';
import { SCALE_FACTOR } from '@/../public/globals';

export default {
    name: "BaseCaughtFishDialog",
    components: {
        BaseFishIcon
    },
    props: {
        fishType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            caughtFishDialog,
            SCALE_FACTOR,
            backgroundWidth: '73px',
            backgroundHeight: '49px'
        };
    },
    computed: {
        backgroundImage() {
            return `url(${caughtFishDialog})`;
        }
    }
};
</script>

<style>
#caughtFishDialog {
    position: absolute;
    top: 250px;
    left: 730px;
}
#caughtFishDialogBackground {
    position: absolute;
    transform: scale(v-bind(SCALE_FACTOR));
    image-rendering: pixelated;
    transform-origin: top left;
    width: v-bind(backgroundWidth);
    height: v-bind(backgroundHeight);
}
#caughtFishDialogFishNameWrapper {
    display: flex;
    width: calc(v-bind(backgroundWidth) * v-bind(SCALE_FACTOR));
    height: calc(v-bind(backgroundHeight) * v-bind(SCALE_FACTOR));
    justify-content: center;
    margin-top: 10px;
}
#caughtFishDialogFishName {
    position: relative;
    filter: invert(1);
}
#caughtFishDialogFishIcon {
    position: absolute;
    transform: scale(v-bind(SCALE_FACTOR));
    image-rendering: pixelated;
    top: 96px;
    left: 64px;
}
#caughtFishDialogLength {
    position: absolute;
    filter: invert(1);
    top: 74px;
    left: 142px;
}
#caughtFishDialogInches {
    position: absolute;
    filter: invert(1);
    top: 109px;
    left: 177px;
}
</style>
