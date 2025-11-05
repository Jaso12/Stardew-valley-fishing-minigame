<template>
    <BaseMinigame :visible="visible" :spoolRotationType="spoolRotationType">
        <template #default>
            <BaseProgressBar :direction="progressBar.direction" :last-swap-position="progressBar.lastSwapPosition"
                :last-swap-at="progressBar.lastSwapAt" />

            <BaseCatchBar :direction="catchBar.direction" :last-swap-position="catchBar.lastSwapPosition"
                :last-swap-at="catchBar.lastSwapAt" />

            <BaseFish :direction="fish.direction" :last-swap-position="fish.lastSwapPosition"
                :last-swap-at="fish.lastSwapAt" :speed="speed" :is-legend="isLegend" />
        </template>
    </BaseMinigame>
</template>

<script>
import BaseMinigame from '@/base_components/BaseMinigame.vue';
import BaseCatchBar from '@/base_components/BaseCatchBar.vue';
import BaseFish from '@/base_components/BaseFish.vue';
import BaseProgressBar from '@/base_components/BaseProgressBar.vue';
import {
    GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY,
    DIFFICULTY_TO_FISH_SPEED,
    DIFFICULTY_TO_FISH_TYPE
} from '../../public/globals';

export default {
    name: 'Minigame',
    components: {
        BaseMinigame,
        BaseProgressBar,
        BaseCatchBar,
        BaseFish,
    },
    props: {
      difficulty: {
            type: String,
            required: true
      },
      visible: {
          type: Boolean,
          required: true
      }
    },
    data() {
        return {
            progressBar: {
                direction: null,
                lastSwapPosition: null,
                lastSwapAt: null,
            },
            catchBar: {
                direction: null,
                lastSwapPosition: null,
                lastSwapAt: null,
            },
            fish: {
                direction: null,
                lastSwapPosition: null,
                lastSwapAt: null,
            },
        };
    },
    emits: ['finished'],
    computed: {
        speed() {
            return DIFFICULTY_TO_FISH_SPEED[this.difficulty] || 0;
        },
        spoolRotationType() {
            return this.progressBar.direction === 'up' ? 'clockwise' : 'anticlockwise';
        },
        isLegend() {
            return DIFFICULTY_TO_FISH_TYPE[this.difficulty] === 'legendary';
        }
    },
    methods: {  
        processProgressBarInfo(nProgressBar) {
            const { direction, lastSwapAt, lastSwapPosition, state } = nProgressBar;

            if (!nProgressBar) return;
            else if (state !== "in_progress") {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
                this.$emit('finished', (state === "successful") ? true : false);
                return;
            } else {
                this.progressBar.direction = direction;
                this.progressBar.lastSwapAt = lastSwapAt;
                this.progressBar.lastSwapPosition = lastSwapPosition;
            }
        },
        processCatchBarInfo(nCatchBar) {
            const { direction, lastSwapAt, lastSwapPosition } = nCatchBar;

            if (!nCatchBar) return;

            this.catchBar.direction = direction;
            this.catchBar.lastSwapAt = lastSwapAt;
            this.catchBar.lastSwapPosition = lastSwapPosition;
        },
        processFishInfo(nFish) {
            const { direction, lastSwapAt, lastSwapPosition, speed } = nFish;

            if (!nFish) return;

            this.fish.direction = direction;
            this.fish.lastSwapAt = lastSwapAt;
            this.fish.lastSwapPosition = lastSwapPosition;

            if (speed) this.fish.speed = speed;
        },
    },
    mounted() {
        this.wsConnected = false;
        this.pollingInterval = null;
        const ws = new WebSocket('ws://localhost:8080');

        ws.addEventListener('open', () => {
            this.wsConnected = true;
        });

        ws.addEventListener('message', (message) => {
            try {
                const result = JSON.parse(message.data);

                switch (result.type) {
                    case 'progressBarInfo':
                        this.processProgressBarInfo(result.data);
                        break;
                    case 'catchBarInfo':
                        this.processCatchBarInfo(result.data);
                        break;
                    case 'fishInfo':
                        this.processFishInfo(result.data);
                        break;
                    default:
                        console.warn('Unknown message type:', data.type);
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        });

        ws.addEventListener('close', () => {
            this.wsConnected = false;
        });

        ws.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            this.wsConnected = false;
        });
    },
    watch: {
        visible(newVisible) {
            if (newVisible && !this.wsConnected) {
                this.pollingInterval = setInterval(async () => {
                    try {
                        const response = await fetch('http://localhost:8081/get_mini_game_info');

                        if (!response.ok) throw new Error('Failed to fetch /get_mini_game_info.')

                        const { progressBarInfo, catchBarInfo, fishInfo } = await response.json();

                        this.processProgressBarInfo(progressBarInfo);
                        this.processCatchBarInfo(catchBarInfo);
                        this.processFishInfo(fishInfo);
                    } catch (error) {
                        console.error(error);
                    }
                }, GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY);
            } else if (!newVisible && this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
        }
    }
};
</script>

<syle></syle>