const x = {
  0: '[]',
  1: '!![]'
}
const mappings = new Map()
mappings.set(0, '+[]')
mappings.set(1, '+!![]')

const MAX_NUMBER = 1000

const vis = new Map()
vis.set(0, true)
vis.set(1, true)

function tryCounting() {
  for (let i = 1; i <= MAX_NUMBER; i++) {
    mappings.set(i, new Array(i).fill('+!![]').join(''))
  }
}
tryCounting()

function tryDigitizing() {
  for (let i = 10; i <= MAX_NUMBER; i++) {
    const resultDigits = getDigitExpression(i)
    const previousResult = mappings.get(i)
    if (resultDigits.length < previousResult.length) {
      mappings.set(i, resultDigits)
    }
  }
}
tryDigitizing()

function getDigitExpression(number) {
  const digits = String(number)
    .split('')
    .map(x => parseInt(x, 10))
  let resultDigits = digits
    .map(digit => {
      return '[' + mappings.get(digit) + ']'
    })
    .join('+')
  if (typeof eval(resultDigits) !== 'number') {
    resultDigits = '+[' + resultDigits + ']'
  }
  return resultDigits
}

function getExpression(number) {
  if (number === 0) {
    return '+' + x[0]
  } else if (number === 1) {
    return '+' + x[1]
    // } else if (mappings.has(number)) {
    //   return mappings.get(number)
  } else if (vis.has(number)) {
    if (mappings.has(number)) {
      return mappings.get(number)
    }
    // We alr visit this number before but haven't produced a result, need to break recursion
    return new Array(100).fill(getExpression(0)).join('')
  } else if (number > MAX_NUMBER) {
    // Recursing too deep alr, need to break it too
    vis.set(number, true)
    return getExpression(number)
  } else {
    vis.set(number, true)
    const candidates = []
    candidates.push(mappings.get(number))

    // Subtraction
    {
      for (let i = 1; i <= Math.ceil(number / 2); i++) {
        if (number + i > MAX_NUMBER) {
          break
        }
        let things = '-[' + getExpression(i) + ']'
        const resultSubtraction = getExpression(number + i) + things
        candidates.push(resultSubtraction)
      }
    }

    // Multiplication
    {
      for (let i = 2; i <= Math.ceil(Math.sqrt(number)); i++) {
        if (number % i === 0) {
          const j = Math.round(number / i)
          const resultMultiplication =
            '[' + getExpression(i) + ']*[' + getExpression(j) + ']'
          candidates.push(resultMultiplication)
        }
      }
    }

    const finalCandidate = candidates.reduce(
      (previousBestResult, currentCandidate) => {
        if (previousBestResult.length < currentCandidate.length) {
          return previousBestResult
        } else {
          return currentCandidate
        }
      }
    )
    mappings.set(number, finalCandidate)
    // console.log('number', number, finalCandidate)
    return finalCandidate
  }
}
module.exports = {
  getExpression: getExpression
}
