/**
 * babel-plugin 
*/
import Plugin from './Plugin'

export default ({ template, types }) => {
  let plugin = null
  const method = 'Function'
  return {
    pre({opts = {}}){
      plugin = new Plugin(
        opts.reporter,
        opts.isThrow,
        opts.disabled,
        opts.fileName,
        types,
        template
      )
    },
    visitor: {
      [method]: {
        exit(){
          plugin[method].apply(plugin, [...arguments])
        }
      }
    },
    post(){
      if(plugin) plugin = null
    }
  }
}