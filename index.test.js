var getExpression = require('./index').getExpression;

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
];
describe('Testcase validation', function() {
  testCases.forEach(function(testCase) {
    test('test case validator ' + testCase.input, function() {
      expect(testCase.input).toBe(eval(testCase.output));
    });
  });
});
describe('Function validation', function() {
  testCases.forEach(function(testCase) {
    test('number ' + testCase.input, function() {
      expect(getExpression(testCase.input)).toBe(testCase.output);
    });
  });
});

