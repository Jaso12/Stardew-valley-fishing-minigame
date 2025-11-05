<template>
    <BaseBackground />

    <BasePlayer :state="playerState" :captured-fish="capturedFish" @animation-finished="enableButton" @showing-caught-fish="displayDialog" />

    <Hud v-model:enable-action-button-trigger="buttonState" v-model:show-caught-fish-trigger="showDialog"
        @set-player-state="setPlayerState" @set-captured-fish="setCapturedFish" />
</template>

<script>
import BaseBackground from '@/base_components/BaseBackground.vue';
import BasePlayer from '@/base_components/BasePlayer.vue';
import Hud from '@/components/Hud.vue';

export default {
    name: 'App',
    components: {
        BaseBackground,
        BasePlayer,
        Hud
    },
    data() {
        return {
            buttonState: true,
            showDialog: false,
            playerState: 'standing',
            capturedFish: '',
        };
    },
    methods: {
        enableButton() {
            this.buttonState = true;
        },
        displayDialog() {
            this.showDialog = true;
        },
        setPlayerState(state) {
            this.playerState = state;
        },
        setCapturedFish(fish) {
            this.capturedFish = fish;
        },
    },
}

</script>
