/**
 * AMD module.
 *
 * @module BbForm
 */

define(function (require, exports, module) {
	'use strict';

	var bbcv = require('bbcv'),
		bbmv = require('bbmv');

	var bbForm = module.exports = bbcv.extend({

		initialize: function initializeBbForm(options) {


			// create a model view instance
			this.bbmvInstance = bbmv({
				el   : this.$el,
				model: options.model
			});

			// initialize bbcv
			// AFTER
			bbcv.prototype.initialize.call(this, options);

			// save reference to the model represented by the form
			this.model = options.model || this.model;
		},
	});


	bbForm.assignProto(require('bb-form/fields'));


});
