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

function tryDigitizing() {
  for (let i = 10; i <= MAX_NUMBER; i++) {
    const resultDigits = getSingleDigitExpression(i)
    const previousResult = mappings.get(i)
    if (resultDigits.length < previousResult.length) {
      mappings.set(i, resultDigits)
    }
  }
}

function getSingleDigitExpression(number) {
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

function tryGroupedDigitizing(skip = 0) {
  for (let i = 100; i <= MAX_NUMBER; i++) {
    const resultDigits = getGroupedDigitExpression(i, 2, skip)
    const previousResult = mappings.get(i)
    if (resultDigits.length < previousResult.length) {
      mappings.set(i, resultDigits)
    }
  }
}

// Group every "groupSize" digits
function getGroupedDigitExpression(number, groupSize, skip = 0) {
  const digits = String(number)
    .split('')
    .map(x => parseInt(x, 10))

  const groupedDigits = []
  for (let i = 0; i < skip; i++) {
    groupedDigits.push(digits[i])
  }
  for (let i = skip; i < digits.length; i++) {
    let temp = 0
    for (let j = 0; j < groupSize; j++) {
      temp = temp * 10 + digits[i]
    }
    groupedDigits.push(temp)
  }

  let resultDigits = groupedDigits
    .map(digit => {
      const digitExpression = mappings.get(digit)
      return `[${digitExpression}]`
      // TODO: This is still buggy
      // if (
      //   digitExpression.startsWith('+') &&
      //   eval(`+[${digitExpression.slice(1)}]`) === eval(`+[${digitExpression}]`)
      // ) {
      //   return `[${digitExpression.slice(1)}]`
      // } else {
      //   return `[${digitExpression}]`
      // }
    })
    .join('+')
  if (typeof eval(resultDigits) !== 'number') {
    resultDigits = `+[${resultDigits}]`
  }

  return resultDigits
}

function runPass(count) {
  if (count === 1) {
    tryCounting()
  }
  tryDigitizing()
  tryGroupedDigitizing(0)
  tryGroupedDigitizing(1)
  tryEverythingElse()
  tryOptimizer()
}
runPass(1) // 141 tc failed
runPass(2) // 56 tc failed
runPass(3) // 55 tc failed; with optimizier: 30 fc failed

// TODO: with a subtraction substitution optimizer, worst length is now 80

function tryEverythingElse() {
  vis.clear()
  vis.set(0, true)
  vis.set(1, true)
  for (let i = 0; i < MAX_NUMBER; i++) {
    getExpression(i)
  }
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

function tryOptimizer() {
  for (let i = 0; i < MAX_NUMBER; i++) {
    const expression = getExpression(i)
    const optimizedExpression = getOptimizedExpression(expression)
    if (
      optimizedExpression.length < expression.length &&
      eval(optimizedExpression) === eval(expression)
    ) {
      mappings.set(i, optimizedExpression)
    }
  }
}

/**
 * Get a more optimized version of a expression
 * @param {string} expression
 */
function getOptimizedExpression(expression) {
  let tempExpression = expression
  // Remove '+' after a start of bracket
  // const removePlusAfterArray = /\[\+!!/g
  // while (removePlusAfterArray.test(tempExpression)) {
  //   tempExpression = tempExpression.replace(removePlusAfterArray, '[!!')
  // }
  // NOTE: Need to "parse" instead of just regexing, because
  // +[[+!![]]+[+[]]]-[+!![]+!![]+!![]] --> 7
  // +[[!![]]+[+[]]]-[!![]+!![]+!![]] --> NaN
  // Can only remove if inside the bracket, it has another operator (+, -, *)

  /**
   * Subtitute subtraction into expression
   * idea is instead of writing "-[+!![]+!![]]", we write "-!![]-!![]"
   */
  {
    let newExpression = []
    let onDepth = []
    let currentDepth = 0
    for (let i = 0; i < tempExpression.length; i++) {
      const currentCharacter = tempExpression[i]
      const nextCharacter = tempExpression[i + 1]
      if (currentCharacter === '[') {
        currentDepth++
      } else if (currentCharacter === ']') {
        currentDepth--
      }

      if (currentCharacter === '-' && nextCharacter === '[') {
        onDepth.push(currentDepth + 1)
      } else if (
        onDepth[onDepth.length - 1] === currentDepth &&
        currentCharacter === '+'
      ) {
        newExpression.push('-')
      } else if (
        onDepth[onDepth.length - 1] === currentDepth &&
        currentCharacter === '['
      ) {
        // no-op
      } else if (currentDepth < onDepth[onDepth.length - 1]) {
        onDepth.pop()
      } else {
        newExpression.push(currentCharacter)
      }
    }
    tempExpression = newExpression.join('')
  }

  return tempExpression
}

module.exports = {
  getExpression: getExpression,
  getOptimizedExpression
}
