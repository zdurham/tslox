import { error } from './error';

export class Token {
  type!: TokenType;
  lexeme!: string;
  literal!: any;
  line!: number;

  constructor(type: TokenType, lexeme: string, literal: any, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`
  }
}

export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN = "LEFT_PAREN", RIGHT_PAREN = "RIGHT_PAREN", LEFT_BRACE = "LEFT_BRACE", RIGHT_BRACE = "RIGHT_BRACE",
  COMMA = "COMMA", DOT = "DOT", MINUS = "MINUS", PLUS = "PLUS", SEMICOLON = "SEMICOLON", SLASH = "SLASH", STAR = "STAR",

  // One or two character tokens.
  BANG = "BANG", BANG_EQUAL = "BANG_EQUAL",
  EQUAL = "EQUAL", EQUAL_EQUAL = "EQUAL_EQUAL",
  GREATER = "GREATER", GREATER_EQUAL = "GREATER_EQUAL",
  LESS = "GREATER", LESS_EQUAL = "LESS_EQUAL",

  // Literals.
  IDENTIFIER = "IDENTIFIER", STRING = "STRING", NUMBER = "NUMBER",

  // Keywords.
  AND = "AND", CLASS = "CLASS", ELSE = "ELSE", FALSE = "FALSE", FUN = "FUN", FOR = "FOR", IF = "IF", NIL = "NIL", OR = "OR",
  PRINT = "PRINT", RETURN = "RETURN", SUPER = "SUPER", THIS = "THIS", TRUE = "TRUE", VAR = "VAR", WHILE = "WHILE",

  EOF = "EOF"
}


export class Scanner {
  private readonly source: string;
  private tokens: Token[] = [];

  private current = 0;
  private start = 0;
  private line = 1;
  private isAtEnd = () => this.current >= this.source.length;

  private KEYWORDS: { [index: string]: TokenType } = {
    "and": TokenType.AND,
    "class": TokenType.CLASS,
    "else": TokenType.ELSE,
    "false": TokenType.FALSE,
    "for": TokenType.FOR,
    "fun": TokenType.FUN,
    "if": TokenType.IF,
    "nil": TokenType.NIL,
    "or": TokenType.OR,
    "print": TokenType.PRINT,
    "return": TokenType.RETURN,
    "super": TokenType.SUPER,
    "this": TokenType.THIS,
    "true": TokenType.TRUE,
    "var": TokenType.VAR,
    "while": TokenType.WHILE
  };

  constructor(source: string) {
    this.source = source;
  }

  advance(): string {
    return this.source.charAt(this.current++);
  }

  addToken(type: TokenType, literal: any = null): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  // basically like a conditional advance
  // if we meet the condition, then we increment current and return true
  match(expected: string): boolean {
    if (this.isAtEnd() || this.source.charAt(this.current) !== expected) {
      return false;
    }

    this.current++;
    return true;
  }


  // lookahead at next token without consuming
  peek(): string {
    if (this.isAtEnd()) {
      return '\0';
    }
    return this.source.charAt(this.current);
  }

  peekNext(): string {
    if (this.current + 1 >= this.source.length) {
      return '\0';
    }

    return this.source.charAt(this.current + 1);
  }

  string(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      // we are ok with strings across multiple lines
      if (this.peek() == '\n') {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      error(this.line, "Unterminated string")
      return
    }

    // consume closing "
    this.advance();

    const string = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, string)
  }

  number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance()

      // then consume the rest of the numbers on the right side of decimal
      while (this.isDigit(this.peek())) {
        this.advance()
      }
    }

    return this.addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)))
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    let type = this.KEYWORDS[this.source.substring(this.start, this.current)];
    if (!type) {
      type = TokenType.IDENTIFIER
    }

    this.addToken(type)
  }

<<<<<<< Updated upstream
=======
  multiLineComment() {
    while (this.peek() !== '*' && this.peekNext() !== "/" && !this.isAtEnd()) {
      // we are ok with strings across multiple lines
      if (this.peek() == '\n') {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      error(this.line, "Unterminated string")
      return
    }

    // consume *
    this.advance();
    // consume /
    this.advance();
  }

>>>>>>> Stashed changes
  isDigit(char: string): boolean {
    return !isNaN(parseInt(char));
  }

  isAlpha(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_";
  }

  isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }


  scanToken(): void {
    var char = this.advance();
    // TODO: add regex for string values and keywords
    //
    switch (char) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (this.match('/')) {
          while (this.peek() != '\n' && !this.isAtEnd()) {
            this.advance();
          }
<<<<<<< Updated upstream
=======
        } else if (this.match("*")) {
          this.multiLineComment();
>>>>>>> Stashed changes
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // ignoring whitespace
        break;
      case '\n':
        this.line++;
        break;
      case '"':
        this.string();
        break;

      default: {
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          error(this.line, `Unexpected character: ${char}`);
        }
      }
    }
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line))
    return this.tokens;
  }
}
