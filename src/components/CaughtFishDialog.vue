<template>
  <BaseCaughtFishDialog :fishType="fishType">
    <template #fishName>
      <Sentence :text="fishName" />
    </template>

    <template #fishInchesLabel>
      <Sentence text="Length:" />
    </template>

    <template #fishInches>
      <Sentence :text="`${length} in.`" />
    </template>
  </BaseCaughtFishDialog>
</template>

<script>
import BaseCaughtFishDialog from '@/base_components/BaseCaughtFishDialog.vue';
import Sentence from '@/components/Sentence.vue';

import {
  DIFFICULTY_TO_FISH_NAME,
  DIFFICULTY_TO_FISH_TYPE,
  DIFFICULTY_TO_FISH_MIN_LENGTH,
  DIFFICULTY_TO_FISH_MAX_LENGTH,
} from '@/../public/globals.js';

export default {
  name: 'CaughtFishDialog',
  components: {
    BaseCaughtFishDialog,
    Sentence
  },
  props: {
    difficulty: {
      type: String,
      required: true
    }
  },
  computed: {
    fishName() {
      return DIFFICULTY_TO_FISH_NAME[this.difficulty] || '???';
    },
    fishType() {
      return DIFFICULTY_TO_FISH_TYPE[this.difficulty] || '';
    },
    length() {
      const min = DIFFICULTY_TO_FISH_MIN_LENGTH[this.difficulty] ?? 1;
      const max = DIFFICULTY_TO_FISH_MAX_LENGTH[this.difficulty] ?? 10;
      return (Math.random() * (max - min) + min).toFixed(1);
    }
  }
};
</script>
