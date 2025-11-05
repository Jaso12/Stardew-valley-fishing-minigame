<template>
    <BaseSentence>
        <template v-slot>
            <Letter
                v-for="(char, index) in text"
                :key="index"
                :character="char"
            />
        </template>
    </BaseSentence>
</template>

<script>
import BaseSentence from '@/base_components/BaseSentence.vue';
import Letter from '@/components/Letter.vue';

export default {
    name: "Sentence",
    components: {
        BaseSentence,
        Letter
    },
    props: {
        text: {
            type: String,
            required: true
        },
    },
};
</script>