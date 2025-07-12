const exercise1 = require('../exercise1');

describe('fizzBuzz', () => {
    it.each([
        ['1', ''],
        [false, ''],
        [null, ''],
        [[1,2,3], ''],
        [{'a':1, 'b':2}, '']
    ])('should throw if input is %s', (input, expected) => {
        expect(() => { exercise1.fizzBuzz(input) }).toThrow();
    }) 

    it.each([
        [15, 'FizzBuzz'],
        [45, 'FizzBuzz'],
        [150, 'FizzBuzz']
    ])('should return "FizzBuzz" if %s is divisible by 15', (input, expected) => {
        const result = exercise1.fizzBuzz(input);
        expect(result).toBe(expected);
    })

    it.each([
        [3, 'Fizz'],
        [6, 'Fizz'],
        [9, 'Fizz']
    ])('should return "Fizz" if %s is divisible by 3', (input, expected) => {
        const result = exercise1.fizzBuzz(input);
        expect(result).toBe(expected);
    })

    it.each([
        [5, 'Buzz'],
        [10, 'Buzz'],
        [20, 'Buzz']
    ])('should return "Buzz" if %s is divisible by 5', (input, expected) => {
        const result = exercise1.fizzBuzz(input);
        expect(result).toBe(expected);
    })

    it.each([
        [7, 7],
        [11, 11],
        [8, 8]
    ])('should return %s if the input is the same and not divisible by 3 or 5', (input, expected) => {
        const result = exercise1.fizzBuzz(input);
        expect(result).toBe(expected);
    })
})