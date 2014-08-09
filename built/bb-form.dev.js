define('bb-form/aux',['require','exports','module'],function defBbFormAux(require, exports, module) {


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

/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!bb-form/field-htmls/text.html',[],function () { return '<div>\n\t<input type="text" data-bind-<%- attribute %>="value">\n\n\t<div data-validation-message></div>\n</div>\n';});

define('bb-form/field-views/base',['require','exports','module','lowercase-backbone','lodash'],function defBaseFieldView(require, exports, module) {


	var view = require('lowercase-backbone').view,
		_    = require('lodash');

	// keep direct reference to the initialization.
	var _initialize = view.prototype.initialize;

	module.exports = view.extend({

		initialize: function initializeTextView(options) {
			_initialize.call(this, options);

			// save reference to the formView
			// and the formModel
			this.formView  = options.formView;
			this.formModel = options.formModel;

			// get the attribute this input should represent.
			var attribute = this.model.get('attribute');

			// listen to changes.
			this.listenTo(this.formModel, 'change:' + attribute, this.handleValueChange);

		},

		/**
		 * Handles changes on the value of the input.
		 * @return {[type]} [description]
		 */
		handleValueChange: function handleValueChange() {

			var fieldModel = this.model,
				attribute  = fieldModel.get('attribute'),
				value      = this.formModel.get(attribute);

				// run validation.
			var validationError = this.formView.validate(attribute, value, fieldModel);

			if (validationError) {
				this.handleValidationError(validationError);
			} else {
				this.handleValidationSuccess();
			}
		},

		handleValidationError: function handleValidationError(error) {
			this.$el.addClass('invalid');

			this.$el.find('[data-validation-message]').html(error.error);
		},

		handleValidationSuccess: function handleValidationSuccess() {
			this.$el.removeClass('invalid');
			this.$el.find('[data-validation-message]').html('');
		},

	});
});


define('text!bb-form/field-htmls/textarea.html',[],function () { return '<div>\n\t<textarea data-bind-<%- attribute %>="value"></textarea>\n</div>\n';});

define('bb-form/field-views/text',['require','exports','module','lowercase-backbone','lodash'],function defTextInputView(require, exports, module) {


	var view = require('lowercase-backbone').view,
		_    = require('lodash');

	// keep direct reference to the initialization.
	var _initialize = view.prototype.initialize;

	module.exports = view.extend({

		initialize: function initializeTextView(options) {
			_initialize.call(this, options);

			// save reference to the formView
			// and the formModel
			this.formView  = options.formView;
			this.formModel = options.formModel;

			// get the attribute this input should represent.
			var attribute = this.model.get('attribute');

			// listen to changes.
			this.listenTo(this.formModel, 'change:' + attribute, this.handleValueChange);

		},

		/**
		 * Handles changes on the value of the input.
		 * @return {[type]} [description]
		 */
		handleValueChange: function handleValueChange() {

			var inputModel = this.model,
				attribute  = inputModel.get('attribute'),
				value      = this.formModel.get(attribute);

				// run validation.
			var valid = this.formView.validate(attribute, value, inputModel);

			if (!valid) {

				this.$el.addClass('invalid');

			} else {
				this.$el.removeClass('invalid');
			}
		},

	});
});


define('text!bb-form/field-htmls/select.html',[],function () { return '<div>\n\t<select data-bind-<%- attribute %>="val" data-binding-event="change">\n\t\t<% _.forEach(options, function(opt) { %>\n\t\t\t<option value="<%- opt.value %>">\n\t\t\t\t<%- opt.label %>\n\t\t\t</option>\n\t\t<% }); %>\n\t</select>\n</div>\n';});


define('text!bb-form/field-htmls/file.html',[],function () { return '<div>\n\t<input type="file">\n\n\t<input type="hidden" data-bind-<%- attribute %>="value">\n</div>\n';});

define('bb-form/field-views/file',['require','exports','module'],function defFileInputView(require, exports, module) {

});

define('bb-form/fields',['require','exports','module','jquery','lodash','lowercase-backbone','bb-form/aux','text!bb-form/field-htmls/text.html','bb-form/field-views/base','text!bb-form/field-htmls/textarea.html','bb-form/field-views/text','text!bb-form/field-htmls/select.html','text!bb-form/field-htmls/file.html','bb-form/field-views/file'],function defRetrieveInputTemplate(require, exports, module) {

	var $        = require('jquery'),
		_        = require('lodash'),
		backbone = require('lowercase-backbone');

	var aux = require('bb-form/aux');

	/**
	 * Hash on which fields are defined.
	 * @type {Object}
	 */
	exports.fields = {
		text: {
			template: _.template(require('text!bb-form/field-htmls/text.html')),
			view    : require('bb-form/field-views/base'),
		},

		textarea: {
			template: _.template(require('text!bb-form/field-htmls/textarea.html')),
			view    : require('bb-form/field-views/text')
		},

		select: {
			template: _.template(require('text!bb-form/field-htmls/select.html')),
		},


		file: {
			template: _.template(require('text!bb-form/field-htmls/file.html')),
			view    : require('bb-form/field-views/file')
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
				inputConfig = this.fields[type];

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
	exports.modelView = function inputView(options) {

		var fieldModel = options.model,
			el         = options.el;


		// incorporate the $el
		this.bbmvInstance.incorporate(el);

		// set mainModel onto the options
		options.formView  = this;
		options.formModel = this.model;

		// attrieve to get the specific view for the model's type
		// defaults to backbone.view.
		var inputView = fieldModel.get('view') ||
			this.fields[fieldModel.get('type')].view ||
			backbone.view;

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
		}
	};



});

/**
 * AMD module.
 *
 * @module BbForm
 */

define('bb-form',['require','exports','module','bbcv','bbmv','bb-form/fields'],function (require, exports, module) {
	

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

