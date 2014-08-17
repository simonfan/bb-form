define(function defValidatedFieldView(require, exports, module) {


	var view = require('lowercase-backbone').view,
		_    = require('lodash');

	// keep direct reference to the initialization.
	var _initialize = view.prototype.initialize;

	// private!
	function _handleModelChange() {
		if (this.model.isValid()) {
			this.handleModelValid();
		}
	}

	function _handleModelInvalid(model, error) {
		if (_.contains(this.fieldAttributes, error.attribute)) {
			this.handleModelInvalid(error);
		}
	}


	module.exports = view.extend({

		initialize: function initializeBaseFieldView(options) {
			_initialize.call(this, options);

			// save reference to the formView
			this.formView  = options.formView;

			// save reference to the attributes this field represents
			this.fieldAttributes = options.attributes ? options.attributes : [options.attribute];

			// if no fieldAttributes were defined, throw error
			if (this.fieldAttributes.length === 0) {
				throw new Error('[bb-form/fields/base | attribute or attributes must be defined.');
			}

			// listen to 'invalid' events on the model
			this.listenTo(this.model, 'invalid', _handleModelInvalid);

			// listen to changes on attributes
			var changeEvents = _.reduce(this.fieldAttributes, function (evtStr, attr) {
				return evtStr + 'change:' + attr + ' ';
			}, '');
			this.listenTo(this.model, changeEvents, _handleModelChange);

		},

		handleModelInvalid: function handleModelInvalid(error) {
			this.$el.addClass('invalid');
			this.$el.find('[data-bb-form-message]').show().html(error.error);
		},

		handleModelValid: function handleModelValid() {
			this.$el.removeClass('invalid');
			this.$el.find('[data-bb-form-message]').hide().html('');
		},

	});
});
