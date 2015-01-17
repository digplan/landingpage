+(function () { "use strict";

	$('.form-flip').each(function() {
		var container = $(this);
		container.addClass('disableTransforms');

		container.children().on(_endEvent('AnimationEnd'), function(e) {
			e.preventDefault();
			e.stopPropagation();

			window.requestAnimationFrame(function() {
				container.removeClass('disableTransforms')//.addClass('disableTransforms');
			});
		});

		container.children('.form-flip__enabler').click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			container.removeClass('disableTransforms');
			container.addClass('form-flip--enabled');
		});

		container.children('.form-flip__close').click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			container.removeClass('disableTransforms');

			container.one(_endEvent('AnimationEnd'), function(e) {
				e.stopPropagation();
				container.hide();
			});

			container.addClass('form-flip--closed');

		});

		container.find('form').on('submitSucceeded', function() {
			container.removeClass('disableTransforms');
			container.addClass('form-flip--success');
		});
	});

}());