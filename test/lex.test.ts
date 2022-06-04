import { expect } from 'chai';
import LexicalAnalysis from '../src/LexicalAnalysis';

describe('测试LexicalAnalysis方法', () => {
  it('测试一条普通js加法运算', () => {
    const code = `
      let a = 1;
      let b = 2.5;
      const c = a + b;
    `;
    const lexer = new LexicalAnalysis(code);
    console.log('lexer: ', lexer)
    lexer.run();
  })
})