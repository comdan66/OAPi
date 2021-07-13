const { PythonShell } = require('python-shell')

let pyshell = new PythonShell('b.py', {
  mode: 'json',
  scriptPath:"./",
  pythonOptions: ['-u'] });

let i = 0
pyshell.on('message', function (message) {
  console.log(message);
});

pyshell.end(function (err,code,signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
  console.log('finished');
});