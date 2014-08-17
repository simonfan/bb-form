define(function defRetrieveInputTemplate(require, exports, module) {

	var $             = require('jquery'),
		_             = require('lodash'),
		baseFieldView = require('bb-form/fields/base');

	var aux = require('bb-form/aux');

	/**
	 * Hash on which fields are defined.
	 * @type {Object}
	 */
	exports.fieldDefinitions = {
		text: {
			template: _.template(require('text!bb-form/fields/html/text.html')),
			view    : require('bb-form/fields/text'),
		},

		textarea: {
			template: _.template(require('text!bb-form/fields/html/textarea.html')),
			view    : require('bb-form/fields/text')
		},

		select: {
			template: _.template(require('text!bb-form/fields/html/select.html')),
		},

		file: {
			template: _.template(require('text!bb-form/fields/html/file.html')),
			view    : require('bb-form/fields/file')
		}

	};

	/**
	 * Retrieves the input model's html
	 * based on the type.
	 *
	 * @param  {[type]} fieldModel [description]
	 * @return {[type]}            [description]
	 */
	exports.modelHtml = function fieldModelHtml(fieldModel) {

		var html = fieldModel.get('html');

		// if no html string was defined,
		// attempt to get template based on type.
		if (!html) {

			var type        = fieldModel.get('type'),
				inputConfig = this.fieldDefinitions[type];

			if (!inputConfig) {
				throw new Error('No input configuration found for "' + type + '".');
			}

			var template = inputConfig.template;


			// parse out the attributes hash
			var fieldModelAttributes = fieldModel.toJSON();

			// convert the 'attribute' from camel case to dashed
			// in order to let the data attributes be valid
			// (see ATTENTION below)
			fieldModelAttributes.attribute = aux.camelCaseToDashed(fieldModelAttributes.attribute);

			// assume the template is already a function and pass it
			// the fieldModel's attributes
			html = template(fieldModelAttributes);

			/** ATTENTION
			A custom data attribute is an attribute in no namespace whose name
			starts with the string "data-", has at least one character after the hyphen,
			is XML-compatible, and contains no characters in the range U+0041 to U+005A
			(LATIN CAPITAL LETTER A to LATIN CAPITAL LETTER Z).

			Note that it also restricts the usage to lower case, however another note applies:

			All attributes on HTML elements in HTML documents get ASCII-lowercased automatically,
			so the restriction on ASCII uppercase letters doesn't affect such documents
			**/
		}

		// return html.
		return html;
	};


	/**
	 * Override modelView for bbcv.
	 *
	 * @param  {[type]} model [description]
	 * @return {[type]}       [description]
	 */
	exports.modelView = function retrieveInputView(options) {

		var fieldModel = options.model,
			el         = options.el;


		// incorporate the $el
		this.bbmvInstance.incorporate(el);

		// set mainModel onto the options
		options.formView  = this;
		options.formModel = this.model;

		// attrieve to get the specific view for the model's type
		// defaults to backbone.view.
		var inputView = fieldModel.get('view')                 ||
			this.fieldDefinitions[fieldModel.get('type')].view ||
			baseFieldView;

		// return the instance of the inputView.
		return inputView(options);
	};

	/**
	 * Validates an attribute.
	 *
	 * @param  {[type]} attribute  [description]
	 * @param  {[type]} value      [description]
	 * @param  {[type]} fieldModel [description]
	 * @return {[type]}            [description]
	 */
	exports.validate = function validate(attribute, value, fieldModel) {

		var validators = this.validators;

		if (validators[attribute]) {
			return validators[attribute].call(this, attribute, value, fieldModel);
		} else if (validators[fieldModel.get('type')]) {
			return validators[fieldModel.get('type')].call(this, attribute, value, fieldModel);
		} else {

			// return false if no validators are found.
			return false;
		}

	};

	/**
	 * Hash on which validators are defined.
	 * Keyed by either
	 * attribute name
	 * or input type.
	 *
	 * @type {Object}
	 */
	exports.validators = {
		text: function validateTextTypeField(attribute, value, fieldModel) {

			if (value === '') {
				return {
					error: 'Value for field ' + attribute + ' is empty.'
				}
			}
		},
	};

	exports.validators.select = exports.validators.text;



});
