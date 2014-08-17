define(function defTextInputView(require, exports, module) {


	var _ = require('lodash');

	module.exports = require('bb-form/fields/text').extend({
		template: _.template(require('text!bb-form/fields/html/textarea.html')),
	});

});
