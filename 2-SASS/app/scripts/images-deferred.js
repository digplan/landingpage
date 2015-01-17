// Delayed image load

+$(window).load(function() {
	$('img[data-src]').each(function() {
		var img = $(this);

		img.attr('src', img.data('src'));
	});
});