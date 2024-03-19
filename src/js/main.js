// Will run first
console.log('First log');

setTimeout(() => {
  // Will run last, after 2000 milliseconds
  console.log('Second log');
}, 2000);

// Will run second
console.log('Third log');
