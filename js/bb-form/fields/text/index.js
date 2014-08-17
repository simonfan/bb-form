define(function defTextInputView(require, exports, module) {


	var _    = require('lodash'),
		view = require('lowercase-backbone').view,
		tpl  = _.template(require('text!bb-form/fields/text/index.html'));

	module.exports = view.extend({

		initialize: function initializeTextInput(options) {
			view.prototype.initialize.call(this, options);

			// invoke rendering.
			this.render();
		},

		render: function renderTextInputHtml() {

			this.$el.html(tpl(this.fieldModel.toJSON()));

			return this;
		}
	});

});
