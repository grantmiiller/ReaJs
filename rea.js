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
  var Reajs = (function () {
   
    var breakpoints = {},
        noop        = function(){},
        console     = window.console || {"log": noop, "warn": noop, "error": noop},
        viewportSize  = window.innerWidth;
   
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

    // window.addEventListener('resize', function() {
    //   viewportSize = window.innerWidth;

    //   for(var key in breakpoints) {
    //     if(checkViewPort(key)) {
    //       breakpoints[key].callbacks[0]();
    //     }
    //   }
    // }, false);

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

        return this;
      },

      fire: function(key, callback, context) {
        var args = Array.prototype.slice.call(arguments, 3);

        if(!key || !callback) {
          console.log( 'Please provide needed parameters' );
          return false;
        }

        context = context || null;

        if(checkViewPort(key)) {
          callback.apply(context, args);
        }
      },

      checkViewPort: checkViewPort
    }


  })();
  
  window.Reajs = Reajs;

})();