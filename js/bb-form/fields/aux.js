define(function defBbFormAux(require, exports, module) {


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
