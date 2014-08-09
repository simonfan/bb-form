define(['bb-form', 'backbone', 'jquery', 'bbmv', 'lodash'],
function (bbForm ,  Backbone ,  $      ,  bbmv ,  _      ) {


	///////////
	// model //
	///////////
	var person = window.model = new Backbone.Model({
		name: 'Rafael',
		lastName: 'Marquez'
	});



	/** ATTENTION
	http://stackoverflow.com/questions/9073960/html5-data-attribute-rules

	A custom data attribute is an attribute in no namespace whose name
	starts with the string "data-", has at least one character after the hyphen,
	is XML-compatible, and contains no characters in the range U+0041 to U+005A
	(LATIN CAPITAL LETTER A to LATIN CAPITAL LETTER Z).

	Note that it also restricts the usage to lower case, however another note applies:

	All attributes on HTML elements in HTML documents get ASCII-lowercased automatically,
	so the restriction on ASCII uppercase letters doesn't affect such documents
	**/

	var inputs = new Backbone.Collection([
		{ type: 'text', attribute: 'name' },
	]);

	///////////////
	// form view //
	///////////////
	var form = window.form = bbForm({
		el        : $('#form'),
		collection: inputs,
		model     : person,
	});

	inputs.add([
		{ type: 'text', attribute: 'lastName' },
		{ type: 'select', attribute: 'name', options: [{ label: 'Ana', value: 'Ana' }, { label: 'Rafa', value: 'Rafael'}]}
	]);

	inputs.remove(inputs.first());


	//////////////////
	// display view //
	//////////////////
	var display = bbmv({
		el: $('#display'),
		model: person
	});

	///////////////////////
	// form builder view //
	///////////////////////
	var formBuilder = bbmv.extend({
		addField: function () {

			var model = this.model;


			// parse out options
			var options = model.get('options') ? model.get('options').split(/\s*,\s*/) : [];

			options = _.map(options, function (optStr, index) {

				var option = {},
					split  = optStr.split(/\s*:\s*/);

				if (split.length === 1) {

					// option label and value are the same.
					option.label = split[0];
					option.value = split[0];

				} else {
					option.label = split[0];
					option.value = split[1];
				}

				return option;

			});

			inputs.add({
				type     : model.get('type'),
				attribute: model.get('attribute'),
				options  : options
			});

			// clear
			model.clear();
		}
	})({
		el: $('#form-builder'),
		model: new Backbone.Model()
	});
});
