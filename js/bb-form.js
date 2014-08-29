/**
 * AMD module.
 *
 * @module BbForm
 */

define(function (require, exports, module) {
	'use strict';

	var bbmv = require('bbmv'),
		_    = require('lodash');


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

		/**
		 * Defines extra field constructor
		 *
		 * @param  {[type]} type        [description]
		 * @param  {[type]} constructor [description]
		 * @return {[type]}             [description]
		 */
		fieldConstructor: function fieldConstructor() {

			if (_.isObject(arguments[0])) {
				// multiple
				// arguments = [{ type: constructor }]
				_.assign(this.fieldConstructors, arguments[0]);
			} else {
				// single
				// arguments = [type, constructor]
				//
				this.fieldConstructors[arguments[0]] = arguments[1];
			}

			return this;
		},


		/**
		 * Extends the field definitions AND the factory itself
		 *
		 * @param  {[type]} fieldConstructors [description]
		 * @return {[type]}                  [description]
		 */
		extendFieldConstructors: function extendFieldConstructors(fieldConstructors) {

			var newFieldConstructors = _.create(this.fieldConstructors);

			_.assign(newFieldConstructors, fieldConstructors);

			return this.extend({
				fieldConstructors: newFieldConstructors
			});
		},
	});

	module.exports = bbForm;
});
