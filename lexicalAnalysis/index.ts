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
  private static readonly COL: string = ':';
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
      // 单界符 , . ; :
      case LexicalAnalysis.CO || LexicalAnalysis.PO || LexicalAnalysis.SEMI || LexicalAnalysis.COL:
        this.addIdentifier({
          text: cc,
          type: '单界符'
        })
        return ++i;
      // 转译符 \
      case '\\':
        let nc = this.code.charAt(i+1)
        if (nc === 'n' || nc === 't' || nc === 'r') {
          this.addIdentifier({
            text: cc + nc,
            type: '转译字符'
          })
          return i + 2
        }
      default: 
        this.addError({
          text: cc,
          type: '暂时无法识别的标识符'
        })
        return ++i;
    }
  }

  /**
   * 以字母开头
   */
  beginLetter(index:number, cc: string) {
    let i = index;
    // 拼接
    let whole = cc;
    let nc = this.code.charAt(++i)
    // 只要是字母或者数字就一直在里面转
    while(this.isLetter(nc) || this.isNumber(nc)) {
      whole += nc;
      nc = this.code.charAt(++i)
    }
    // 单个字符
    if(whole.length === 1) {
      this.addIdentifier({
        text: whole,
        type: '字符常数'
      })
      return i;
    }
    // 关键字
    if (this.isKeywords(whole)) {
      this.addToken({
        text: whole,
        type: '关键字'
      })
      return i;
    }
    // 标识符
    this.addIdentifier({
      text: whole,
      type: '普通标识符'
    })
    return i;
  }

  /**
   * 以数字开头
   */
  beginNumber(index:number, cc: string) {
    let whole = cc;
    let i = index;
    let nc = this.code.charAt(++i);
    // 如果后续是数字，拼接起来
    while(this.isNumber(nc)) {
      whole += nc
      nc = this.code.charAt(++i)
    }
    // 如果遇到一些结束符号 ' ' \n ; , \r \t，就输出结束
    // 如果遇到一些运算符符号 + - * / %，就输出结束
    if (
      nc === LexicalAnalysis.CO || 
      nc === LexicalAnalysis.SEMI || 
      nc === LexicalAnalysis.EOF || 
      nc === LexicalAnalysis.CR || 
      nc === LexicalAnalysis.HR || 
      nc === LexicalAnalysis.SPA || 
      nc === LexicalAnalysis.PLUS || 
      nc === LexicalAnalysis.DASH || 
      nc === LexicalAnalysis.STAR || 
      nc === LexicalAnalysis.FS || 
      nc === LexicalAnalysis.PS
    ) {
      this.addIdentifier({
        text: whole,
        type: '整数'
      })
      return i;
    }
    // 科学计数法
    else if (this.isFE(nc)) {
      return this.handleFE(i, whole, nc);
    }
    // 浮点数
    else if ((this.code.charAt(i) === LexicalAnalysis.PO) && this.isNumber(this.code.charAt(i+1))) {
      whole += LexicalAnalysis.PO;
      let nc = this.code.charAt(++i)
      // 如果.之后有很多位，都抓出来 3.1415926
      while(this.isNumber(nc)) {
        whole += nc;
        nc = this.code.charAt(++i);
      }
      // 3.14E10 如果遇到科学计数法
      // 科学计数法
      if (this.isFE(nc)) {
        return this.handleFE(i, whole, nc);
      }
    }
    // 不能识别的错误语法
    else {

    }
  }

  addToken(token: Partial<Token>) {
    const { text, type } = token;
    this.tokenList.push({
      row: this.row,
      text,
      type
    })
  }

  addIdentifier(token: Partial<Token>) {
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

  /**
   * 是否是关键字
   */
  isKeywords(str: string) {
    return LexicalAnalysis.KEYWORDS.includes(str);
  }

  /**
   * 是否是科学计数法
   */
  isFE(str: string) {
    return ((str === 'E') || (str === 'e')) ? true : false
  }

  /**
   * 科学计数法
   */
  handleFE(index: number, wle: string, nextchar: string) {
    let i = index;
    let whole = wle;
    let nc = nextchar;
    // 有 + - 号 1e+2、 1e-3
    if ((this.code.charAt(i + 1) === LexicalAnalysis.PLUS) || (this.code.charAt(i + 1) === LexicalAnalysis.DASH)) {
      // 1e
      whole += nc;
      // +
      nc = this.code.charAt(++i)
      // 1e+
      whole += nc;
      // 2
      nc = this.code.charAt(++i)
      // 如果后续是数字，一直加
      while(this.isNumber(nc)) {
        // 1e+2
        whole += nc;
        nc = this.code.charAt(++i)
      }
      // 此时，nc不是数字了， 那是不是结束了 ' ' , ; \n \r \t
      if (
        nc === LexicalAnalysis.CO || 
        nc === LexicalAnalysis.SEMI || 
        nc === LexicalAnalysis.EOF || 
        nc === LexicalAnalysis.CR || 
        nc === LexicalAnalysis.HR || 
        nc === LexicalAnalysis.SPA
      ) {
        this.addIdentifier({
          text: whole,
          type: '科学计数'
        })
        return i;
      } else {
        this.addIdentifier({
          text: whole,
          type: '浮点数错误'
        })
        return i;
      }
    }
    // 1e2
    else if (this.isNumber(this.code.charAt(i + 1))) {
      // 1e
      whole += nc;
      // 2
      nc = this.code.charAt(++i);
      while(this.isNumber(nc)) {
        whole += nc;
        nc = this.code.charAt(++i);
      }
      // 此时，nc不是数字了， 那是不是结束了 ' ' , ; \n \r \t
      if (
        nc === LexicalAnalysis.CO || 
        nc === LexicalAnalysis.SEMI || 
        nc === LexicalAnalysis.EOF || 
        nc === LexicalAnalysis.CR || 
        nc === LexicalAnalysis.HR || 
        nc === LexicalAnalysis.SPA
      ) {
        this.addIdentifier({
          text: whole,
          type: '科学计数'
        })
        return i;
      } else {
        this.addIdentifier({
          text: whole,
          type: '浮点数错误'
        })
        return i;
      }
    }
    // 错误
    else {
      this.addError({
        text: '',
        type: '科学计数法错误'
      })
      return i;
    }
  }


}