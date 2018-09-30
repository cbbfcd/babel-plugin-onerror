

import template from '@babel/template';

export const wrapperWithThrow = template(`
  try{
    BODY
  }catch(ERROR_VARIABLE){
    ERROR_REPORTER(ERROR_VARIABLE, FUNCTION_NAME, FILE_NAME, ROW, COL)
    throw ERROR_VARIABLE
  }
`);

export const wrapperWithNoThrow = template(`
  try{
    BODY
  }catch(ERROR_VARIABLE){
    ERROR_REPORTER(ERROR_VARIABLE, FUNCTION_NAME, FILE_NAME, ROW, COL)
  }
`);
