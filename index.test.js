const { getExpression, getOptimizedExpression, MAX_NUMBER } = require('./index')

const testCases = [
  {
    input: '+![]',
    output: '+![]'
  },
  {
    input: '+!![]',
    output: '+!![]'
  },
  {
    input: '[+!![]+!![]+!![]]*[+!![]+!![]]', // 6 = 3 * 2
    output: '[!![]+!![]+!![]]*[!![]+!![]]'
  },
  {
    input: '+[[+!![]]+[+[]]]-[+!![]+!![]+!![]]', // 7 = "10" - 3
    output: '+[+!![]+[+[]]]-!![]-!![]-!![]'
  },
  {
    input: '[+!![]+!![]]*[+[[+!![]+!![]+!![]]+[+[]]]-[+!![]+!![]]]', // 56 = 2 * ("30" - 2)
    output: '[!![]+!![]]*[!![]+!![]+!![]+[+[]]-!![]-!![]]'
  }
]

describe('Optimizer', function() {
  testCases.forEach(function(testCase) {
    const result = getOptimizedExpression(testCase.input)
    test(
      'Result of optimizing ' + testCase.input + ' well-optimized',
      function() {
        expect(result).toBe(testCase.output)
      }
    )
  })
})

describe('All number validation', function() {
  for (let i = 0; i <= MAX_NUMBER; i++) {
    const result = getExpression(i)
    test(
      'result of ' +
        i +
        ' should produce less than or equal length than expected output ',
      function() {
        // if (result.length > 75)
        //   console.log(
        //     'input',
        //     i,
        //     ' output',
        //     result,
        //     result.length,
        //     result.length <= 75 ? 'ok' : 'nope'
        //   )
        expect(result.length).toBeLessThanOrEqual(75)
      }
    )

    test(
      'result of ' +
        i +
        ' should be correctly evaluated to have same value and type as input',
      function() {
        // console.log('input', i, ' output', result, 'eval as', eval(result))
        expect(eval(result)).toBe(i)
      }
    )
  }
})
