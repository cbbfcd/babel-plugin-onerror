import myPlugin from '../src'
import * as fs from 'fs'
import path from 'path'
import * as babel from '@babel/core'

fs.readFile(path.join(__dirname, '/inputTest.js'), (err, data) => {
  if(err) throw err

  const src = data.toString()
  const out = babel.transform(src, {
    plugins: [
      [myPlugin, {
        reporter: 'myReporter',
        isThrow: false
      }]
    ]
  })

  console.log('==========> out: ', out.code)
})
