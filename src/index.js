import { shouldSkip, handleFunctionBody } from './helper';
import { wrapperWithThrow, wrapperWithNoThrow } from './template';

export default () => ({
  visitor: {
    ArrowFunctionExpression: {
      exit(path, state) {
        if (shouldSkip(path)) {
          return;
        }
        const wrapperFunction = state.opts.isThrow ? wrapperWithThrow : wrapperWithNoThrow;
        handleFunctionBody(path, state, wrapperFunction);
      },
    }
  },
});
