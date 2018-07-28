var getExpression = require('./index').getExpression

var testCases = [
  {
    input: 0,
    output: '+![]'
  },
  {
    input: 1,
    output: '+!![]'
  },
  {
    input: 2,
    output: '+!![]+!![]'
  },
  {
    input: 3,
    output: '+!![]+!![]+!![]'
  },
  {
    input: 4,
    output: '+!![]+!![]+!![]+!![]'
  },
  {
    input: 5,
    output: '+!![]+!![]+!![]+!![]+!![]'
  },
  {
    input: 6,
    output: '[!![]+!![]+!![]]*[!![]+!![]]'
  },
  {
    input: 7,
    output: '+[[+!+[]]+[+[]]]-!![]-!![]-!![]'
  },
  {
    input: 8,
    output: '+[[+!+[]]+[+[]]]-!![]-!![]'
  },
  {
    input: 9,
    output: '+[[+!+[]]+[+[]]]-!![]'
  },
  {
    input: 10,
    output: '+[[+!+[]]+[+[]]]'
  },
  {
    input: 100,
    output: '+[[+!+[]]+[+[]]+[+[]]]'
  },
  {
    input: 900,
    output: '[[+!+[]]+[+[]]+[+[]]+[+[]]]-[[+!+[]]+[+[]]+[+[]]]'
  },
  {
    input: 990,
    output: '[[+!+[]]+[+[]]+[+[]]+[+[]]]-[[+!+[]]+[+[]]]'
  },
  {
    input: 999,
    output: '[[+!+[]]+[+[]]+[+[]]+[+[]]]-!![]'
  },
  {
    input: 1000,
    output: '+[[+!+[]]+[+[]]+[+[]]+[+[]]]'
  }
]
describe('Testcase validation', function() {
  testCases.forEach(function(testCase) {
    test('test case validator ' + testCase.input, function() {
      expect(testCase.input).toBe(eval(testCase.output))
    })
  })
})
describe.skip('Function validation', function() {
  testCases.forEach(function(testCase) {
    const result = getExpression(testCase.input)
    test(
      'result of ' +
        testCase.input +
        ' should produce less than or equal length than expected output ',
      function() {
        console.log('input', testCase.input, ' output', result)
        expect(result.length).toBeLessThanOrEqual(testCase.output.length)
      }
    )
    test(
      'result of ' +
        testCase.input +
        ' should be correctly evaluated to have same value and type as input',
      function() {
        expect(eval(result)).toBe(testCase.input)
      }
    )
  })
})

describe('All number validation', function() {
  for (let i = 0; i <= 1000; i++) {
    const result = getExpression(i)
    test(
      'result of ' +
        i +
        ' should produce less than or equal length than expected output ',
      function() {
        if (result.length > 75)
          console.log(
            'input',
            i,
            ' output',
            result,
            result.length,
            result.length <= 75 ? 'ok' : 'nope'
          )
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
