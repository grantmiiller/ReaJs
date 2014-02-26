# Rea.js

Responsive JavaScript.

## Usage

`Reajs.addBreakpoint` - Adds a new breakpoint to watch, pretty much the first thing you should do
  - Parameters
    - label : {string} Name of the breakpoint, such as "mobile" or "desktop"
    - opts : {object} Object that has max, min, or both properties set

Example:
```
  Reajs.addBreakpoint('desktop', {min: 851});
  Reajs.addBreakpoint('tablet', {min: 601, max: 850});
  Reajs.addBreakpoint('mobile', {max: 600});
```

`Reajs.registerCallback` - Adds a callback to the passed breakpoint
  - Paramters
    - key : {string|array} Name of the breakpoint(s) that the callback should fire when entering
    - flags : @OPTIONAL {object} - Flags to pass, only 'continous' exists for now
    - callback : {function} The function to call when entering breakpoint
    - context : {object} The context to use in the function
    - Any extra parameters will be passed back to the function

Example:
```
  Reajs.registerCallback(Reajs.getBreakpoints(), function(input) {
    console.log('On Desktop. ' + input);
  }, null, "Woo");

  // outputs: "On Desktop. Woo";

  function Car() {
    this.goes = "honk honk";

    this.say = function(input) {
      console.log("Car says " + input + ": " + this.goes);
    };
  }

  var myCar = new Car();

  Reajs.registerCallback(['mobile', 'tablet'], myCar.say, myCar, 'hello');

  // outputs: "Car says hello: honk honk"
```

`Reajs.fire` - Fires a callback if in the provided breakpoint
  - Paramters
    - key : {string|array} Name of the breakpoint(s) that the callback should fire when entering
    - callback : {function} The function to call when entering breakpoint
    - context : {object} The context to use in the function
    - Any extra parameters will be passed back to the function

Example:
```
  Reajs.fire(Reajs.getBreakpoints(), function(input) {
    console.log('On Desktop. ' + input);
  }, null, "Woo");

  // outputs: "On Desktop. Woo";

  function Car() {
    this.goes = "honk honk";

    this.say = function(input) {
      console.log("Car says " + input + ": " + this.goes);
    };
  }

  var myCar = new Car();

  Reajs.fire(tablet', myCar.say, myCar, 'hello');

  // outputs: "Car says hello: honk honk"
```

`Reajs.getBreakpoints` - Returns an array of breakpoints

Example:
```
  Reajs.addBreakpoint('desktop', {min: 851});
  Reajs.addBreakpoint('tablet', {min: 601, max: 850});
  Reajs.addBreakpoint('mobile', {max: 600});

  console.log(Reajs.getBreakpoints());

  //outputs: ['desktop', 'tablet', 'mobile']
```

`Reajs.fireCallbacks` - Fires all callbacks of breakpoint, even if not in breakpoint
  - Parameters
    - key : {string} - Name of the breakpoint

Example:
```
  Reajs.fireCallbacks('tablet');
```

`Reajs.checkViewport` - Checks if you are in the provided breakpoint and returns true if you are or false if not
  - Parameters
    - key : {string} - Name of the breakpoint

Example:
```
  Reajs.addBreakpoint('tablet', {min: 601, max: 850});

  // Browser window is 750

  console.log(Reajs.checkViewPort('tablet'));

  //outputs: true
```

`Reajs.forceViewportCheck` - Forces a check to see what the browser window width is

