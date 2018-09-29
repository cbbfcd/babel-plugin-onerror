/**
 * error instance
*/
'use strict'

export default class Error {
  constructor(){
    this.fileName = ''
    this.functionName = ''
    this.col = 0
    this.row = 0
    this.message = ''
    this.error = {}
    this.more = {}
  }

  get bug(){
    return {
      fileName: this.fileName,
      functionName: this.functionName,
      col: this.col,
      row: this.row,
      message: this.message,
      error: this.error,
      more: this.more
    }
  }

  set bug({fileName, functionName, col, row, message, error, more}){
    this.fileName = fileName || ''
    this.functionName = functionName || ''
    this.col = col || 0
    this.row = row || 0
    this.message = message || ''
    this.error = error || {}
    this.more = more || {}
  }
}