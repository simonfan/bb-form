/**
 * AMD module.
 *
 * @module BbForm
 */

define(function (require, exports, module) {
	'use strict';

	var bbmv = require('bbmv');


	var bbForm = bbmv.extend({

		initialize: function initializeBbForm(options) {
			bbmv.prototype.initialize.call(this, options);

			// pick some options
			_.each(['containerSelector'], function (opt) {
				this[opt] = options[opt] || this[opt];
			}, this);

			// find $container element (defaults to the $el itself)
			this.$container = this.containerSelector ?
				this.$el.find(this.containerSelector) : this.$el;

			// array onto which field views are stored
			this.fieldViews = [];

			// instantiate fields
			if (options.fields) {
				this.createField(options.fields);
			}
		},
	});

	bbForm.assignProto(require('bb-form/field-management'));

	// assign static methods
	bbForm.assignStatic({
		fieldConstructor: function fieldConstructor(type, constructor) {

		},

		extendFieldDefinitions: function extendFieldDefinitions(fieldDefinitions) {

		},
	});

	module.exports = bbForm;
});
