# babel-plugin-onerror

> The project is experimental in nature, with a unified, automated anomaly capture and reporting scheme

> under develop!

> inspired by [jacksky007](https://myslide.cn/slides/1031)


Front-end engineers need to quickly and accurately locate the exception code, so we need a front-end anomaly monitoring system.

We have some options:

1. window.onerror

  Global interception is not reliable, such as "Script Error".
  
  Fortunately, we can solve this problem through a cross-domain solution

  ```js
  <script crossorigin src='...'></script>
  //Access-Control-Allow-Origin: '*'
  ```

2. try...catch...  or promise().catch()

   The exception log report can be finely controlled. The problem is that the error stack information is not uniform. 
   
   For asynchronous methods, because the execution stack is different, it is impossible to catch exceptions (trycatch), etc.
  
3. ...

## about

so there a cool plan:

babel!

Babel contains a loc information, including the line number and column number.

we can wrap a unified exception information, including function name, file name, error information, line number, column number, and more... 

```js
{
  row: 12,
  col: 34,
  fileName: 'xxx.js',
  functionName: 'xxx',
  error: {
    ...
  }
}
```

automatic function at compile stage The package is flexibly controlled by a symbol such as /*nocatch*/.

```js
const test = () => {
  console.log('hello world!')
}
```

will be converted into:

```js
const test = () => {
  try{
    console.log('hello world!')
  }catch(e){
    someReporter(e)
  }
}
```

if you code like this, it's not work. so more flexible!

```js
const test /*nocatch*/ = () => {...} // will not be converted
```

## end

These are the things the project is doing, and of course there are a lot of imperfections that need everyone's help to guide.

I will continue to improve the project and add the test code

## features

- [ x ] support flexible /*no-?catch*/i! 

## todos

- [  ] Performance issues with try...catch..

- [  ] File size will increase 5%-15%

- [  ] promise

- [  ] react or vue ...
