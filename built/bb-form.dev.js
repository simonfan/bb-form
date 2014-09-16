define("bb-rendered-view",["require","exports","module","lowercase-backbone","lodash"],function(e,t,a){var i=e("lowercase-backbone").view,r=e("lodash"),l=i.prototype.initialize,s=i.extend({initialize:function(e){l.apply(this,r.toArray(arguments)),r.each(["template","templateCompiler","templateDataDefaults","templateDataParse","render"],function(t){this[t]=e[t]||this[t]},this),this.render(e)},templateCompiler:r.template,template:void 0,templateDataDefaults:{},templateDataParse:function(e){return r.assign({},this.templateDataDefaults,e)},render:function(e){var t,a=this.template;if(a){var i=this.templateDataParse(e);r.isFunction(a)?t=a(i):r.isString(a)&&(t=this.templateCompiler(a)(i)),this.$el.html(t)}return this}});a.exports=s});
define('bb-form/fields/base/validated',['require','exports','module','bb-rendered-view','lodash'],function defValidatedFieldView(require, exports, module) {


	var view = require('bb-rendered-view'),
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
			// var changeEvents = _.reduce(this.fieldAttributes, function (evtStr, attr) {
			// 	return evtStr + 'change:' + attr + ' ';
			// }, '');
			this.listenTo(this.model, 'change', _handleModelChange);

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

define('bb-form/fields/aux',['require','exports','module'],function defBbFormAux(require, exports, module) {


	/**
	 * Converts a camel cased string to a dashed one.
	 * Copied from:
	 * http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
	 *
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	exports.camelCaseToDashed = function camelCaseToDashed(str) {
		return str.replace(/([A-Z])/g, function (s) {return "-" + s.toLowerCase(); });
	};

});

define('bb-form/fields/base/incorporated',['require','exports','module','bb-form/fields/base/validated','bb-form/fields/aux'],function defIncorporatedFieldView(require, exports, module) {

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


define('text!bb-form/fields/html/text.html',[],function () { return '<b><%- attribute %></b><br>\n\n<input data-bb-form-attribute="<%- attribute %>" type="text" data-bind-<%- attribute %>="value">\n\n<div data-bb-form-message></div>\n';});

define('bb-form/fields/text',['require','exports','module','lodash','bb-form/fields/base/incorporated','text!bb-form/fields/html/text.html'],function defTextInputView(require, exports, module) {


	var _ = require('lodash');

	module.exports = require('bb-form/fields/base/incorporated').extend({

		template: _.template(require('text!bb-form/fields/html/text.html')),
	});

});


define('text!bb-form/fields/html/textarea.html',[],function () { return '<b><%- attribute %></b><br>\n<textarea data-bind-<%- attribute %>="value"></textarea>\n';});

define('bb-form/fields/textarea',['require','exports','module','lodash','bb-form/fields/text','text!bb-form/fields/html/textarea.html'],function defTextInputView(require, exports, module) {


	var _ = require('lodash');

	module.exports = require('bb-form/fields/text').extend({
		template: _.template(require('text!bb-form/fields/html/textarea.html')),
	});

});


define('text!bb-form/fields/html/select.html',[],function () { return '<div>\n\t<select data-bind-<%- attribute %>="val" data-binding-event="change">\n\n\t\t<option value="">NONE</option>\n\n\t\t<% _.forEach(options, function(opt) { %>\n\t\t\t<option value="<%- opt.value %>">\n\t\t\t\t<%- opt.label %>\n\t\t\t</option>\n\t\t<% }); %>\n\t</select>\n</div>\n';});

define('bb-form/fields/select',['require','exports','module','lodash','bb-form/fields/base/incorporated','text!bb-form/fields/html/select.html'],function defTextInputView(require, exports, module) {


	var _ = require('lodash');

	module.exports = require('bb-form/fields/base/incorporated').extend({
		template: _.template(require('text!bb-form/fields/html/select.html')),
	});

});

define('bb-form/field-management',['require','exports','module','jquery','lodash','bb-form/fields/text','bb-form/fields/textarea','bb-form/fields/select'],function defCreateField(require, exports, module) {

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

		// clone fieldOptions
		fieldOptions = _.clone(fieldOptions);

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

		if (!_.isFunction(constructor)) {
			throw new Error(fieldOptions.type + ' is not a field constructor function.');
		}

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

/**
 * AMD module.
 *
 * @module BbForm
 */

define('bb-form',['require','exports','module','bbmv','lodash','bb-form/field-management'],function (require, exports, module) {
	

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
			var newFieldConstructors = _.create(this.prototype.fieldConstructors);

			_.assign(newFieldConstructors, fieldConstructors);

			return this.extend({
				fieldConstructors: newFieldConstructors
			});
		},
	});

	module.exports = bbForm;
});

