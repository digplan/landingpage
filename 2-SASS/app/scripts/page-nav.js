+(function(){
	"use strict";

	var currentPage,
	currentPageOffset,
	currentPageSize = {},

	nextPage,
	nextPageSize = {},

	wrapper = $('.site-wrapper'),

	classesToClear = 'site-page--' + ['go-right', 'come-right', 'go-left', 'come-left', 'reset'].join(' site-page--');

	var ie10 = false;
	if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
		ie10 = true;
	}

	var centerPages = function() {
		var pages = [currentPage, nextPage];
		var h;
		var wH = window.innerHeight;
		var padding = parseInt(wrapper.css('padding-top').replace('px'));

		for (var i=0; i<pages.length; i++) {
			h = pages[i].outerHeight();

			if((h / 2) - (wH / 2) + padding < 0) {
				if(ie10) {
					pages[i].css({
						marginTop: (wH/2) - padding
					});
				}
			} else {
				if (ie10) {
					pages[i].css({
						marginTop: h/2
					});
				} else {
					pages[i].css({
						marginTop: (h / 2) - (wH / 2) + padding
					});
				}
			}
		}
	};
	//centerPages();

	var accountForScroll = function() {
		if(currentPage.hasClass('site-front')) {
			var pages = [nextPage];
		} else {
			var pages = [currentPage, nextPage];
		}
		var h;
		var wH = window.innerHeight;
		var padding = parseInt(wrapper.css('padding-top').replace('px'));

		for (var i=0; i<pages.length; i++) {
			h = pages[i].outerHeight();

			if((h / 2) - (wH / 2) + padding < 0) {
				if(ie10) {
					pages[i].css({
						marginTop: (wH/2) - padding
					});
				}
			} else {
				if (ie10) {
					pages[i].css({
						marginTop: h/2
					});
				} else {
					pages[i].css({
						marginTop: (h / 2) - (wH / 2) + padding
					});
				}
			}
		}
	},

	showPage = function() {
		currentPage = $('.site-page--active');
		var animationEndExecuted = false;

		if(!Modernizr.cssanimations) {
			onAnimationStart();
			nextPage.addClass('site-page--active');
			currentPage.removeClass('site-page--active');
			onAnimationEnd();
			return;
		}

		nextPage.add(currentPage).css({
			'animation-play-state': 'paused',
			'-webkit-animation-play-state': 'paused',
		});

		requestAnimationFrame(function() {
			onAnimationStart();
		});


		currentPage.on(_endEvent('AnimationEnd'), function(e) {
			e.stopPropagation();
			e.preventDefault();

			if(e.eventPhase > 2)
				return;

			currentPage.removeClass(classesToClear + ' site-page--active').css('margin-top', '');


			if(!animationEndExecuted) {
				animationEndExecuted = true;
			} else {
				onAnimationEnd();
			}
		});
		nextPage.on(_endEvent('AnimationEnd'), function(e) {
			e.stopPropagation();
			e.preventDefault();

			if(e.eventPhase > 2)
				return;

			nextPage.addClass('site-page--active').css('margin-top', '').removeClass(classesToClear);

			if(nextPage.hasClass('site-front')) {
				nextPage.removeClass('site-page--went-right site-page--went-left');
			}

			if(!animationEndExecuted) {
				animationEndExecuted = true;
			} else {
				onAnimationEnd();
			}
		});



		accountForScroll();

		var centerFrontPageRAF;
		var centerFrontPage = function() {
			var h = currentPage.outerHeight();
			var wH = window.innerHeight;
			var scroll = $(window).scrollTop();
			var offset = ((wH - h) / 2) + h/2 + scroll;
			var padding = parseInt(wrapper.css('padding-top').replace('px'));

			if(offset < (h/2) + padding) {
				offset = (h/2) + padding;
			}

			cancelAnimationFrame(centerFrontPageRAF);

			centerFrontPageRAF = requestAnimationFrame(function() {
				currentPage.css({ top: offset + 'px' });

				wrapper.css({ 'perspective-origin': '50%' + offset + 'px', '-webkit-perspective-origin': '50%' + offset + 'px' });
			});

		};

		$(window).on('resize.centerFrontPage, scroll.centerFrontPage', centerFrontPage);

		requestAnimationFrame(function() {
			if(nextPage.hasClass('site-front')) {
				currentPage.addClass('site-page--reset');
				nextPage.addClass('site-page--reset');

				$(window).off('resize.centerFrontPage, scroll.centerFrontPage');
				nextPage.css('top', '');
				wrapper.css({ 'perspective-origin': '', '-webkit-perspective-origin': '' })
			} else if(nextPage.hasClass('site-page--from-left')) {
				currentPage.addClass('site-page--go-right site-page--went-right');
				centerFrontPage();
				nextPage.addClass('site-page--come-right');
			} else if(nextPage.hasClass('site-page--from-right')) {
				currentPage.addClass('site-page--go-left site-page--went-left');
				centerFrontPage();
				nextPage.addClass('site-page--come-left');
			}
		});


		requestAnimationFrame(function() {
			nextPage.add(currentPage).css({
				'animation-play-state': '',
				'-webkit-animation-play-state': '',
			});
		});
	},

	onAnimationStart = function() {
			wrapper.css({
				'webkit-transform': '',
				'transform': '',
				'-webkit-perspective': '1500px',
				'perspective': '1500px',
			}).data('disableNav', 1);

			var navClose = $('.nav-close');

			$('body, html').css("overflow", "hidden");

			$('.nav-hidden').off(_endEvent('TransitionEnd'));
			$('.nav-left:not(.nav-hidden), .nav-right:not(.nav-hidden)').one(_endEvent('TransitionEnd'), function(e) {
				e.stopPropagation();
				e.preventDefault();

				$(this).css('visibility', 'hidden');
			});


			if(currentPage.hasClass('site-front')) {
				requestAnimationFrame(function() {
					navClose.hide().css('-webkit-transition', 'none').removeClass('nav-left nav-right').addClass('nav-hidden');

					if(nextPage.hasClass('site-page--from-left')) {
						navClose.addClass('nav-left');
					} else {
						navClose.addClass('nav-right');
					}
				});

				requestAnimationFrame(function() {
					navClose.show().css('visibility', 'visible');
				});

				setTimeout(function() {
					requestAnimationFrame(function() {
						$('.nav-left:not(.nav-close), .nav-right:not(.nav-close)').addClass('nav-hidden');

						setTimeout(function() {
							requestAnimationFrame(function() {
								navClose.one(_endEvent('TransitionEnd'), function(e) {
									e.stopPropagation();
									e.preventDefault();

									if(e.eventPhase > 2)
										return;

									navClose.data('disableNav', 0);
								}).css('-webkit-transition', '').removeClass('nav-hidden');

								if(!Modernizr.csstransitions) {
									navClose.data('disableNav', 0);
								}
							});
						}, 300);
					});
				}, 10);
			} else {
				$('.nav-left, .nav-right').show().css('visibility', 'visible');

				setTimeout(function() {
					requestAnimationFrame(function() {
						var navs = $('.nav-hidden');
						navClose.addClass('nav-hidden');

						setTimeout(function() {
							requestAnimationFrame(function() {

								navs.one(_endEvent('TransitionEnd'), function(e) {
									e.stopPropagation();
									e.preventDefault();

									if(e.eventPhase > 2)
										return;

									navs.data('disableNav', 0);
								}).removeClass('nav-hidden');

								if(!Modernizr.csstransitions) {
									navs.data('disableNav', 0);
								}
							});
						}, 300);
					});
				}, 10);
			}
	},

	onAnimationEnd = function() {
		$('body, html').css("overflow", "");

		var frontPageScroller;
		$(window).on('scroll', function() {
			var page = $('site-page--went-left, .site-page--went-right');
			if(!page.length) {
				return;
			}


		});

		wrapper.data('disableNav', 0);

		if(nextPage.hasClass('site-front')) {
			wrapper.css({
				'webkit-transform': 'translate(0,0)',
				'transform': 'translate(0,0)',
				'-webkit-perspective': 'none',
				'perspective': 'none',
			});
		}

		// if(Modernizr.csstransformspreserve3d) {
		// 	wrapper.css({
		// 		'-webkit-perspective': 'none',
		// 		'perspective': 'none',
		// 	});
		// }

		nextPage.add(currentPage).off(_endEvent('AnimationEnd'));

		setTimeout(function() {
			fitIcons();
		}, 100);
	};


	$('.nav-left, .nav-right').css('visibility', 'visible');


	$('.site-page__trigger').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var el = $(this);

		if(wrapper.data('disableNav') || el.data('disableNav'))
			return false;

		$('.site-page__trigger .site-page__close').data('disableNav', 1);

		nextPage = $(el.attr('href'));

		if(nextPage.length == 0)
			return;

		if($(document).scrollTop() > 1) {
			$('body').animate({
				scrollTop: 0
			}, 'fast', function() {
				setTimeout(function() {
					showPage();
				}, 10);
			});
		} else {
			showPage();
		}


		$('.site-front').on('click.backToFrontPage', function(e) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			if(wrapper.data('disableNav'))
				return false;

			$('.site-page__close').trigger('click');
		});
	});

	$('.site-page__close').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();

		if(wrapper.data('disableNav') || $(this).data('disableNav'))
			return false;

		$('.site-page__trigger .site-page__close').data('disableNav', 1);

		$('.site-front').off('click.backToFrontPage');

		//$('.site-page__trigger').removeClass('disableNav');

		nextPage = $('.site-front');

		if(nextPage.length == 0)
			return;

		if($(document).scrollTop() > 1) {
			$('body').animate({
				scrollTop: 0
			}, 'fast', function() {
				setTimeout(function() {
					showPage();
				}, 10);
			});
		} else {
			showPage();
		}
	});

}())