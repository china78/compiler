import { expect } from 'chai';
import LexicalAnalysis from '../src/LexicalAnalysis';

describe('测试LexicalAnalysis方法', () => {
  it('测试一条普通js加法运算', () => {
    const code = `let a = 1;`;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('测试小数2.5', () => {
    const code = `let b = 2.5;`;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('赋值运算符 = 的测试', () => {
    const code = `=`;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('算数运算符 == 的测试', () => {
    const code = `==`;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('算数运算符 === 的测试', () => {
    const code = `===`;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('= == ===综合', () => {
    const code = `
      let e = 123
      if (a === b || c == d) {
        e = 456;
      }
    `;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('测试逻辑运算符 ||', () => {
    const code = `||`;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('综合测试', () => {
    const code = `
      if (a == b || c === d) {
        let e;
        const f = '1123';
        e = f
      }
    `;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  it('测试字符串-单引号 \' \"', () => {
    const code = `
      const a = '123';
      const b = "456";
    `;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
})