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
    this.code = code;
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
  preInspection(cc: string, index:number) {
    let i = index
    if (cc === LexicalAnalysis.SPA) {
      i = ++index
      return i
    } else if (cc === '\n') {
      this.row++;
      i = ++index
      return i
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
  nonAlphanumeric(index:number, cc: string) {
    let i = index;
    let nc = this.code.charAt(i+1)
    let whole = cc;
    switch(cc) {
      // 如果是空字符、换行、制表符等 跳过
      case LexicalAnalysis.SPA:
      case LexicalAnalysis.EOF:
      case LexicalAnalysis.CR:
      case LexicalAnalysis.HR:  
        return ++i;
      // 如果是双界符
      case LexicalAnalysis.LSB:
      case LexicalAnalysis.RRB:
      case LexicalAnalysis.LRB:
      case LexicalAnalysis.RRB:
      case LexicalAnalysis.LBB:
      case LexicalAnalysis.RBB:
        this.addToken({
          text: cc,
          type: '双界符'
        })
        return ++i;
      // 单界符 , . ; :
      case LexicalAnalysis.CO:
      case LexicalAnalysis.PO:
      case LexicalAnalysis.SEMI:
      case LexicalAnalysis.COL:
        this.addToken({
          text: cc,
          type: '单界符'
        })
        return ++i;
      // 如果是 ||
      case LexicalAnalysis.OR:
        nc = this.code.charAt(++i);
        while (nc === LexicalAnalysis.OR) {
          whole += nc;
          nc = this.code.charAt(++i);
        }
        // ||X
        if (whole === '||') {
          this.addToken({
            text: whole,
            type: '逻辑运算符'
          })
          return i
        }
      // 转译符 \
      case '\\':
        if (nc === 'n' || nc === 't' || nc === 'r') {
          this.addIdentifier({
            text: cc + nc,
            type: '转译字符'
          })
          return i + 2
        }
      // 运算符 =
      case LexicalAnalysis.ASS:
        nc = this.code.charAt(++i)
        while(nc === LexicalAnalysis.ASS) {
          whole += nc;
          nc = this.code.charAt(++i);
        }
        // =下一个不是=了，判断是不是结束了
        if (this.isEndCorrelation(nc) || nc === '') {
          // =
          if (whole.length === 1) {
            this.addToken({
              text: whole,
              type: '赋值运算符'
            })
            return i;
          }
          // ==
          if (whole.length === 2) {
            this.addToken({
              text: whole,
              type: '算数运算符'
            })
            return i;
          }
          // === 
          if (whole.length === 3) {
            this.addToken({
              text: whole,
              type: '算数运算符'
            })
            return i;
          }        
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
      this.isEndCorrelation(nc) || 
      this.isOperatorCorrelation(nc)
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
      nc = this.code.charAt(++i)
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
      // 如果遇到结束符号
      else if (this.isEndCorrelation(nc)) {
        this.addIdentifier({
          text: whole,
          type: '浮点数'
        })
        return i;
      }
      // 如果遇到运算符
      else if (this.isOperatorCorrelation(nc)) {
        this.addIdentifier({
          text: whole,
          type: '浮点数'
        })
        return i;
      }
      else {
        return 1
      }
    }
    // 不能识别的错误语法
    // 未完待续...
    else {
        return 1
    }
  }

  addToken(token: Omit<Token, 'row'>) {
    const { text, type } = token;
    this.tokenList.push({
      row: this.row,
      text,
      type
    })
  }

  addIdentifier(token: Omit<Token, 'row'>) {
    const { text, type } = token;
    this.identifier.push({
      row: this.row,
      text,
      type
    })
  }

  addError(error: Omit<Token, 'row'>) {
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
      if (this.isEndCorrelation(nc)) {
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
      if (this.isEndCorrelation(nc)) {
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
        text: whole,
        type: '科学计数法错误'
      })
      return i;
    }
  }

  /**
   *  是否是结束相关 ' ' , ; \n \r \t
   */
  isEndCorrelation(str: string) {
    return (
      str === LexicalAnalysis.CO || 
      str === LexicalAnalysis.SEMI || 
      str === LexicalAnalysis.EOF || 
      str === LexicalAnalysis.CR || 
      str === LexicalAnalysis.HR || 
      str === LexicalAnalysis.SPA
    ) ? true : false
  }

  /**
   * 运算符相关 + - * / %
   */
  isOperatorCorrelation(str: string) {
    return (
      str === LexicalAnalysis.PLUS || 
      str === LexicalAnalysis.DASH || 
      str === LexicalAnalysis.STAR ||
      str === LexicalAnalysis.FS || 
      str === LexicalAnalysis.PS
    ) ? true : false;
  }
}