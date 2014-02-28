# Rea.js

Responsive Javascript that works with breakpoints

## Usage

First begin by creating a few breakpoints

```
  Reajs.addBreakpoint('desktop', {min: 851});
  Reajs.addBreakpoint('tablet', {min: 601, max: 850});
  Reajs.addBreakpoint('mobile', {max: 600});
```

Then using your breakpoint labels, you can execute functions if you are within a certain breakpoint...

```
  function Car() {
    this.goes = "honk honk";

    this.say = function(input) {
      console.log("Car says " + input + ": " + this.goes);
    };
  }

  var myCar = new Car();

  Reajs.fire('tablet', myCar.say, myCar, 'Hello!');
  
  // If browser window is between 601 and 850 pixels, outputs "Car says Hello!: honk honk"

```

...or execute callbacks when entering, leaving, or within breakpoints

```

  // Flags are optional (2nd paramter). If none are set, defaults to callbacks firing once when entering breakpoint

  Reajs.registerCallback('mobile', myCar.say, myCar, 'Success!');
  // Equivalent of Reajs.registerCallback('mobile', {on: true}, myCar.say, myCar, 'Success!');
  // If entering the mobile breakpoint, outputs "Car says Success!: honk honk"

  Reajs.registerCallback('desktop', {off: true },  myCar.say, myCar, 'we just left desktop!');
  // If leaving the desktop breakpoint, outputs "Car says we just left desktop!: honk honk"

  Reajs.registerCallback('desktop', {off: true },  myCar.say, myCar, 'we just left desktop!');
  // If leaving the desktop breakpoint, outputs "Car says we just left desktop!: honk honk"

  Reajs.registerCallback('tablet', {continuous: true },  myCar.say, myCar, 'we are in tablet!');
  // Fires on scren resize while in tablet breakpoint, outputs "Car says we are in tablet!: honk honk"

```

## Methods


`Reajs.addBreakpoint` - Adds a new breakpoint to watch, pretty much the first thing you should do
  - Parameters
    - label : {string} Name of the breakpoint, such as "mobile" or "desktop"
    - opts  : {object} Object that has max, min, or both properties set

Example:
```
  Reajs.addBreakpoint('desktop', {min: 851});
  Reajs.addBreakpoint('tablet', {min: 601, max: 850});
  Reajs.addBreakpoint('mobile', {max: 600});
```


`Reajs.getBreakpoints` - Returns an array of all breakpoint labels

Example:
```
  Reajs.getBreakpoints();
  // ['desktop','tablet','mobile']
```

      
`Reajs.getActiveBreakpoints` - Returns an array of all active breakpoint labels


`Reajs.registerCallback` - Adds a callback to the passed breakpoint
  - Paramters
    - key       : {string|array} Name of the breakpoint(s) that the callback should fire when entering
    - flags     : @OPTIONAL {object} - Flags to pass
       - on          : {boolean} @default=true - Fires once when entering breakpoint
       - off         : {boolean} @default=false - Fires once when leaving breakpoint
       - continuous  : {boolean} @default=false - Fires on resize while in breakpoint

    - callback  : {function} The function to call when entering breakpoint
    - context   : {object} The context to use in the function
    - Any extra parameters will be passed back to the function

Example:
```
  Reajs.registerCallback('mobile', myCar.say, myCar, 'Success!');
  // Equivalent of Reajs.registerCallback('mobile', {on: true}, myCar.say, myCar, 'Success!');
  // If entering the mobile breakpoint, outputs "Car says Success!: honk honk"
```


`Reajs.fire` - Fires a callback if in the provided breakpoint
  - Paramters
    - key : {string|array} Name of the breakpoint(s) that the callback should fire when entering
    - callback : {function} The function to call when entering breakpoint
    - context : {object} The context to use in the function
    - Any extra parameters will be passed back to the function

Example:
```
Reajs.fire('tablet', myCar.say, myCar, 'Hello!');
  // If browser window is between 601 and 850 pixels, outputs "Car says Hello!: honk honk"
```


`Reajs.checkViewport` - Checks if you are in the provided breakpoint and returns true if you are or false if not
  - Parameters
    - key : {string} - Name of the breakpoint

Example:
```
  Rea.js.checkViewport('tablet');
```

`Reajs.forceViewportCheck` - Forces a check on the screen width
  -truthfully mostly used in testing
