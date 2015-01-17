+(function(){
	'use strict';

	window.miniGo = {};

	window.miniGo.clockReady = false;
	window.miniGo.videoReady = false;
	window.miniGo.ready = false;
	if(Modernizr.touch || miniGoOptions.background.type !== 'video') {
		window.miniGo.videoReady = true;
	}

	$('body').on('miniGo.ready', function() {
		window.miniGo.ready = true;
	});

	if (miniGoOptions.theme.contentBackground) {
		$('.site-page').addClass('site-page-padded');
	}

	if (miniGoOptions.background.color) {
		$('body').css({backgroundColor: miniGoOptions.background.color});
	}

	if(miniGoOptions.countdown.type == 'piechart' && Modernizr.canvas) {
		$('.clock').addClass('clock-alt');
	}

	var patternOverlay = miniGoOptions.background.patternOverlay || false;
	if(patternOverlay) {
		$('<div class="pattern-wrapper"></div>').css({backgroundImage: 'url(' + patternOverlay + ')', opacity: miniGoOptions.background.patternOverlayOpacity}).appendTo('body');
	}

}());