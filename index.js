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
      // if (index === 0) {
      //   return mappings.get(digit)
      // }
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
      // if (index === 0) {
      //   return digitExpression
      // }
      return `[${digitExpression}]`
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
  tryOptimizer(subtractionOptimizer)
  tryOptimizer(plusSignOptimizer)
  tryOptimizer(removeDoubleBracketsOptimizer)
  tryOptimizer(plusSignOptimizer)
  tryOptimizer(removeDoubleBracketsOptimizer)
}
runPass(1) // 141 tc failed
runPass(2) // 56 tc failed
runPass(3) // 55 tc failed; with optimizier: 30 fc failed; with 2 optimizers: 7 tc failed

// TODO: with a subtraction substitution optimizer and plus sign remover optimizer, worst length is now 79

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
function tryOptimizer(optimizerFunction) {
  for (let i = 0; i < MAX_NUMBER; i++) {
    const expression = getExpression(i)
    const optimizedExpression = getOptimizedExpression(
      optimizerFunction,
      expression
    )
    try {
      if (
        optimizedExpression.length < expression.length &&
        eval(optimizedExpression) === eval(expression)
      ) {
        mappings.set(i, optimizedExpression)
      }
    } catch (e) {
      console.error('e', i, expression, optimizedExpression)
    }
  }
}

/**
 * Subtitute subtraction into expression
 * idea is instead of writing "-[+!![]+!![]]", we write "-!![]-!![]"
 */
function subtractionOptimizer(expression) {
  let tempExpression = expression.slice()
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
      if (nextCharacter === '+') {
        // no-op
      } else {
        newExpression.push('-')
      }
    } else if (currentDepth < onDepth[onDepth.length - 1]) {
      onDepth.pop()
    } else {
      newExpression.push(currentCharacter)
    }
  }
  return newExpression.join('')
}

/**
 * Idea: Remove '+' after a start of bracket
 * @param {string} expression
 */
function plusSignOptimizer(expression) {
  let tempExpression = expression.slice()
  let newExpression = tempExpression.split('')
  let plusCounts = []
  let firstPlusSignIndices = []
  let currentDepth = 0
  let collectedFirstPlusSignIndices = []

  // Find [+{...}+{...}] and replace it as [{...}+{...}]

  // TODO: +[+!![] + [!![]+!![]]] is 12, but +[!![] + [!![]+!![]]] is NaN
  // Seems like need to put exception here when the first encounter is "+!![]"
  // Hmm, seems a bit buggy on this exception case;
  // This is okay
  // [!![]+!![]]
  // >> Array [ 2 ]
  // This is not okay
  // [!![] + [!![]+!![]]]
  // >> Array [ "true2" ]

  for (let i = 0; i < tempExpression.length; i++) {
    const previousCharacter = i >= 1 ? tempExpression[i - 1] : null
    const currentCharacter = tempExpression[i]
    if (currentCharacter === '[') {
      currentDepth++
      plusCounts.push(0)
      firstPlusSignIndices.push(null)
    } else if (currentCharacter === ']') {
      currentDepth--

      const depthPlusCount = plusCounts.pop()
      const firstPlusSignIndex = firstPlusSignIndices.pop()
      if (depthPlusCount >= 2 && firstPlusSignIndex !== null) {
        // Remove the first '+' sign!
        // if '[+!' is encountered, only remove if there depthPlusCount > 3!
        const nextCharacter = tempExpression[firstPlusSignIndex + 1]
        if (nextCharacter === '!') {
          if (depthPlusCount >= 3) {
            collectedFirstPlusSignIndices.push(firstPlusSignIndex)
          }
        } else {
          collectedFirstPlusSignIndices.push(firstPlusSignIndex)
        }
      }
    }

    if (
      currentDepth > 0 &&
      (currentCharacter === '+' ||
        currentCharacter === '-' ||
        currentCharacter === '*')
    ) {
      if (
        previousCharacter === '[' &&
        currentCharacter === '+' &&
        plusCounts[plusCounts.length - 1] === 0
      ) {
        firstPlusSignIndices[firstPlusSignIndices.length - 1] = i
      }
      plusCounts[plusCounts.length - 1]++
    }
  }

  newExpression = newExpression
    .map((char, i) => {
      if (collectedFirstPlusSignIndices.indexOf(i) > -1) {
        return null
      }
      return char
    })
    .filter(Boolean)

  return newExpression.join('')
}

/**
 * Remove digitizing first bracket
 * Idea: "2" + "1" is "+[[!![]+!![]]+[+!![]]]" but can also be written as "+[!![]+!![]+[+!![]]]"
 */
function removeDoubleBracketsOptimizer(expression) {
  let tempExpression = expression.slice()
  let newExpression = []
  let currentDepth = 0
  const onDepth = []

  for (let i = 0; i < tempExpression.length; i++) {
    const currentCharacter = tempExpression[i]
    const nextCharacter = tempExpression[i + 1]
    if (currentCharacter === '[') {
      currentDepth++
    } else if (currentCharacter === ']') {
      currentDepth--
    }

    if (currentCharacter === '[' && nextCharacter === '[') {
      onDepth.push(currentDepth)
    } else if (
      currentCharacter === ']' &&
      onDepth[onDepth.length - 1] === currentDepth
    ) {
      // no-op
      onDepth.pop()
    } else {
      newExpression.push(currentCharacter)
    }
  }

  newExpression = newExpression.filter(Boolean)

  return newExpression.join('')
}

/**
 * Get a more optimized version of a expression
 * @param {string} expression
 */
function getOptimizedExpression(optimizerFunction, expression) {
  return optimizerFunction(expression)
}

module.exports = {
  getExpression: getExpression,
  getOptimizedExpression: getOptimizedExpression.bind(this, expression => {
    return removeDoubleBracketsOptimizer(
      plusSignOptimizer(subtractionOptimizer(expression))
    )
  })
}
