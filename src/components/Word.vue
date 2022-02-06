<template lang="pug">
.word-character.flex.items-center.justify-center.m-1(
  v-bind:class="wordClass"
)
  span(
    v-if="word"
  )
    | {{ word }}
</template>

<script>
export default {
  name: "Word",
  props: {
    word: String,
    usedWords: Object,
    revealed: Boolean,
    index: Number,
    result: String,
  },
  computed: {
    currentChar() {
      return this.word[this.index]
    },
    currentCharResult() {
      if(!this.result) {
        return null
      }
      return this.result[this.index]
    },
    wordClass() {
      if(!this.word) {
        return 'empty';
      }
      
      if(this.currentCharResult && this.revealed) {
        if(this.currentCharResult === 'O') {
          return 'correct';
        }
        if(this.currentCharResult === 'S') {
          return 'almost';
        }
        if(this.currentCharResult === 'X') {
          return 'wrong';
        }
      }
    }
  }
}
</script>

<style lang="scss">
.word-character {
  width: 60px;
  height: 60px;
  border: 2px solid black;
  font-size: 20px;
  text-align: center;
  vertical-align: center;
  
  @apply uppercase;
  @apply font-semibold;

  &.empty {
    border: 2px solid #AAA;
  }

  &.correct {
    background: #6aaa64;
    border-color: #6aaa64 !important;
    color: white;
  }
  &.almost {
    background: #c9b458;
    border: #c9b458 !important;
    color: white;
  }

  &.wrong {
    background: #333; 
    border: #333 !important;
    color: white;
  }
}
</style>