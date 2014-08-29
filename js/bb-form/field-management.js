define(function defCreateField(require, exports, module) {

	var $ = require('jquery'),
		_ = require('lodash');

	// private functions
	/**
	 * Creates a single field.
	 *
	 * @param  {[type]} fieldOptions [description]
	 * @return {[type]}              [description]
	 */
	function _createField(fieldOptions) {

		// [0] check for required arguments
		if (!fieldOptions.type) {
			throw new Error('[bb-form | createField] Type is required as a field option.');
		}

		// [1] create a fieldElementWrapper DOM element
		var html = _.isFunction(this.fieldElementWrapper) ?
			this.fieldElementWrapper(fieldOptions) : this.fieldElementWrapper;

		var $fieldElementWrapper = $(html).appendTo(this.$container);

		// [2] retrieve view constructor
		var constructor = this.fieldConstructors[fieldOptions.type];

		// [3] set field options
		fieldOptions.formView = this;
		fieldOptions.model    = this.model;
		fieldOptions.el       = $fieldElementWrapper;

		// [4] instantiate and store
		var instance = constructor(fieldOptions);
		this.fieldViews.push(instance);


		//

		return instance;
	}


	exports.fieldConstructors = {
		text    : require('bb-form/fields/text'),
		textarea: require('bb-form/fields/textarea'),
		select  : require('bb-form/fields/select'),
	};


	exports.fieldElementWrapper = '<div></div>';

	/**
	 * Creates form fields.
	 *
	 * @param  {[type]} fields [description]
	 * @return {[type]}        [description]
	 */
	exports.createField = function createField(fields) {

		if (_.isArray(fields)) {
			// multiple fields
			return _.map(fields, _createField, this);

		} else {
			// single
			return _createField.call(this, fields);
		}
	};


	exports.removeField = function removeField(fieldView) {

		// [1] get the view cid
		var cid = _.isObject(fieldView) ? fieldView.cid : fieldView;

		var index = _.indexOf(this.fieldViews, function (fv) {
			return fv.cid === cid;
		});

		if (!_.isUndefined(index)) {
			var toRemove = this.fieldViews.splice(index, 1);
			toRemove[0].remove();
		}

		return this;
	};
});
