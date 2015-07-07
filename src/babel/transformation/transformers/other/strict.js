import * as t from "../../../types";

export var metadata = {
  group: "builtin-pre"
};

const THIS_BREAK_KEYS = ["FunctionExpression", "FunctionDeclaration", "ClassExpression", "ClassDeclaration"];

export var visitor = {
  Program: {
    enter(program) {
      var first = program.body[0];
      var useStrict = "use strict";
      var directive;

      if (
        t.isExpressionStatement(first) &&
        t.isLiteral(first.expression) &&
        first.expression.raw.slice(1, -1) === useStrict
      ) {
        directive = first;
      } else {
        directive = t.expressionStatement(t.literal(useStrict));
        this.unshiftContainer("body", directive);
        if (first) {
          directive.leadingComments = first.leadingComments;
          first.leadingComments = [];
        }
      }
      directive._blockHoist = Infinity;
    }
  },

  ThisExpression() {
    if (!this.findParent((path) => !path.is("shadow") && THIS_BREAK_KEYS.indexOf(path.type) >= 0)) {
      return t.identifier("undefined");
    }
  }
};
