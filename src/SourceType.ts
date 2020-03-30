/**
 * Represents a particular type of CoffeeScript code.
 */
enum SourceType {
  AT = 'AT',
  BOOL = 'BOOL',
  BREAK = 'BREAK',
  CATCH = 'CATCH',
  CALL_END = 'CALL_END',
  CALL_START = 'CALL_START',
  CLASS = 'CLASS',
  COLON = 'COLON',
  COMMA = 'COMMA',
  COMMENT = 'COMMENT',
  CONTINUATION = 'CONTINUATION',
  CONTINUE = 'CONTINUE',
  CSX_BODY = 'CSX_BODY',
  CSX_CLOSE_TAG_START = 'CSX_CLOSE_TAG_START',
  CSX_CLOSE_TAG_END = 'CSX_CLOSE_TAG_END',
  CSX_OPEN_TAG_START = 'CSX_OPEN_TAG_START',
  CSX_OPEN_TAG_END = 'CSX_OPEN_TAG_END',
  CSX_SELF_CLOSING_TAG_END = 'CSX_SELF_CLOSING_TAG_END',
  DECREMENT = 'DECREMENT',
  DEFAULT = 'DEFAULT',
  DELETE = 'DELETE',
  DO = 'DO',
  DOT = 'DOT',
  DSTRING_START = 'DSTRING_START',
  DSTRING_END = 'DSTRING_END',
  ELSE = 'ELSE',
  EXPORT = 'EXPORT',
  EOF = 'EOF',
  EXISTENCE = 'EXISTENCE',
  EXTENDS = 'EXTENDS',
  FINALLY = 'FINALLY',
  FOR = 'FOR',
  FUNCTION = 'FUNCTION',
  HERECOMMENT = 'HERECOMMENT',
  HEREJS = 'HEREJS',
  HEREGEXP_COMMENT = 'HEREGEXP_COMMENT',
  HEREGEXP_START = 'HEREGEXP_START',
  HEREGEXP_END = 'HEREGEXP_END',
  IF = 'IF',
  IMPORT = 'IMPORT',
  INCREMENT = 'INCREMENT',
  INTERPOLATION_START = 'INTERPOLATION_START',
  INTERPOLATION_END = 'INTERPOLATION_END',
  JS = 'JS',
  LBRACE = 'LBRACE',
  LBRACKET = 'LBRACKET',
  LOOP = 'LOOP',
  LPAREN = 'LPAREN',
  NEW = 'NEW',
  NEWLINE = 'NEWLINE',
  NORMAL = 'NORMAL',
  NULL = 'NULL',
  NUMBER = 'NUMBER',
  OPERATOR = 'OPERATOR',
  OWN = 'OWN',
  PROTO = 'PROTO',
  RANGE = 'RANGE',
  REGEXP = 'REGEXP',
  RBRACE = 'RBRACE',
  RBRACKET = 'RBRACKET',
  RELATION = 'RELATION',
  RETURN = 'RETURN',
  RPAREN = 'RPAREN',
  SEMICOLON = 'SEMICOLON',
  SPACE = 'SPACE',
  SUPER = 'SUPER',
  SWITCH = 'SWITCH',
  SSTRING_START = 'SSTRING_START',
  SSTRING_END = 'SSTRING_END',
  STRING_CONTENT = 'STRING_CONTENT',
  STRING_LINE_SEPARATOR = 'STRING_LINE_SEPARATOR',
  STRING_PADDING = 'STRING_PADDING',
  TDSTRING_START = 'TDSTRING_START',
  TDSTRING_END = 'TDSTRING_END',
  THEN = 'THEN',
  THIS = 'THIS',
  THROW = 'THROW',
  TRY = 'TRY',
  TSSTRING_START = 'TSSTRING_START',
  TSSTRING_END = 'TSSTRING_END',
  UNDEFINED = 'UNDEFINED',
  UNKNOWN = 'UNKNOWN',
  WHEN = 'WHEN',
  WHILE = 'WHILE',
  IDENTIFIER = 'IDENTIFIER',
  YIELD = 'YIELD',
  YIELDFROM = 'YIELDFROM',
}

export default SourceType
