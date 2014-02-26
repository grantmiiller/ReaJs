# Rea.js

Responsive JavaScript.

## Usage

`Reajs.addBreakpoint` - Adds a new breakpoint to watch
  - Parameters
    - label : {string} Name of the breakpoint, such as "mobile" or "desktop"
    - opts : {object} Object that has max, min, or both properties set

Example:
```
  Reajs.addBreakpoint('desktop', {min: 851});
  Reajs.addBreakpoint('tablet', {min: 601, max: 850});
  Reajs.addBreakpoint('mobile', {max: 600});
```