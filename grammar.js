module.exports = grammar({
  name: "teascript",

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($.statement),

    statement: ($) =>
      choice(
        $.import_statement,
        $.export_statement,
        $.from_import_statement,
        $.class_declaration,
        $.function_declaration,
        $.variable_declaration,
        $.expression_statement,
        $.block,
        $.if_statement,
        $.while_statement,
        $.do_while_statement,
        $.for_statement,
        $.switch_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
      ),

    import_statement: ($) =>
      seq("import", $.module_specifier, optional(seq("as", $.identifier))),

    from_import_statement: ($) =>
      seq(
        "from",
        $.module_specifier,
        "import",
        choice(
          $.identifier,
          seq("(", repeat(seq($.identifier, optional(","))), ")"),
        ),
      ),

    module_specifier: ($) => choice($.identifier, $.string),

    export_statement: ($) =>
      seq(
        "export",
        choice(
          $.function_declaration,
          $.class_declaration,
          $.variable_declaration,
        ),
      ),

    class_declaration: ($) =>
      seq(
        "class",
        field("name", $.identifier),
        optional(seq(":", $.identifier)),
        field("body", $.block),
      ),

    function_declaration: ($) =>
      seq(
        "function",
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        optional(seq("->", $.type_annotation)),
        field("body", $.block),
      ),

    parameter_list: ($) =>
      seq("(", optional(seq($.parameter, repeat(seq(",", $.parameter)))), ")"),

    parameter: ($) => seq($.identifier, optional(seq(":", $.type_annotation))),

    type_annotation: ($) => $.identifier,

    variable_declaration: ($) =>
      choice(
        seq("var", $.identifier, optional(seq("=", $.expression))),
        seq("const", $.identifier, "=", $.expression),
      ),

    if_statement: ($) =>
      seq(
        "if",
        $.condition,
        $.block,
        repeat($.else_if_clause),
        optional($.else_clause),
      ),

    condition: ($) => seq("(", $.expression, ")"),

    else_if_clause: ($) => seq("else", "if", $.condition, $.block),

    else_clause: ($) => seq("else", $.block),

    while_statement: ($) => seq("while", $.condition, $.block),

    do_while_statement: ($) => seq("do", $.block, "while", $.condition),

    for_statement: ($) =>
      choice(
        seq(
          "for",
          "(",
          optional($.for_initializer),
          ";",
          optional($.expression),
          ";",
          optional($.expression),
          ")",
          $.block,
        ),
        seq("for", $.for_binding, "in", $.expression, $.block),
      ),

    for_initializer: ($) =>
      choice(
        seq(optional(choice("var", "const")), $.identifier, optional(seq("=", $.expression))),
        seq(optional(choice("var", "const")), $.identifier, "in", $.expression),
      ),

    for_binding: ($) => seq(optional(choice("var", "const")), $.identifier),

    switch_statement: ($) =>
      seq(
        "switch",
        $.condition,
        "{",
        repeat(choice($.case_clause, $.default_clause)),
        "}",
      ),

    case_clause: ($) => seq("case", $.expression, ":", repeat($.statement)),

    default_clause: ($) => seq("default", ":", repeat($.statement)),

    return_statement: ($) =>
      prec(1, seq("return", optional($.expression), choice(";", "\n"))),

    break_statement: ($) => seq("break", choice(";", "\n")),

    continue_statement: ($) => seq("continue", choice(";", "\n")),

    block: ($) => seq("{", repeat($.statement), "}"),

    expression_statement: ($) => seq($.expression, choice(";", "\n")),

    expression: ($) => $.assignment_expression,

    assignment_expression: ($) =>
      prec.right(
        1,
        seq(
          $.ternary_expression,
          optional(
            seq(
              choice(
                "=",
                "+=",
                "-=",
                "*=",
                "/=",
                "%=",
                "**=",
                "&=",
                "|=",
                "^=",
              ),
              $.assignment_expression,
            ),
          ),
        ),
      ),

    ternary_expression: ($) =>
      prec.right(
        2,
        seq(
          $.logical_or_expression,
          optional(
            seq("?", $.assignment_expression, ":", $.ternary_expression),
          ),
        ),
      ),

    logical_or_expression: ($) =>
      prec.left(
        3,
        seq(
          $.logical_and_expression,
          repeat(seq(choice("or", "||"), $.logical_and_expression)),
        ),
      ),

    logical_and_expression: ($) =>
      prec.left(
        4,
        seq(
          $.equality_expression,
          repeat(seq(choice("and", "&&"), $.equality_expression)),
        ),
      ),

    equality_expression: ($) =>
      prec.left(
        5,
        seq(
          $.relational_expression,
          repeat(seq(choice("==", "!=", "is"), $.relational_expression)),
        ),
      ),

    relational_expression: ($) =>
      prec.left(
        6,
        seq(
          $.bitwise_or_expression,
          repeat(seq(choice("<", ">", "<=", ">="), $.bitwise_or_expression)),
        ),
      ),

    bitwise_or_expression: ($) =>
      prec.left(
        7,
        seq(
          $.bitwise_xor_expression,
          repeat(seq("|", $.bitwise_xor_expression)),
        ),
      ),

    bitwise_xor_expression: ($) =>
      prec.left(
        8,
        seq(
          $.bitwise_and_expression,
          repeat(seq("^", $.bitwise_and_expression)),
        ),
      ),

    bitwise_and_expression: ($) =>
      prec.left(
        9,
        seq($.shift_expression, repeat(seq("&", $.shift_expression))),
      ),

    shift_expression: ($) =>
      prec.left(
        10,
        seq(
          $.range_expression,
          repeat(seq(choice("<<", ">>"), $.range_expression)),
        ),
      ),

    range_expression: ($) =>
      prec.left(
        11,
        seq(
          $.additive_expression,
          optional(seq(choice("..", "..."), $.additive_expression)),
        ),
      ),

    additive_expression: ($) =>
      prec.left(
        12,
        seq(
          $.multiplicative_expression,
          repeat(seq(choice("+", "-"), $.multiplicative_expression)),
        ),
      ),

    multiplicative_expression: ($) =>
      prec.left(
        13,
        seq(
          $.exponentiation_expression,
          repeat(seq(choice("*", "/", "%"), $.exponentiation_expression)),
        ),
      ),

    exponentiation_expression: ($) =>
      prec.right(
        14,
        seq(
          $.unary_expression,
          optional(seq("**", $.exponentiation_expression)),
        ),
      ),

    unary_expression: ($) =>
      prec(
        15,
        choice(
          seq(choice("!", "not", "~", "+", "-"), $.unary_expression),
          $.postfix_expression,
        ),
      ),

    postfix_expression: ($) =>
      prec.left(
        16,
        seq(
          $.primary_expression,
          repeat(
            choice(
              seq("[", $.expression, "]"),
              seq(".", $.identifier),
              seq("::", $.identifier),
              $.call_suffix,
              $.table_literal,
            ),
          ),
        ),
      ),

    call_suffix: ($) =>
      seq(
        "(",
        optional(seq($.expression, repeat(seq(",", $.expression)))),
        ")",
      ),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.number,
        $.string,
        $.boolean,
        $.nil,
        $.self,
        $.super,
        $.lambda_expression,
        $.array_literal,
        seq("(", $.expression, ")"),
        $.new_expression,
      ),

    new_expression: ($) => seq("new", $.identifier, $.call_suffix),

    lambda_expression: ($) => seq("function", $.parameter_list, $.block),

    array_literal: ($) =>
      seq(
        "[",
        optional(seq($.expression, repeat(seq(",", $.expression)))),
        "]",
      ),

    table_literal: ($) =>
      seq(
        "{",
        optional(seq($.table_entry, repeat(seq(",", $.table_entry)))),
        "}",
      ),

    table_entry: ($) =>
      choice(
        seq("[", $.expression, "]", ":", $.expression),
        seq($.identifier, ":", $.expression),
        $.expression,
      ),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: ($) =>
      choice(
        $.binary_number,
        $.octal_number,
        $.hexadecimal_number,
        $.float_number,
        $.integer_number,
      ),

    binary_number: ($) => /0[bB][0-1]+/,

    octal_number: ($) => /0[cC][0-7]+/,

    hexadecimal_number: ($) => /0[xX][0-9A-Fa-f]+/,

    float_number: ($) => /\d+\.\d+([eE]-?\d+)?|\d+[eE]-?\d+/,

    integer_number: ($) => /\d+/,

    string: ($) =>
      choice(
        $.double_quote_string,
        $.single_quote_string,
        $.backtick_string,
        $.triple_double_quote_string,
        $.triple_single_quote_string,
        $.triple_backtick_string,
      ),

    double_quote_string: ($) =>
      seq(
        '"',
        repeat(choice($.string_escape, $.string_interpolation, /[^"\\$\n]/)),
        '"',
      ),

    single_quote_string: ($) =>
      seq(
        "'",
        repeat(choice($.string_escape, $.string_interpolation, /[^'\\$\n]/)),
        "'",
      ),

    backtick_string: ($) =>
      seq(
        "`",
        repeat(choice($.string_escape, $.string_interpolation, /[^`\\$\n]/)),
        "`",
      ),

    triple_double_quote_string: ($) =>
      seq('"""', repeat(choice($.string_escape, /[^\\]/)), '"""'),

    triple_single_quote_string: ($) =>
      seq("'''", repeat(choice($.string_escape, /[^\\]/)), "'''"),

    triple_backtick_string: ($) =>
      seq("```", repeat(choice($.string_escape, /[^\\]/)), "```"),

    string_escape: ($) =>
      /\\[abfnrtv\\'"`\n]|\\x[0-9A-Fa-f][0-9A-Fa-f]|\\u[0-9A-Fa-f]{4}|\\U[0-9A-Fa-f]{8}/,

    string_interpolation: ($) => seq("${", $.expression, "}"),

    boolean: ($) => choice("true", "false"),

    nil: ($) => "nil",

    self: ($) => "self",

    super: ($) => "super",

    comment: ($) =>
      choice(
        seq("//", /[^\n]*/),
        seq("/*", repeat(choice($.comment, /[^*]/)), "*/"),
      ),
  },

  extras: ($) => [/\s/, $.comment],
});
