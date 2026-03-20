;; Keywords
["export" "import" "from" "as" "function" "var" "const"] @keyword

["return" "continue" "break" "if" "else" "for" "switch" "case" "default"] @return

["and" "or" "not"] @keyword

["true" "false"] @constant.builtin

(identifier) @variable

(function_declaration name: (identifier) @function)
(lambda_expression) @function

(class_declaration name: (identifier) @type)

(parameter (identifier) @variable.parameter)

(boolean) @constant.builtin
(nil) @constant.builtin
(self) @variable.builtin
(super) @variable.builtin

(binary_number) @constant.numeric.integer
(octal_number) @constant.numeric.integer
(hexadecimal_number) @constant.numeric.integer
(integer_number) @constant.numeric.integer
(float_number) @constant.numeric.float

(double_quote_string) @string
(single_quote_string) @string
(backtick_string) @string
(triple_double_quote_string) @string
(triple_single_quote_string) @string
(triple_backtick_string) @string

(string_escape) @constant.character.escape

(string_interpolation "${" @punctuation.definition.template-expression.begin)
(string_interpolation "}" @punctuation.definition.template-expression.end)

(comment) @comment

["=" "+" "-" "*" "/" "%" "**" "!" "~" "&" "|" "^" "<<" ">>"] @keyword.operator

["+=" "-=" "*=" "/=" "%=" "**=" "&=" "|=" "^=" "==" "!="] @keyword.operator

["<" ">" "<=" ">="] @keyword.operator

[".." "..."] @keyword.operator

"{" @punctuation.definition.block.begin
"}" @punctuation.definition.block.end
"(" @punctuation.definition.group.begin
")" @punctuation.definition.group.end
"[" @punctuation.definition.array.begin
"]" @punctuation.definition.array.end
"," @punctuation.separator.arguments
";" @punctuation.separator.statement
":" @punctuation.separator
"." @punctuation.accessor
"::" @punctuation.accessor