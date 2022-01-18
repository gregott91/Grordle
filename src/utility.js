import { State } from "./constants.js"

export function isLetter(input) {
    return (/[a-zA-Z]/).test(input) && input.length == 1
}

export function getEmptyGuess(index, letterCount) {
    return {id: index, text: '', states: Array(letterCount).fill(State.Pending) }
}