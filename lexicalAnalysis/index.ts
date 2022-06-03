type Token = {
  row: number;
  text: string;
  type: string;
}

export default class LexicalAnalysis {
  private static readonly KEYWORDS: string[] = [
    "break", "case", "catch", "const","continue",	"default", "do", "else", "for",	"function",	
    "if", "in",	"instanceof", "let", "new", "return", "switch", "try",	"typeof",	"var", "while"	
  ];
  // 单界符
  private static readonly CO: string = ',';
  private static readonly PO: string = '.';
  private static readonly SEMI: string = ';';
  private static readonly DQ: string = '"';
  private static readonly SQ: string = '\'';
  private static readonly ESCAPE: string = '`';
  // 双界符
  private static readonly LSB: string = '[';
  private static readonly RSB: string = ']';
  private static readonly LRB: string = '(';
  private static readonly RRB: string = ')';
  private static readonly LBB: string = '{';
  private static readonly RBB: string = '}';
  // other
  private static readonly SHARP: string = '#';
  private static readonly EOF: string = '\n';
  private static readonly CR: string = '\r'; // 回车
  private static readonly HR: string = '\t'; // 水平制表符
  private static readonly BS: string = '\\';
  private static readonly BO: string = '_';
  private static readonly SPA: string = ' ';
  // 算数运算符
  private static readonly PLUS: string = '+';
  private static readonly DASH: string = '-';
  private static readonly STAR: string = '*';
  private static readonly FS: string = '/';
  private static readonly PS: string = '%';
  // 逻辑运算符
  private static readonly GT: string = '>';
  private static readonly LT: string = '<';
  private static readonly ASS: string = '=';
  private static readonly BA: string = '!';
  private static readonly AN: string = '&';
  private static readonly OR: string = '|';

  code: string;
  row: number;
  tokenList: Token[];
  identifier: Token[];
  errorList: Token[];
  constructor(code:string) {
    this.code = code + LexicalAnalysis.SEMI;
    this.row = 1;
    this.tokenList = []
    this.identifier = []
    this.errorList = []
  }

  run() {
    this.mainProcess()
  }

  /**
   * 主进程
   */
  mainProcess() {
    let i = 0;
    let cc: string;
    const code = this.code;
    while(i < code.length) {
      cc = code.charAt(i);
      i = this.preInspection(cc, i)
    }
  }

  /**
   * 对空字符串、换行预检
   */
  preInspection(cc: string, i:number) {
    if (cc === LexicalAnalysis.SPA) {
      return i++
    } else if (cc === '\n') {
      this.row++;
      return i++
    } else {
      return this.meaningfulPart(i, cc)
    }
  }

  /**
   *  有意义的部分
   */
  meaningfulPart(i:number, cc: string) {
    if (this.isLetter(cc)) {
      return this.beginLetter(i, cc)
    }
    if (this.isNumber(cc)) {
      return this.beginNumber(i, cc)
    }
    // 既不是字母也不是数字
    return this.nonAlphanumeric(i, cc)
  }

  /**
   * 是字母
   */
  isLetter(cc: string): boolean {
    if (
      (cc >= 'a' && cc <= 'z') || 
      (cc >= 'A' && cc <= 'Z') || 
      (cc === LexicalAnalysis.BO)
    ) {
      return true
    } else {
      return false
    }
  }

  /**
   * 是数字
   */
  isNumber(cc: string): boolean {
    if (cc >= '0' && cc <= '9') {
      return true
    } else {
      return false
    }
  }

  /**
   * 非字母、数字
   */
  nonAlphanumeric(i:number, cc: string) {
    switch(cc) {
      // 如果是空字符、换行、制表符等 跳过
      case LexicalAnalysis.SPA || LexicalAnalysis.EOF || LexicalAnalysis.CR || LexicalAnalysis.HR:
        return ++i;
      // 如果是双界符
      case LexicalAnalysis.LSB || LexicalAnalysis.RRB || LexicalAnalysis.LRB || LexicalAnalysis.RRB || LexicalAnalysis.LBB || LexicalAnalysis.RBB:
        this.addToken({
          text: cc,
          type: '双界符'
        })
        return ++i;
      default: 
        this.addError({

        })
        return ++i;
    }
  }

  /**
   * 以
   */
  beginLetter(i:number, cc: string) {

  }

  /**
   * 以数字开头
   */
  beginNumber(i:number, cc: string) {

  }

  addToken(token: Partial<Token>) {
    const { text, type } = token;
    this.tokenList.push({
      row: this.row,
      text,
      type
    })
  }

  addError(error: Partial<Token>) {
    const { text, type } = error;
    this.errorList.push({
      row: this.row,
      text,
      type
    })
  }





}