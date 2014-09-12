define(function defIncorporatedFieldView(require, exports, module) {

	var baseView = require('bb-form/fields/base/validated'),
		aux      = require('bb-form/fields/aux');

	module.exports = baseView.extend({

		initialize: function initializeTextInput(options) {
			baseView.prototype.initialize.call(this, options);

			// let the form view incorporate the final field $el
			this.formView.incorporate(this.$el);
		},

		templateDataParse: function templateDataParse(data) {

			if (data.attribute) {
				data.attribute = aux.camelCaseToDashed(data.attribute);
			}

			if (data.attributes) {
				data.attributes = _.map(data.attributes, aux.camelCaseToDashed);
			}

			return data;
		},

	});

});
