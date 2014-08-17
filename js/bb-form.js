/**
 * AMD module.
 *
 * @module BbForm
 */

define(function (require, exports, module) {
	'use strict';

	var bbcv = require('bbcv'),
		bbmv = require('bbmv');

	var bbForm = bbcv.extend({

		initialize: function initializeBbForm(options) {
			// create a model view instance
			this.bbmvInstance = bbmv({
				el   : this.$el,
				model: options.model
			});

			// initialize bbcv
			// AFTER
			bbcv.prototype.initialize.call(this, options);
		},

	});

	// assign field extensions to the form view.
	bbForm.assignProto(require('bb-form/fields'));


	// assign static methods
	bbForm.assignStatic({
		defineFields: function defineFields(fieldDefinitions) {

		},

		extendFields: function extendFields(fieldDefinitions) {

		},
	});

	module.exports = bbForm;
});
