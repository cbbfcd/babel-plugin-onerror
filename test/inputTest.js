class Test {
  demoOne(){
    console.log('this is demo one')
  }

  demoTwo/*nocatch*/(){
    console.log('this is demo two')
  }
}

function demoThree(){
  console.log('this is demo three')
}

function demoFour /*nocatch*/(){
  console.log('this is demo four')
}

const demoFive = function(){
  console.log('this is demo five')
}

const demoSix = function/*nocatch*/(){
  console.log('this is demo six')
}

const demoSeven = () => {
  console.log('this is demo seven')
}

const demoEight/*nocatch*/ = () => {
  console.log('this is demo eight')
}