+(function() {
	var loader = $('.loader');
	var body = $('body');

	body.addClass('loader--loading');

	var hideLoader = function() {
		loader.on(_endEvent('TransitionEnd'), function(e) {
			if(e.eventPhase > 2)
				return;

			body.trigger('miniGo.ready');
            loader.css({
                display: 'none'
            });
        });

        if(!Modernizr.csstransitions) {
        	loader.trigger('transitionend');
        }

		setTimeout(function() {
			requestAnimationFrame(function(){
				// loader.css({
				// 	opacity: 0
				// });
			});
		}, 10);
	};

	var interval;
	var totalTime = 0;
	var loadEventTriggered = false;

	var loaded = function() {
		hideLoader();

		requestAnimationFrame(function(){
			body.addClass('loader--loaded');
		});

		$('.site-wrapper').one(_endEvent('TransitionEnd'), function(e) {
			if(e.eventPhase > 2)
				return;

			setTimeout(function() {
				body.removeClass('loader--loaded loader--loading');
			}, 600);
		});
	};

	setTimeout(function() {
		if(!loadEventTriggered) {
			loaded();
		}
	}, 4000);

	$(window).one('load', function() {
		loadEventTriggered = true;

		interval = setInterval(function() {
			totalTime += 50;
			if(totalTime < 4000 && (!window.miniGo.videoReady || !window.miniGo.clockReady))
				return;

			clearInterval(interval);

			loaded();

		}, 50);
	});

}());