<template>
    <div>
        <Minigame :visible="minigameVisible" :difficulty="difficulty" @finished="processFinished" />

        <BaseCaptures>
            <template #default>
                <BaseAttempt v-for="(attempt, index) in attempts" :key="index" :difficulty="attempt.difficulty"
                    :successful="attempt.successful" />
            </template>
        </BaseCaptures>

        <CaughtFishDialog v-if="showCaughtFishTrigger" :difficulty="difficulty" />

        <BaseYellowIndicator :show-trigger="showTrigger" />

        <BaseActionButton :text="buttonAction" :disabled="!enableActionButtonTrigger" @click="processClick"
            @pressed="processMoveUp" @released="processStopMoveUP" />
    </div>
</template>

<script>
import Minigame from '@/components/Minigame.vue';
import BaseAttempt from '@/base_components/BaseAttempt.vue';
import BaseCaptures from '@/base_components/BaseCaptures.vue';
import BaseActionButton from '@/base_components/BaseActionButton.vue';
import CaughtFishDialog from '@/components/CaughtFishDialog.vue';
import BaseYellowIndicator from '@/base_components/BaseYellowIndicator.vue';
import { ATTEMPTS_DIFFICULTY, DIFFICULTY_TO_FISH_TYPE, PULL_ROD_TIMEOUT_MS } from '@/../public/globals';

const uri = "http://localhost:8081";

export default {
    name: 'Hud',
    components: {
        Minigame,
        BaseAttempt,
        BaseCaptures,
        BaseActionButton,
        CaughtFishDialog,
        BaseYellowIndicator
    },
    props: {
        showCaughtFishTrigger: {
            type: Boolean,
            require: true
        },
        enableActionButtonTrigger: {
            type: Boolean,
            require: true
        }
    },
    emits: ['setPlayerState', 'setCapturedFish', 'update:enableActionButtonTrigger', 'update:showCaughtFishTrigger'],
    data() {
        return {
            buttonAction: 'cast',
            minigameVisible: false,
            showTrigger: 0,
            difficulty: '',
            attempts: [],
        }
    },
    methods: {
        async castLine() {
            try {
                const response = await fetch(`${uri}/cast_line`);

                if (response.status === 200) {
                    this.$emit('setPlayerState', 'casting');
                    this.buttonAction = 'start';
                    this.$emit('update:enableActionButtonTrigger', false);

                    await this.waitForBite();
                }
            } catch (error) {
                console.error("Error while casting line:", error);
            }
        },
        async waitForBite() {
            try {
                const response = await fetch(`${uri}/wait_for_bite`);

                if (response.status === 200) {
                    this.showTrigger += 1;

                    setTimeout(() => {
                        if (!this.minigameVisible) {
                            this.$emit('setPlayerState', 'reeling_in');
                            this.$emit('setCapturedFish', '');
                            this.buttonAction = 'cast';
                            this.$emit('update:enableActionButtonTrigger', false);
                        }
                    }, PULL_ROD_TIMEOUT_MS);
                }
            } catch (error) {
                console.error("Error waiting for bite:", error);
            }
        },
        async reelIn() {
            try {
                const response = await fetch(`${uri}/reel_in`);
                const data = await response.json();

                if (response.status === 200 && data.difficulty) {
                    this.$emit('setPlayerState', 'playing');
                    this.minigameVisible = true;
                    this.difficulty = data.difficulty;
                    this.buttonAction = 'pull';
                } else if (data.errorCode === 'standing') {
                    this.$emit('setPlayerState', 'reeling_in');
                    this.$emit('setCapturedFish', '');
                    this.buttonAction = 'cast';
                    this.$emit('update:enableActionButtonTrigger', false);
                } else {
                    console.error("Unexpected response:", response);
                }
            } catch (error) {
                console.error("Error reeling in:", error);
            }
        },
        async moveCatchBarUp() {
            try {
                const response = await fetch(`${uri}/move_catch_bar_up`);
            } catch (error) {
                console.error("Error moving catch bar up:", error);
            }
        },
        async stopMovingCatchBarUp() {
            try {
                const response = await fetch(`${uri}/stop_moving_catch_bar_up`);
            } catch (error) {
                console.error("Error stop moving catch bar up:", error);
            }
        },
        processFinished(successful) {
            this.minigameVisible = false;
            this.$emit('setPlayerState', 'reeling_in');
            this.$emit('setCapturedFish', (successful) ? DIFFICULTY_TO_FISH_TYPE[this.difficulty] : '');

            this.buttonAction = 'cast';
            this.$emit('update:enableActionButtonTrigger', false)

            this.attempts.push({ difficulty: this.difficulty, successful })
            if (this.attempts.length === ATTEMPTS_DIFFICULTY.length) this.buttonAction = 'retry';
        },
        processClick() {
            if (this.minigameVisible || !this.enableActionButtonTrigger) return;

            switch (this.buttonAction) {
                case 'cast':
                    this.$emit('update:showCaughtFishTrigger', false);
                    this.castLine();
                    break;
                case 'start':
                    this.reelIn();
                    break;
                case 'retry':
                    this.$emit('update:showCaughtFishTrigger', false);
                    this.attempts.length = 0;
                    this.$emit('setCapturedFish', '');
                    this.buttonAction = 'cast';
                    break;
            }
        },
        processMoveUp() {
            if (this.minigameVisible) {
                this.moveCatchBarUp();
            }
        },
        processStopMoveUP() {
            if (this.minigameVisible) {
                this.stopMovingCatchBarUp();
            }
        }
    } 
}

</script>

<style>
</style>