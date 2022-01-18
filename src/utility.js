export function isLetter(input) {
    return (/[a-zA-Z]/).test(input) && input.length == 1
}