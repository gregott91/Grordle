import { answers, validGuesses } from "./dict.js"
import { isLetter } from "./utility.js"
import { State } from "./constants.js"

var guessCount = 10
var letterCount = 5
var answer = answers[Math.floor(Math.random()*answers.length)].toUpperCase();

var guesses = []
for (var i = 0; i < guessCount; i++) {
    guesses.push({id: i, text: '', states: Array(letterCount).fill(State.Pending) })
}

Vue.component('grordle-cell', {
    props: ['letter', 'state'],
    template: `
    <div class="grordle-cell" v-bind:class="classObject">
        {{ letter }}
    </div>`,
    computed: {
      classObject: function () {
        return {
          'pending-cell': this.state == State.Pending,
          'present-cell': this.state == State.Present,
          'correct-cell': this.state == State.Correct,
          'absent-cell': this.state == State.Absent
        }
      }
    }
})

Vue.component('grordle-row', {
    props: ['guess'],
    template: `
<div class="d-flex justify-content-center flex-row">
    <grordle-cell v-for="index in ${letterCount}" :key="index" v-bind:letter="guess.text.charAt(index - 1)" v-bind:state="guess.states[index - 1]"></grordle-cell>
</div>`
})

var board = new Vue({
    el: '#grordle-board',
    data: {
        activeRow: 0,
        guesses: guesses,
    },
    methods: {
        addLetter: function (letter) {
            if (this.guesses[this.activeRow].text.length < letterCount) {
                this.guesses[this.activeRow].text += letter
            }
        },
        removeLetter: function () {
            this.guesses[this.activeRow].text = this.guesses[this.activeRow].text.slice(0, -1)
        },
        makeGuess: function () {
            var guess = this.guesses[this.activeRow].text
            if (this.isValid) {
                var states = []
                for (var i = 0; i < guess.length; i++) {
                    var newState = State.Absent
                    if (guess.charAt(i) == answer.charAt(i)) {
                        newState = State.Correct
                    } else if (answer.includes(guess.charAt(i))) { 
                        newState = State.Present
                    }

                    states.push(newState)
                }

                this.guesses[this.activeRow].states = states
                this.activeRow++
            }
        }
    },
    computed: {
        isValid: function() {
            var guess = this.guesses[this.activeRow].text
            var valid = false
            if (guess.length == letterCount) {
                valid = validGuesses.includes(guess.toLowerCase())
            }

            return valid
        },
        isPending: function() {
            return this.guesses[this.activeRow].text.length < letterCount
        }
    }
})

document.onkeydown = function (e) {
    e = e || window.event;
    
    if (e.key == 'Enter') {
        board.makeGuess()
    } else if (e.key == 'Backspace') {
        board.removeLetter()
    } else if (isLetter(e.key)) {
        board.addLetter(e.key.toUpperCase())
    }
};