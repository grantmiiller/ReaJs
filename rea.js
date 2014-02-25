/*
*   Rea.Js (Reagis, get it? Ha Ha Ha)
*   @author     Grant Miiller
*   @version    0.0.1
*   @classDesc  Reactive JS
*
*   USAGE
*   ----------------------------------
*   Used to call JS at certain break points
*
*/

/*
*   RELEASE NOTES
*   
*   Version 0.1.1 - Grant Miiller
*   -Initial setup of everything
*/


(function(undefined) {

  //START Polyfills

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }

  // END Polyfills

  var Reajs = (function () {
   
    var breakpoints         = {},
        activeBreakpoints   = [],
        noop                = function(){},
        console             = window.console || {"log": noop, "warn": noop, "error": noop},
        viewportSize        = window.innerWidth;
   
    function checkViewPort(key) {
      if(breakpoints[key].min < viewportSize) {

        if(breakpoints[key].max) {
          if( breakpoints[key].max > viewportSize ) {
            return true;
          }
        } else {
          return true;
        }
      }

      if(breakpoints[key].max && !breakpoints[key].min && breakpoints[key].max > viewportSize) {
        return true;
      }

      return false;
    }

    function addActiveBreakpoint(key) {
      if(activeBreakpoints.indexOf(key) === -1 ) {
        activeBreakpoints.push(key);
      }

      return this;
    }

    function removeActiveBreakpoint(key) {
      var i = activeBreakpoints.indexOf(key);

      if(i !== -1) {
        activeBreakpoints.splice(i, 1);
      }
    }

    function checkActiveBreakpoint(key) {
      console.log(activeBreakpoints.indexOf(key));
      if(activeBreakpoints.indexOf(key) === -1 ) {
        return false;
      }
      return true;
    }

    function fireCallbacks(key) {
      var callbacks = breakpoints[key].callbacks,
          callback = null;

      for(var i = 0, len = callbacks.length; i < len; i++ ) {
        callback = callbacks[i];
        callback.func.apply(callback.context, callback.args);
      }
    }

    /* Watch to see when to fire events */

    window.addEventListener('resize', function() {
      viewportSize = window.innerWidth;

      for(var key in breakpoints) {
        if(checkViewPort(key)) {
          if(!checkActiveBreakpoint(key)) {
            addActiveBreakpoint(key);
            fireCallbacks(key);
          }
        } else {
          removeActiveBreakpoint(key);
        }
      }
    }, false);

    return {
   
      addBreakpoint: function (key, opts) {
        if(!key) {
          console.log('Please specify a label');
          return;
        }

        if(!opts || (!opts.min && !opts.max)) {
          console.log('Must provide minimum or maximum breakpoint');
          return;
        }

        breakpoints[key] = {
          min:        opts.min || null,
          max:        opts.max || null,
          callbacks : []
        };

        if(checkViewPort(key)) {
          addActiveBreakpoint(key);
        }

        return this;
      },

      registerCallback: function(key, flags, callback, context) {

      },

      onBreakpoint: function(key, callback, context) {
        var args = Array.prototype.slice.call(arguments, 3);

        if(!key || !callback) {
          console.log( 'Please provide needed paramters' );
          return false;
        }

        if(!breakpoints[key]) {
          console.log('Breakpoint does not exist');
          return false;
        }

        context = context || null;

        breakpoints[key].callbacks.push({
          func: callback,
          context: context, 
          args: args
        }); 
      },

      fireCallbacks: fireCallbacks,

      fire: function(key, callback, context) {
        var args = Array.prototype.slice.call(arguments, 3);

        if(!key || !callback) {
          console.log( 'Please provide needed parameters' );
          return false;
        }

        if(!breakpoints[key]) {
          console.log('Breakpoint does not exist');
          return false;
        }

        context = context || null;

        if(checkViewPort(key)) {
          callback.apply(context, args);
        }
      },

      checkViewPort: checkViewPort
    };


  })();

  window.Reajs = Reajs;

})();