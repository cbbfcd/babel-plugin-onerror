/**
 * babel-plugin 
*/
import Plugin from './Plugin'

export default ({ template, types }) => {
  
  let plugin = null
  
  // init the plugin or clear
  const Program = {
    enter(path, {opts = {}}){
      plugin = new Plugin(
        opts.reporter,
        opts.isThrow,
        opts.disabled,
        opts.fileName,
        types,
        template
      )
    },
    exit(){
      if(plugin) plugin = null
    }
  }

  const method = 'Function'

  const ret = { 
    visitor: { Program } 
  }

  ret.visitor[method] = function(){
    plugin[method].apply(plugin, [...arguments])
  }

  return ret
}