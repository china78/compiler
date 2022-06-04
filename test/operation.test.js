import { add, square } from '../src/operation.js';
import { expect } from 'chai';

describe('测试add方法', () => {
  it('1 + 2 = 3', () => {
    expect(add(1, 2)).to.be.equal(3)
  })
})

describe('测试square方法', () => {
  it('2 * 2 = 4', () => {
    expect(square(2)).to.be.equal(4)
  })
})