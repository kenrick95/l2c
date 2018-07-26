const x = {
  0: '[]',
  1: '!![]'
}
const mappings = new Map()
mappings.set(0, '+[]')
mappings.set(1, '+!![]')

const vis = new Map()
vis.set(0, true)
vis.set(1, true)

function getExpression(number) {
  if (number === 0) {
    return '+' + x[0]
  } else if (number === 1) {
    return '+' + x[1]
  } else if (mappings.has(number)) {
    return mappings.get(number)
  } else if (vis.has(number)) {
    // We alr visit this number before but haven't produced a result, need to break recursion
    return new Array(100).fill(getExpression(0)).join('')
  } else if (number > 10) {
    // Recursing too deep alr, need to break it too
    vis.set(number, true)
    return getExpression(number)
  } else {
    vis.set(number, true)
    const candidates = []

    // Break down into digits
    {
      const digits = String(number)
        .split('')
        .map(x => parseInt(x, 10))
      if (digits.length > 1) {
        let resultDigits = digits
          .map(digit => {
            return '[' + getExpression(digit) + ']'
          })
          .join('+')
        if (typeof eval(resultDigits) !== 'number') {
          resultDigits = '+[' + resultDigits + ']'
        }
        candidates.push(resultDigits)
      }
    }

    // Addition + 1
    {
      const resultAddition = getExpression(number - 1) + '+' + x[1]
      candidates.push(resultAddition)
    }

    // Subtraction
    // This is problematic, because ..
    /**
     * This is problematic, because
     * getExpression(2) --> calls getExpression(3) which will evaluate getExpression(2)
     * --> which causes the real getExpression(3) to produce wrong result
     *     just because it tries to break the recursion during getExpression(2)
     */
    // {
    //   const resultSubtraction = getExpression(number + 1) + '-' + x[1]
    //   candidates.push(resultSubtraction)
    // }

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
    return finalCandidate
  }
}
module.exports = {
  getExpression: getExpression
}
