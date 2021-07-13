
const GPIO = require('pigpio').Gpio
const R_LED = new GPIO(17, { mode: GPIO.OUTPUT })
const G_LED = new GPIO(18, { mode: GPIO.OUTPUT })
const B_LED = new GPIO(27, { mode: GPIO.OUTPUT })

R_LED.pwmFrequency(40000)

let dutyCycle = 0;
let dutyCycle2 = 100;

let timer = setInterval(() => {
  R_LED.pwmWrite(dutyCycle = dutyCycle < 255 ? dutyCycle + 1 : 0)

}, 20);

// setTimeout(_ => {
//   console.error('1');
  
//   clearInterval(timer)
//   // R_LED.unexport()
//   console.error(R_LED);
  
// }, 5000)


// let i = 0

// R_LED.digitalWrite(1);

// let timer = setInterval(_ => {
//   if (i == 0) {
//     // R_LED.pwmWrite(0)
//     // G_LED.writeSync(0)
//     // B_LED.writeSync(0)
//     i++
//   } else if (i == 1) {
//     // R_LED.pwmWrite(50)
//     // R_LED.writeSync(0)
//     // G_LED.writeSync(1)
//     // B_LED.writeSync(0)
//     i++
//   } else if (i == 2) {
//     // R_LED.pwmWrite(100)
//     // R_LED.writeSync(0)
//     // G_LED.writeSync(0)
//     // B_LED.writeSync(1)
//     i = 0
//   }
//   console.error(i);
  
//   // if (R_LED.readSync() === 0) {
//   //   
//   //   // G_LED.writeSync(0)
//   //   // B_LED.writeSync(0)
//   // } else {
//   //   R_LED.writeSync(0.5)
//   //   // G_LED.writeSync(1)
//   //   // B_LED.writeSync(0)
//   // }
// }, 250)

// setTimeout(_ => {
//   clearInterval(timer)

//   // R_LED.writeSync(0)
//   // R_LED.unexport()

//   // G_LED.writeSync(0)
//   // G_LED.unexport()

//   // B_LED.writeSync(0)
//   // B_LED.unexport()
// }, 5000)