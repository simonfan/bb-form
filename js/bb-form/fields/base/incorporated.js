define(function defIncorporatedFieldView(require, exports, module) {

	var renderedFieldView = require('bb-form/fields/base/rendered');

	module.exports = renderedFieldView.extend({

		initialize: function initializeTextInput(options) {
			renderedFieldView.prototype.initialize.call(this, options);

			// let the form view incorporate the final field $el
			this.formView.incorporate(this.$el);
		},
	});

});
