import * as t from '@babel/types';

export const hasLegalComments = comments => comments.some(item => t.isCommentBlock(item) && (/no-?catch/ig.test(item.value)));

export const isLegalForIdentifierTrailingComments = (path) => {
  if (t.isIdentifier(path.node)) {
    const { trailingComments } = path.node;
    if (trailingComments && hasLegalComments(trailingComments)) return true;
  }
  return false;
};

// if hava a trailingComments like /* noCatch */, or funciton body is empty, should skip
export const shouldSkip = (path) => {
  const { body } = path.node.body;
  if (!body.length) {
    return true;
  }
  if(!path.get('body').get('body')){
    return true
  }

  if (t.isArrowFunctionExpression(path.node)) {
    const { leadingComments } = path.node;
    if (leadingComments && hasLegalComments(leadingComments)) return true;
  }

  if (t.isFunctionExpression(path.node)) {
    // Anonymous function
    if (!path.node.id) {
      const bodyPath = path.get('body');
      const { leadingComments } = bodyPath.node;
      if (leadingComments && hasLegalComments(leadingComments)) return true;
    }
  }

  if (t.isClassMethod(path.node)) {
    if (isLegalForIdentifierTrailingComments(path.get('key'))) return true;
  }

  if (isLegalForIdentifierTrailingComments(path.get('id'))) return true;

  return false;
};

export const handleFunctionBody = (path, state, wrapperFunction) => {
  const body = path.node.body.body;
  let functionName = 'anonymous function';

  if (path.node.key) {
    functionName = path.node.key.name || 'anonymous function';
  }
  if(path.node.id){
    functionName = path.node.id.name || 'anonymous function';
  }

  const { loc } = path.node;
  const { filenameRelative = 'unkown file name' } = state.file.opts;
  const errorVariableName = path.scope.generateUidIdentifier('e');
  const reporter = state.opts.reporter || 'window.reporter';
  const ast = wrapperFunction({
    BODY: body,
    ERROR_VARIABLE: errorVariableName,
    ERROR_REPORTER: t.identifier(reporter),
    FUNCTION_NAME: t.stringLiteral(functionName),
    FILE_NAME: t.stringLiteral(filenameRelative),
    ROW: t.numericLiteral(loc.start.line),
    COL: t.numericLiteral(loc.start.column),
  });

  path.get('body').replaceWith(ast);
};
