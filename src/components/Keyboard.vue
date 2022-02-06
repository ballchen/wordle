<template lang="pug">
.keyboard(
  class="w-full"
)
  div.flex.items-center.justify-center
    div(
      class="m-2px"
      v-for="char in 'qwertyuiop'"
    )
      button.keyboard-button(
        v-bind:class="keyboardButtonClass(char)"
        @click="input(char)"
      ) {{ char }}
  div.flex.items-center.justify-center
    div(
      class="m-2px"
      v-for="char in 'asdfghjkl'"
    )
      button.keyboard-button(
        v-bind:class="keyboardButtonClass(char)"
        @click="input(char)"
      ) {{ char }}
  div.flex.items-center.justify-center
    div(
      class="m-2px"
    )
      button.keyboard-button(
        @click="input('Enter')"
      ) ENTER
    div(
      class="m-2px"
      v-for="char in 'zxcvbnm'"
    )
      button.keyboard-button(
        v-bind:class="keyboardButtonClass(char)"
      ) {{ char }}
    div(
      class="m-2px"
    )
      button.keyboard-button(
        @click="input('Backspace')"
      ) ⌫
</template>

<script>
export default {
  name: 'Keyboard',
  props: {
    usedWords: {
      type: Object,
      default: {
        correct: [],
        almost: [],
        wrong: [],
      }
    }
  },
  methods: {
    input(char) {
      this.$emit('input', char)
    },
    keyboardButtonClass(c) {
      if(this.usedWords.correct.indexOf(c) > -1) {
        return 'correct';
      }
      if(this.usedWords.almost.indexOf(c) > -1) {
        return 'almost';
      }
      if(this.usedWords.wrong.indexOf(c) > -1) {
        return 'wrong';
      }
    },
  }

}
</script>

<style lang="scss">
.keyboard {
  width: 600px;
}
.keyboard-button {
  background: #AAA;
  font-weight: 700;
  color: white;
  min-width: 30px;
  font-size: 14px;

  @apply rounded;
  @apply px-2;
  @apply py-3;
  @apply uppercase;


  &.correct {
    background: #6aaa64;
  }
  &.almost {
    background: #b59f3b;
  }

  &.wrong {
    background: #333; 
  }
}
</style>