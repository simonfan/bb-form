define(function defBaseFieldView(require, exports, module) {


	var view = require('lowercase-backbone').view,
		_    = require('lodash');

	// keep direct reference to the initialization.
	var _initialize = view.prototype.initialize;

	module.exports = view.extend({

		initialize: function initializeTextView(options) {
			_initialize.call(this, options);

			// save reference to the formView
			// and the formModel
			this.formView  = options.formView;
			this.formModel = options.formModel;

			// get the attribute this input should represent.
			var attribute = this.model.get('attribute');

			// listen to changes.
			this.listenTo(this.formModel, 'change:' + attribute, this.handleValueChange);

		},

		/**
		 * Handles changes on the value of the input.
		 * @return {[type]} [description]
		 */
		handleValueChange: function handleValueChange() {

			var fieldModel = this.model,
				attribute  = fieldModel.get('attribute'),
				value      = this.formModel.get(attribute);

				// run validation.
			var validationError = this.formView.validate(attribute, value, fieldModel);

			if (validationError) {
				this.handleValidationError(validationError);
			} else {
				this.handleValidationSuccess();
			}
		},

		handleValidationError: function handleValidationError(error) {
			this.$el.addClass('invalid');

			this.$el.find('[data-bb-form-message]').show().html(error.error);
		},

		handleValidationSuccess: function handleValidationSuccess() {
			this.$el.removeClass('invalid');
			this.$el.find('[data-bb-form-message]').hide().html('');
		},

	});
});
