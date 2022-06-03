type Token = {
  row: number;
  text: string;
  type: string;
}

export class LexicalAnalysis {
  private static readonly KEYWORDS: string[] = [
    "break", "case",	"catch", "const","continue",	"default",	"do", "else","for",	"function",	
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

  private static readonly SHARP: string = '#';
  private static readonly EOF: string = '\n';
  private static readonly CR: string = '\r'; // 回车
  private static readonly HR: string = '\t'; // 水平制表符
  private static readonly BS: string = '\\';
  // 算数运算符
  private static readonly PLUS: string = '+';
  private static readonly DASH: string = '-';
  private static readonly STAR: string = '*';
  private static readonly FS: string = '/';
  private static readonly PS: string = '%';
  // 比较运算符
  private static readonly GT: string = '>';
  private static readonly LT: string = '<';
  private static readonly ASS: string = '=';
  private static readonly BA: string = '!';

  code: string;
  tokenList: Token[];
  identifier: Token[];
  constructor(code:string) {
    this.code = code
    this.tokenList = []
    this.identifier = []
  }











}