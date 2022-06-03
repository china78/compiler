import { expect } from 'chai';
import LexicalAnalysis from '../lexicalAnalysis';

describe('测试一条普通的js语句', () => {
  const code = `
    let a = 1;
    let b = 2.5;
    const c = a + b;
  `
  const lexer = new LexicalAnalysis(code);
  lexer.run()
  console.log(lexer.tokenList)
  console.log(lexer.identifier)
  console.log(lexer.errorList)
})