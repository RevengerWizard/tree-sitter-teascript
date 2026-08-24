;; Keywords
["export" "import" "from" "as" "function" "var" "const" "class" "new"] @keyword

["return" "continue" "break" "if" "else" "for" "while" "do" "switch" "case" "default" "in" "is"] @keyword.control

(while_statement "while" @keyword.control)
(do_while_statement "do" @keyword.control)
(case_clause "case" @keyword.control)
(else_clause "else" @keyword.control)
(else_if_clause "else" @keyword.control)
(else_if_clause "if" @keyword.control)

["and" "or" "not"] @keyword

["true" "false"] @constant.builtin

(identifier) @variable

(function_declaration name: (identifier) @function)
(lambda_expression) @function
(postfix_expression (call_suffix)) @function.call
(new_expression) @function.call

(class_declaration name: (identifier) @type)

(parameter (identifier) @variable.parameter)

(boolean) @constant.builtin
(nil) @constant.builtin
(self) @variable.builtin
(super) @keyword

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
