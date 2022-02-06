<template lang="pug">
.w-full.flex.flex-col.items-center
  .word-row.flex.flex-row(
    v-for="j in [0, 1, 2, 3, 4, 5]"
    v-bind:id="`trial-${j}`"
  )
    div.px-3.flex.flex-row
      Word(
        v-for="i in [0, 1, 2, 3, 4]"
        :result="answers[j].result"
        :index="i"
        :word="answers[j].word[i]" :usedWords="usedWords" :revealed="isTrialRevealed(j)"
      )
  Keyboard.mt-3(
    :usedWords="usedWords"
    @input="input"
  )

</template>


<script>
import _ from "lodash";
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";

import Word from "./Word.vue";
import Keyboard from "./Keyboard.vue";
import dictionaryWithoutQuestions from '../assets/dictionary';
import questions from '../assets/questions';

const dictionary = dictionaryWithoutQuestions.concat(questions);

function isValidWord(word, dictionary) {
  return (dictionary.indexOf(word) !== -1)
}

export default {
  name: 'Wordle',
  components: {
    Word,
    Keyboard,
  },
  data() {
    return {
      question: questions[_.random(0, questions.length) - 1],
      // question: 'moist',
      answers: [
        {
          word: '',
          result: null,
        },
        {
          word: '',
          result: null,
        },
        {
          word: '',
          result: null,
        },
        {
          word: '',
          result: null,
        },
        {
          word: '',
          result: null,
        },
        {
          word: '',
          result: null,
        },  
      ],
      usedWords: {
        almost: [],
        correct: [],
        wrong: [],
      },
      
      trialCount: 0,
    }
  },
  computed: {
    isWordleFinished() {
      if(
        _.find(this.answers, {result: 'OOOOO'}) ||
        this.trialCount >= 6
      ) {
        return true;
      }
    }
  },
  methods: {
    isTrialRevealed(trial) {
      return !!this.answers[trial].result;
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
    input(char) {
      if(this.isWordleFinished) {
        return
      }
      const letters = 'abcdefghijklmnopqrstuvwxyz'
      if(letters.indexOf(char) > -1) {
        if(this.answers[this.trialCount].word.length < 5) {
          this.answers[this.trialCount].word += char.toLowerCase();
        }
      }
      if(char === 'Enter') {
        if(this.answers[this.trialCount].word.length === 5) {
          if(!isValidWord(this.answers[this.trialCount].word, dictionary)) {
            useToast().error("沒有這個字！", {
              position: "top-center",
              timeout: 1000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
              draggable: true,
              draggablePercent: 0.6,
              showCloseButtonOnHover: false,
              hideProgressBar: true,
              closeButton: "button",
              icon: true,
              rtl: false
            });
            return
          }
          const {result, usedWords} = this.calculateResult(this.answers[this.trialCount].word, this.question);
          this.answers[this.trialCount].result = result;
          this.usedWords.almost = _.uniq(this.usedWords.almost.concat(usedWords.almost))
          this.usedWords.correct = _.uniq(this.usedWords.correct.concat(usedWords.correct))
          this.usedWords.wrong = _.uniq(this.usedWords.wrong.concat(usedWords.wrong))
          if(result !== 'OOOOO') {
            this.trialCount += 1;
            if(this.trialCount > 5) {
              Swal.fire({
                text: `你失敗了！ 答案是 ${this.question}`,
                allowEnterKey: false,
              })
            }
          } else if(
            result === 'OOOOO'
          ) {
            this.trialCount += 1;
            Swal.fire({
              allowEnterKey: false,
              text: "你成功了",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'OK',
              cancelButtonText: 'Share',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                
              } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
              ) {
                this.outputSharing();
                Swal.fire(
                  '已複製',
                )
              }
            })
          }
        }
      }

      if(char === 'Backspace') {
        const currentWord = this.answers[this.trialCount].word;
        this.answers[this.trialCount].word = this.answers[this.trialCount].word.substring(0, (currentWord.length - 1));
      }
    },
    keyboardInput(event) {
      if(
        !event.metaKey && 
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        this.input(event.key);
      }
    },

    calculateResult(input, question) {
      let result = ''
      const usedWords = {
        correct: [],
        wrong: [],
        almost: [],
      };

      for (let i = 0; i < input.length; i++) {
        if(
          question[i] === input[i]
        ) {
          result += 'O'
          usedWords.correct.push(input[i])
        } else if(
          question[i] !== input[i] &&
          question.indexOf(input[i]) >= 0
        ) {
          result += 'S'
          usedWords.almost.push(input[i])
        } else {
          result += 'X'
          usedWords.wrong.push(input[i])
        }
      }

      return {
        result,
        usedWords,
      };
    },
    outputSharing() {
      let resultConcat = `Wordle ${this.question} ${this.trialCount}/6\r\n\r\n`
      _.forEach(this.answers, (value) => {

        if(value.result) {
          resultConcat += `${value.result}\r\n`
        }
      })

      resultConcat = resultConcat.replaceAll('O', '🟩');
      resultConcat = resultConcat.replaceAll('X', '⬜');
      resultConcat = resultConcat.replaceAll('S', '🟨');

      console.log(resultConcat);

      this.$copyText(resultConcat)
      // return resultConcat;

    }
  },
  mounted() {
    const self = this;
    window.addEventListener('keydown', function(ev) {
      self.keyboardInput(ev)
    });
  }
}
</script>

<style scoped lang="scss">
a {
  color: #42b983;
}

</style>
