/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

define("bb-form/aux",["require","exports","module"],function(e,t){t.camelCaseToDashed=function(e){return e.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase()})}}),define("text",["module"],function(e){var t,i,n,r,o,a=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],l=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,s=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,d="undefined"!=typeof location&&location.href,f=d&&location.protocol&&location.protocol.replace(/\:/,""),u=d&&location.hostname,m=d&&(location.port||void 0),c={},h=e.config&&e.config()||{};return t={version:"2.0.12",strip:function(e){if(e){e=e.replace(l,"");var t=e.match(s);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:h.createXhr||function(){var e,t,i;if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject)for(t=0;3>t;t+=1){i=a[t];try{e=new ActiveXObject(i)}catch(n){}if(e){a=[i];break}}return e},parseName:function(e){var t,i,n,r=!1,o=e.indexOf("."),a=0===e.indexOf("./")||0===e.indexOf("../");return-1!==o&&(!a||o>1)?(t=e.substring(0,o),i=e.substring(o+1,e.length)):t=e,n=i||t,o=n.indexOf("!"),-1!==o&&(r="strip"===n.substring(o+1),n=n.substring(0,o),i?i=n:t=n),{moduleName:t,ext:i,strip:r}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,i,n,r){var o,a,l,s=t.xdRegExp.exec(e);return s?(o=s[2],a=s[3],a=a.split(":"),l=a[1],a=a[0],!(o&&o!==i||a&&a.toLowerCase()!==n.toLowerCase()||(l||a)&&l!==r)):!0},finishLoad:function(e,i,n,r){n=i?t.strip(n):n,h.isBuild&&(c[e]=n),r(n)},load:function(e,i,n,r){if(r&&r.isBuild&&!r.inlineText)return void n();h.isBuild=r&&r.isBuild;var o=t.parseName(e),a=o.moduleName+(o.ext?"."+o.ext:""),l=i.toUrl(a),s=h.useXhr||t.useXhr;return 0===l.indexOf("empty:")?void n():void(!d||s(l,f,u,m)?t.get(l,function(i){t.finishLoad(e,o.strip,i,n)},function(e){n.error&&n.error(e)}):i([a],function(e){t.finishLoad(o.moduleName+"."+o.ext,o.strip,e,n)}))},write:function(e,i,n){if(c.hasOwnProperty(i)){var r=t.jsEscape(c[i]);n.asModule(e+"!"+i,"define(function () { return '"+r+"';});\n")}},writeFile:function(e,i,n,r,o){var a=t.parseName(i),l=a.ext?"."+a.ext:"",s=a.moduleName+l,d=n.toUrl(a.moduleName+l)+".js";t.load(s,n,function(){var i=function(e){return r(d,e)};i.asModule=function(e,t){return r.asModule(e,d,t)},t.write(e,s,i,o)},o)}},"node"===h.env||!h.env&&"undefined"!=typeof process&&process.versions&&process.versions.node&&!process.versions["node-webkit"]?(i=require.nodeRequire("fs"),t.get=function(e,t,n){try{var r=i.readFileSync(e,"utf8");0===r.indexOf("﻿")&&(r=r.substring(1)),t(r)}catch(o){n&&n(o)}}):"xhr"===h.env||!h.env&&t.createXhr()?t.get=function(e,i,n,r){var o,a=t.createXhr();if(a.open("GET",e,!0),r)for(o in r)r.hasOwnProperty(o)&&a.setRequestHeader(o.toLowerCase(),r[o]);h.onXhr&&h.onXhr(a,e),a.onreadystatechange=function(){var t,r;4===a.readyState&&(t=a.status||0,t>399&&600>t?(r=new Error(e+" HTTP status: "+t),r.xhr=a,n&&n(r)):i(a.responseText),h.onXhrComplete&&h.onXhrComplete(a,e))},a.send(null)}:"rhino"===h.env||!h.env&&"undefined"!=typeof Packages&&"undefined"!=typeof java?t.get=function(e,t){var i,n,r="utf-8",o=new java.io.File(e),a=java.lang.System.getProperty("line.separator"),l=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(o),r)),s="";try{for(i=new java.lang.StringBuffer,n=l.readLine(),n&&n.length()&&65279===n.charAt(0)&&(n=n.substring(1)),null!==n&&i.append(n);null!==(n=l.readLine());)i.append(a),i.append(n);s=String(i.toString())}finally{l.close()}t(s)}:("xpconnect"===h.env||!h.env&&"undefined"!=typeof Components&&Components.classes&&Components.interfaces)&&(n=Components.classes,r=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),o="@mozilla.org/windows-registry-key;1"in n,t.get=function(e,t){var i,a,l,s={};o&&(e=e.replace(/\//g,"\\")),l=new FileUtils.File(e);try{i=n["@mozilla.org/network/file-input-stream;1"].createInstance(r.nsIFileInputStream),i.init(l,1,0,!1),a=n["@mozilla.org/intl/converter-input-stream;1"].createInstance(r.nsIConverterInputStream),a.init(i,"utf-8",i.available(),r.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),a.readString(i.available(),s),a.close(),i.close(),t(s.value)}catch(d){throw new Error((l&&l.path||"")+": "+d)}}),t}),define("text!bb-form/field-htmls/text.html",[],function(){return'<div>\n	<input type="text" data-bind-<%- attribute %>="value">\n\n	<div data-validation-message></div>\n</div>\n'}),define("bb-form/field-views/base",["require","exports","module","lowercase-backbone","lodash"],function(e,t,i){var n=e("lowercase-backbone").view,r=(e("lodash"),n.prototype.initialize);i.exports=n.extend({initialize:function(e){r.call(this,e),this.formView=e.formView,this.formModel=e.formModel;var t=this.model.get("attribute");this.listenTo(this.formModel,"change:"+t,this.handleValueChange)},handleValueChange:function(){var e=this.model,t=e.get("attribute"),i=this.formModel.get(t),n=this.formView.validate(t,i,e);n?this.handleValidationError(n):this.handleValidationSuccess()},handleValidationError:function(e){this.$el.addClass("invalid"),this.$el.find("[data-validation-message]").html(e.error)},handleValidationSuccess:function(){this.$el.removeClass("invalid"),this.$el.find("[data-validation-message]").html("")}})}),define("text!bb-form/field-htmls/textarea.html",[],function(){return'<div>\n	<textarea data-bind-<%- attribute %>="value"></textarea>\n</div>\n'}),define("bb-form/field-views/text",["require","exports","module","lowercase-backbone","lodash"],function(e,t,i){var n=e("lowercase-backbone").view,r=(e("lodash"),n.prototype.initialize);i.exports=n.extend({initialize:function(e){r.call(this,e),this.formView=e.formView,this.formModel=e.formModel;var t=this.model.get("attribute");this.listenTo(this.formModel,"change:"+t,this.handleValueChange)},handleValueChange:function(){var e=this.model,t=e.get("attribute"),i=this.formModel.get(t),n=this.formView.validate(t,i,e);n?this.$el.removeClass("invalid"):this.$el.addClass("invalid")}})}),define("text!bb-form/field-htmls/select.html",[],function(){return'<div>\n	<select data-bind-<%- attribute %>="val" data-binding-event="change">\n		<% _.forEach(options, function(opt) { %>\n			<option value="<%- opt.value %>">\n				<%- opt.label %>\n			</option>\n		<% }); %>\n	</select>\n</div>\n'}),define("text!bb-form/field-htmls/file.html",[],function(){return'<div>\n	<input type="file">\n\n	<input type="hidden" data-bind-<%- attribute %>="value">\n</div>\n'}),define("bb-form/field-views/file",["require","exports","module"],function(){}),define("bb-form/fields",["require","exports","module","jquery","lodash","lowercase-backbone","bb-form/aux","text!bb-form/field-htmls/text.html","bb-form/field-views/base","text!bb-form/field-htmls/textarea.html","bb-form/field-views/text","text!bb-form/field-htmls/select.html","text!bb-form/field-htmls/file.html","bb-form/field-views/file"],function(e,t){var i=(e("jquery"),e("lodash")),n=e("lowercase-backbone"),r=e("bb-form/aux");t.fields={text:{template:i.template(e("text!bb-form/field-htmls/text.html")),view:e("bb-form/field-views/base")},textarea:{template:i.template(e("text!bb-form/field-htmls/textarea.html")),view:e("bb-form/field-views/text")},select:{template:i.template(e("text!bb-form/field-htmls/select.html"))},file:{template:i.template(e("text!bb-form/field-htmls/file.html")),view:e("bb-form/field-views/file")}},t.modelHtml=function(e){var t=e.get("html");if(!t){var i=e.get("type"),n=this.fields[i];if(!n)throw new Error('No input configuration found for "'+i+'".');var o=n.template,a=e.toJSON();a.attribute=r.camelCaseToDashed(a.attribute),t=o(a)}return t},t.modelView=function o(e){var t=e.model,i=e.el;this.bbmvInstance.incorporate(i),e.formView=this,e.formModel=this.model;var o=t.get("view")||this.fields[t.get("type")].view||n.view;return o(e)},t.validate=function(e,t,i){var n=this.validators;return n[e]?n[e].call(this,e,t,i):n[i.get("type")]?n[i.get("type")].call(this,e,t,i):!1},t.validators={text:function(e,t){return""===t?{error:"Value for field "+e+" is empty."}:void 0}}}),define("bb-form",["require","exports","module","bbcv","bbmv","bb-form/fields"],function(e,t,i){var n=e("bbcv"),r=e("bbmv"),o=i.exports=n.extend({initialize:function(e){this.bbmvInstance=r({el:this.$el,model:e.model}),n.prototype.initialize.call(this,e),this.model=e.model||this.model}});o.assignProto(e("bb-form/fields"))});