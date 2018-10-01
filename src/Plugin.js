/**
 * plugin class
 * @author: bobi
 * @description: something about the babel-plugin, anyway there so many todos.
*/
'use strict'

export default class Plugin {

  constructor(reporter, isThrow, disabled, fileName, types, template){
    this.reporter = reporter || 'window.reporter'
    this.isThrow = isThrow || false
    this.disabled = disabled || false
    this.fileName = fileName || 'unkown'
    this.types = types
    this.template = template
    this.wrapperTemplateWithoutThrow = this.wrapperTemplateWithoutThrow.bind(this)
    this.wrapperTemplateWithThrow = this.wrapperTemplateWithThrow.bind(this)
  }

  wrapperTemplateWithThrow(data){
    const wrapper = this.template(`{
      try{
        FUNCTION_BODY
      }catch(ERROR_VARIABLE){
        ERROR_REPORTER(ERROR_VARIABLE, FUNCTION_NAME, FILE_NAME, ROW, COL)
        throw ERROR_VARIABLE
      }
    }`)
    return wrapper.call(null, data)
  }

  wrapperTemplateWithoutThrow(data){
    const wrapper = this.template(`{
      try{
        FUNCTION_BODY
      }catch(ERROR_VARIABLE){
        ERROR_REPORTER(ERROR_VARIABLE, FUNCTION_NAME, FILE_NAME, ROW, COL)
      }
    }`)
    return wrapper.call(null, data)
  }

  isLegalComments(comments){
    return comments.some(comment => comment.type === 'CommentBlock' && /no-?catch/ig.test(comment.value))
  }

  isLegalIdentifierComments(path, types){
    if(types.isIdentifier(path.node)){
      const { trailingComments } = path.node
      if(trailingComments && trailingComments.length && this.isLegalComments(trailingComments)) return true
    }
    return false
  }

  shouldSkip(path){
    const { loc } = path.node
    const { body } = path.node.body
    const types = this.types

    // have an empty function body
    if(body && body.length === 0) return true
    if(!loc) return true
    
    // have a legal trailingComments or leadingComments, like /*no-catch*/
    if(types.isClassMethod(path.node)){
      const keyPath = path.get('key')
      if(this.isLegalIdentifierComments(keyPath, types)) return true
    }

    if(types.isArrowFunctionExpression(path.node)){
      let leadingComments = path.node.leadingComments || path.node.body.leadingComments
      if(leadingComments && leadingComments.length && this.isLegalComments(leadingComments)) return true
    }

    if(types.isFunctionExpression(path.node)){
      // Anonymous function
      const { id, body } = path.node
      if(!id && body.leadingComments){
        const { leadingComments } = body
        if(leadingComments.length && this.isLegalComments(leadingComments)) return true
      }
    }

    if(this.isLegalIdentifierComments(path.get('id'), types)) return true

    // TODO had a try...catch already
    // TODO promise
    // TODO recorded
    // TODO ...

    return false
  }

  getFunctionName(path, types){
    if(types.isClassMethod(path.node)){
      const { name } = path.node.key
      return name
    }
    
    if((types.isFunctionExpression(path.node) || types.isArrowFunctionExpression(path.node)) && !path.node.id){
      const paren = path.parent
      if(paren && types.isVariableDeclarator(paren)){
        return paren.id.name
      }
    }

    if(path.node.id){
      return path.node.id.name
    }

    return 'anonymous function'
  }

  Function(path, state){
    const types = this.types
    const { file } = state

    if(this.disabled) return

    if(this.shouldSkip(path)) return

    const wrapperFunction = this.isThrow ? this.wrapperTemplateWithThrow : this.wrapperTemplateWithoutThrow
    
    // error info
    const { loc } = path.node
    const fileName = file.opts.filename || this.fileName
    const errorVariable = path.scope.generateUidIdentifier('e')
    const functionName = this.getFunctionName(path, types)

    const ast = wrapperFunction({
      FUNCTION_BODY: path.node.body.body,
      ERROR_VARIABLE: errorVariable,
      ERROR_REPORTER: types.identifier(this.reporter),
      FUNCTION_NAME: types.stringLiteral(functionName),
      FILE_NAME: types.stringLiteral(fileName),
      ROW: types.numericLiteral(loc.start.line),
      COL: types.numericLiteral(loc.start.column)
    })

    path.get('body').replaceWith(ast)
  }
}