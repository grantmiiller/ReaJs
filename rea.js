/*
*   Rea.Js (Reagis, get it? Ha Ha Ha)
*   @author     Grant Miiller
*   @version    0.1.0
*   @classDesc  Reactive JS
*
*   USAGE
*   ----------------------------------
*   Used to call JS at certain break points
*
*/

/*
*   SPECIAL THANKS
*   to John Mullanaphy (http://jo.mu) for telling me every little problem he has with my code
*/


(function(global, undefined) {

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

  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  function isArray(obj) {
    return toString.call(obj) === "[object Array]";
  }

  //addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
  (function(win, doc){
    if(win.addEventListener)return;   //No need to polyfill
   
    function docHijack(p){var old = doc[p];doc[p] = function(v){return addListen(old(v));};}
    function addEvent(on, fn, self){
      return (self = this).attachEvent('on' + on, function(evt){
        var e = evt || win.event;
        e.preventDefault  = e.preventDefault  || function(){e.returnValue = false;};
        e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true;};
        fn.call(self, e);
      });
    }
    function addListen(obj, i){
      if(i = obj.length)while(i--)obj[i].addEventListener = addEvent;
      else obj.addEventListener = addEvent;
      return obj;
    }
   
    addListen([doc, win]);
    if('Element' in win)win.Element.prototype.addEventListener = addEvent;      //IE8
    else{   //IE < 8
      doc.attachEvent('onreadystatechange', function(){addListen(doc.all);});    //Make sure we also init at domReady
      docHijack('getElementsByTagName');
      docHijack('getElementById');
      docHijack('createElement');
      addListen(doc.all); 
    }
  })(window, document);
  // END Polyfills

  var Reajs = (function () {
   
    var breakpoints         = {},
        activeBreakpoints   = [],
        noop                = function(){},
        console             = window.console || {"log": noop, "warn": noop, "error": noop},
        viewportSize        = window.innerWidth;
   
    function checkViewport(key) {
      if(breakpoints[key].min <= viewportSize) {

        if(breakpoints[key].max) {
          if( breakpoints[key].max >= viewportSize ) {
            return true;
          }
        } else {
          return true;
        }
      }

      if(breakpoints[key].max && !breakpoints[key].min && breakpoints[key].max >= viewportSize) {
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
      if(activeBreakpoints.indexOf(key) === -1 ) {
        return false;
      }
      return true;
    }

    function fireAllCallbacks(key) {
      var callbacks = breakpoints[key].callbacks,
          callback = null;

      for(var i = 0, len = callbacks.length; i < len; i++ ) {
        callback = callbacks[i];
        callback.func.apply(callback.context, callback.args);
      }
    }

    function fireContinuousCallbacks(key) {
      var callbacks = breakpoints[key].callbacks,
          callback = null;

      for(var i = 0, len = callbacks.length; i < len; i++ ) {
        callback = callbacks[i];
        if(callback.continuous) {
          callback.func.apply(callback.context, callback.args);
        }
      }
    }

    /* Watch to see when to fire events */

    window.addEventListener('resize', function() {
      viewportSize = window.innerWidth;

      for(var key in breakpoints) {

        if(checkViewport(key)) {
          if(!checkActiveBreakpoint(key)) {
            addActiveBreakpoint(key);
            fireAllCallbacks(key);
          } else {
            fireContinuousCallbacks(key);
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

        if(checkViewport(key)) {
          addActiveBreakpoint(key);
        }

        return this;
      },

      getBreakpoints: function() {
        var ret_bp = [];

        for(var key in breakpoints) {
          ret_bp.push(key);
        }

        return ret_bp;
      },

      registerCallback: function(key, flags, callback, context) {

        var temp, args;

        if(!key || !callback) {
          console.log( 'Please provide needed paramters' );
          return false;
        }

        if(isFunction(flags)) {
          args = Array.prototype.slice.call(arguments, 3);
          temp = callback;
          callback = flags;
          context = temp;
        } else {
          args = Array.prototype.slice.call(arguments, 4);
        }

        context = context || null;

        if(isArray(key)) {

          var thisKey;

          for(var i = 0, len = key.length; i < len; i++) {

            thisKey = key[i];

            if(!breakpoints[thisKey]) {
              console.log('Breakpoint does not exist');
              return false;
            }

            breakpoints[thisKey].callbacks.push({
              func: callback,
              context: context, 
              args: args,
              continuous: (flags && flags.continuous) ? flags.continuous : false
            });

          }
        } else {

          if(!breakpoints[key]) {
            console.log('Breakpoint does not exist');
            return false;
          }

          breakpoints[key].callbacks.push({
            func: callback,
            context: context, 
            args: args,
            continuous: (flags && flags.continuous) ? flags.continuous : false
          }); 

        }
      },

      onBreakpoint: function(key, callback, context) {
        var args = Array.prototype.slice.call(arguments, 3);

        if(!key || !callback) {
          console.log( 'Please provide needed paramters' );
          return false;
        }

        context = context || null;

        if(isArray(key)) {

          var thisKey;

          for(var i = 0, len = key.length; i < len; i++) {

            thisKey = key[i];

            if(!breakpoints[thisKey]) {
              console.log('Breakpoint does not exist');
              return false;
            }

            breakpoints[thisKey].callbacks.push({
              func: callback,
              context: context, 
              args: args
            });

          }
        } else {

          if(!breakpoints[key]) {
            console.log('Breakpoint does not exist');
            return false;
          }

          breakpoints[key].callbacks.push({
            func: callback,
            context: context, 
            args: args
          }); 

        }
      },

      fireCallbacks: fireAllCallbacks,

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

        if(checkViewport(key)) {
          callback.apply(context, args);
        }
      },

      checkViewport: checkViewport,

      forceViewportCheck: function() {
        viewportSize = window.innerWidth;
      }
    };


  })();

  if ( typeof define === 'function' && define.amd) {
    define('reajs', [], function(){return Reajs;});
  } else if (typeof exports !== 'undefined') {
    exports.Reajs = Reajs;
  } else {
    global.Reajs = Reajs;
  }
    return Reajs;
  })(this);

})(this);