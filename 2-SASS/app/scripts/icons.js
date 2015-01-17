var fitIcons;

+(function () {
	"use strict";

    var timer;

	fitIcons = function() {
		var page = $('.site-page--active');

        if(typeof page === "undefined" || !page.length ) {
            timer = setTimeout(fitIcons, 100);
            return;
        }

		var nav = $('.nav-social');
        var mainNav = $('.nav-left, .nav-right, .nav-close');

        requestAnimationFrame(function() {
			if(window.innerHeight - page.outerHeight() <= 108 * 2) {
				nav.addClass('nav--small');

	            if(window.innerWidth < 1220) {
	                mainNav.addClass('nav--small');
	            } else {
	                mainNav.removeClass('nav--small');
	            }
			} else {
				nav.removeClass('nav--small');
	            mainNav.removeClass('nav--small');
			}
		});
	}


	$(window).resize(function() {
		clearTimeout(timer);
		timer = setTimeout(fitIcons, 100);
	}).one('ready load miniGo.ready', fitIcons);

}())