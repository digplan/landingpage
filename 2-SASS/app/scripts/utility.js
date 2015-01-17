// window.requestAnimFrame = Modernizr.prefixed('requestAnimationFrame', window) || function( callback ){
//     window.setTimeout(callback, 1000 / 60);
// };
// window.cancelAnimFrame = Modernizr.prefixed('cancelAnimationFrame', window) || function( callback ){
//     window.setTimeout(callback, 1000 / 60);
// };

// $(window).load(function() {
//   alert(window.devicePixelRatio);
// });

$ = jQuery.noConflict();

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());


// Converts strings of type WebkitTransform to -webkit-transform
var inflectProperty = function (str) {
	return str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
};


// Tests for transform-style: preserve-3d which isn't available in IE10
(function(Modernizr, win){
    Modernizr.addTest('csstransformspreserve3d', function () {

        var prop = Modernizr.prefixed('transformStyle');
        var val = 'preserve-3d';
        var computedStyle;
        if(!prop) return false;

        prop = prop.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

        Modernizr.testStyles('#modernizr{' + prop + ':' + val + ';}', function (el, rule) {
            computedStyle = win.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : '';
        });

        return (computedStyle === val);
    });
}(Modernizr, window));



// +function ($) { "use strict";

//   // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
//   // ============================================================

//   function transitionEnd() {
//     var el = document.createElement('bootstrap')

//     var transEndEventNames = {
//       'WebkitTransition' : 'webkitTransitionEnd'
//     , 'MozTransition'    : 'transitionend'
//     , 'OTransition'      : 'oTransitionEnd otransitionend'
//     , 'transition'       : 'transitionend'
//     }

//     for (var name in transEndEventNames) {
//       if (el.style[name] !== undefined) {
//         return { end: transEndEventNames[name] }
//       }
//     }
//   }

//   // http://blog.alexmaccaw.com/css-transitions
//   $.fn.emulateTransitionEnd = function (duration) {
//     var called = false, $el = this
//     $(this).one($.support.transition.end, function () { called = true })
//     var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
//     setTimeout(callback, duration)
//     return this
//   }

//   $.support.transition = transitionEnd();

// }(jQuery);

var _endEvent = function(type) {

  // var $me = this;
  typeLower = type.toLowerCase();

  return typeLower+" webkit"+type+" o"+type+" o"+typeLower;

  // this.element.bind(binding, function() {

  //   $me.element.unbind(binding);

  //   if(typeof todo == "function") {

  //     todo();
  //   }

  //   if(typeof callback == "function") {

  //     callback($me);
  //   }
  // });

};


//var clock;

// function PrefixedEvent(element, type, callback) {
// 	var pfx = ["webkit", "moz", "MS", "o", ""];

// 	for (var p = 0; p < pfx.length; p++) {
// 		if (!pfx[p]) type = type.toLowerCase();
// 		element.addEventListener(pfx[p]+type, callback, false);
// 	}
// }