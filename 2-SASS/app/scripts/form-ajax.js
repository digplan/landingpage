+(function () { "use strict";

	$("form.form-ajax").each(function() {
		$(this).validate({
			submitHandler: function(form, e) {
				e.preventDefault();

				form = $(form);

				form.removeClass('form--failed form--success').addClass('form--submitted');

				form.find('[type="submit"]').attr('disabled', 'disabled');

				$.post(form.prop('action'), form.serialize(), function(data, e) {
					form.removeClass('form--submitted');

					if(data.toString().indexOf(form.data('success-response')) === -1) {
						form.addClass('form--failed');

						form.trigger('submitFailed');

						return false;
					}

					form.find('[type="submit"]').removeAttr('disabled');
					form.addClass('form--success');
					form.trigger('submitSucceeded');
					form[0].reset();
				}, 'text');

				return false;
			}
		});
	});
}());