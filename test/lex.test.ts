import { expect } from 'chai';
import LexicalAnalysis from '../src/LexicalAnalysis';

describe('测试LexicalAnalysis方法', () => {
  it('测试一条普通js加法运算', () => {
    const code = `let a = 1;`;
    const lexer = new LexicalAnalysis(code);
    lexer.run();
    console.log('lexer: ', lexer)
  })
  // it('测试小数2.5', () => {
  //   const code = `let b = 2.5;`;
  //   const lexer = new LexicalAnalysis(code);
  //   console.log('lexer: ', lexer)
  //   lexer.run();
  // })
  // it('赋值运算符 = 的测试', () => {
  //   const code = `=`;
  //   const lexer = new LexicalAnalysis(code);
  //   lexer.run();
  //   console.log('lexer: ', lexer)
  // })
  // it('算数运算符 == 的测试', () => {
  //   const code = `=`;
  //   const lexer = new LexicalAnalysis(code);
  //   lexer.run();
  //   console.log('lexer: ', lexer)
  // })
  // it('算数运算符 === 的测试', () => {
  //   const code = `=`;
  //   const lexer = new LexicalAnalysis(code);
  //   lexer.run();
  //   console.log('lexer: ', lexer)
  // })
})