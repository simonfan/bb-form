define(function defRenderedFieldView(require, exports, module) {


	var _ = require('lodash');


	var validatedFieldView = require('bb-form/fields/base/validated'),
		aux                = require('bb-form/fields/aux');

	module.exports = validatedFieldView.extend({

		initialize: function initializeTextInput(options) {
			validatedFieldView.prototype.initialize.call(this, options);

			// invoke rendering.
			this.render(options);

			// let the form view incorporate the final field $el
			options.formView.incorporate(this.$el);
		},

		template: function fakeTpl() {
			return 'Replace with your field template.'
		},

		templateData: function templateData(data) {

			if (data.attribute) {
				data.attribute = aux.camelCaseToDashed(data.attribute);
			}

			if (data.attributes) {
				data.attributes = _.map(data.attributes, aux.camelCaseToDashed);
			}

			return data;
		},

		render: function renderTextInputHtml(data) {

			data = this.templateData(data);

			// set default data values before calling the
			// templating function

			this.$el.html(this.template(data));

			return this;
		}
	});

});
