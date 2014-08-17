define(function defTextInputView(require, exports, module) {


	var _ = require('lodash');

	module.exports = require('bb-form/fields/base/incorporated').extend({

		template: _.template(require('text!bb-form/fields/html/text.html')),
	});

});
