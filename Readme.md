# l2c

[![pipeline status](https://gitlab.com/kenrick95/l2c/badges/master/pipeline.svg)](https://gitlab.com/kenrick95/l2c/commits/master)

## Make*me-an+[integer!]
https://ipsc.ksp.sk/2015/real/problems/m.html

> For each i between 0 and 1000, line i + 1 of your output should contain a valid JavaScript expression consisting only of the characters ![]+-* that evaluates to a number (i.e., typeof(result) == "number") with value i.

> Additionally, your expressions must be short enough. For the easy subproblem M1, each JavaScript expression should be no longer than 200 characters. For the hard subproblem M2, no expression should exceed 75 characters.

## Idea

```
- 0 --> +[]
- 1 --> +!![]
- 2 --> +!![]+!![]
- 3 --> +!![]+!![]+!![]
- 4 --> +!![]+!![]+!![]+!![]
- 5 --> +!![]+!![]+!![]+!![]+!![]
- 6 --> [!![]+!![]+!![]]*[!![]+!![]], 2 * 3
        +!![]+!![]+!![]+!![]+!![]+!![], counting
- 7 --> [!![]+!![]]*[!![]+!![]]*[!![]+!![]]-!![], 8 - 1
        +!![]+!![]+!![]+!![]+!![]+!![]+!![], counting
        +[[+!+[]]+[+[]]]-!![]-!![]-!![], 10 - 1 - 1 - 1
- 8 --> [!![]+!![]]*[!![]+!![]]*[!![]+!![]], 2 * 2 * 2
        +!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![], counting
        +[[+!+[]]+[+[]]]-!![]-!![], 10 - 1 - 1
- 9 --> +[[+!+[]]+[+[]]]-!![], 10 - 1
- 10 --> +[[+!+[]]+[+[]]], "1" + "0"
- 100 --> +[[+!+[]]+[+[]]+[+[]]], "1" + "0" + "0"
- 900 --> [[+!+[]]+[+[]]+[+[]]+[+[]]]-[[+!+[]]+[+[]]+[+[]]], 1000 - 100
- 990 --> [[+!+[]]+[+[]]+[+[]]+[+[]]]-[[+!+[]]+[+[]]], 1000 - 10
- 999 --> [[+!+[]]+[+[]]+[+[]]+[+[]]]-!![], 1000 - 1
- 1000 --> +[[+!+[]]+[+[]]+[+[]]+[+[]]], "1" + "0" + "0" + "0"
```

## Solution description

- Run in multiple passes. Each pass update the current mapping of number and expression.
- For each number, the initial expression starts with "1+1+...+1"
- Updating expression consists of two parts:
  1. Generate current number using other numbers
  2. Optimize current expression

### Generation

This part is basically a complete search or "brute force".

1. Try digitizing: Idea is that the expression for 10 can be formed using "1" and "0"
2. Try grouped digitizing: Idea is that the expression for 561 can be formed using "56" and "1" or "5" and "61"
3. Try subtraction: Idea is that the expression for 99 can be formed using expression of 100 minus 1
4. Try multiplication: Idea is that the expression for 6 can be formed using expression of 2 multiply by 3

### Optimizing

Optimization takes form of:

1. Substituting minus sign into the brackets
2. Removal of redundant brackets
3. Removal of unecessary plus sign

### Caveats

This solution runs in multiple passes. In my testing, 3 passes are sufficient to satisfy all test cases (of being a valid number expression and expression length being less than or equal to 75).

Reason of running it on passes is because if not, generation of expression using subtraction could result in infinite recursion as for number N, it will try to form (N + 1) - 1, hence recursing into (N + 1), but here, (N + 1) hasn't been formed before, hence it will recurse into (N + 1 + 1), and so on and so on. Running in multiple passes solves this issue, as on each pass, it will just simply use the expression generated on the previous pass.

## Additional notes

Initially, I thought of writing this cleanly, but as I continued implementing, the solution implementation become dirtier and messier. Now I'm not sure how to clean it up.
