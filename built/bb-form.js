define("bb-rendered-view",["require","exports","module","lowercase-backbone","lodash"],function(e,t,i){var r=e("lowercase-backbone").view,a=e("lodash"),n=r.prototype.initialize,s=r.extend({initialize:function(e){n.apply(this,a.toArray(arguments)),a.each(["template","templateCompiler","templateDataDefaults","templateDataParse","render"],function(t){this[t]=e[t]||this[t]},this),this.render(e)},templateCompiler:a.template,template:void 0,templateDataDefaults:{},templateDataParse:function(e){return a.assign({},this.templateDataDefaults,e)},render:function(e){var t,i=this.template;if(i){var r=this.templateDataParse(e);a.isFunction(i)?t=i(r):a.isString(i)&&(t=this.templateCompiler(i)(r)),this.$el.html(t)}return this}});i.exports=s}),define("bb-form/fields/base/validated",["require","exports","module","bb-rendered-view","lodash"],function(e,t,i){function r(){this.model.isValid()&&this.handleModelValid()}function a(e,t){s.contains(this.fieldAttributes,t.attribute)&&this.handleModelInvalid(t)}var n=e("bb-rendered-view"),s=e("lodash"),o=n.prototype.initialize;i.exports=n.extend({initialize:function(e){if(o.call(this,e),this.formView=e.formView,this.fieldAttributes=e.attributes?e.attributes:[e.attribute],0===this.fieldAttributes.length)throw new Error("[bb-form/fields/base | attribute or attributes must be defined.");this.listenTo(this.model,"invalid",a),this.listenTo(this.model,"change",r)},handleModelInvalid:function(e){this.$el.addClass("invalid"),this.$el.find("[data-bb-form-message]").show().html(e.error)},handleModelValid:function(){this.$el.removeClass("invalid"),this.$el.find("[data-bb-form-message]").hide().html("")}})}),define("bb-form/fields/aux",["require","exports","module"],function(e,t){t.camelCaseToDashed=function(e){return e.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase()})}}),define("bb-form/fields/base/incorporated",["require","exports","module","bb-form/fields/base/validated","bb-form/fields/aux"],function(e,t,i){var r=e("bb-form/fields/base/validated"),a=e("bb-form/fields/aux");i.exports=r.extend({initialize:function(e){r.prototype.initialize.call(this,e),this.formView.incorporate(this.$el)},templateDataParse:function(e){return e.attribute&&(e.attribute=a.camelCaseToDashed(e.attribute)),e.attributes&&(e.attributes=_.map(e.attributes,a.camelCaseToDashed)),e}})}),define("text!bb-form/fields/html/text.html",[],function(){return'<b><%- attribute %></b><br>\n\n<input data-bb-form-attribute="<%- attribute %>" type="text" data-bind-<%- attribute %>="value">\n\n<div data-bb-form-message></div>\n'}),define("bb-form/fields/text",["require","exports","module","lodash","bb-form/fields/base/incorporated","text!bb-form/fields/html/text.html"],function(e,t,i){var r=e("lodash");i.exports=e("bb-form/fields/base/incorporated").extend({template:r.template(e("text!bb-form/fields/html/text.html"))})}),define("text!bb-form/fields/html/textarea.html",[],function(){return'<b><%- attribute %></b><br>\n<textarea data-bind-<%- attribute %>="value"></textarea>\n'}),define("bb-form/fields/textarea",["require","exports","module","lodash","bb-form/fields/text","text!bb-form/fields/html/textarea.html"],function(e,t,i){var r=e("lodash");i.exports=e("bb-form/fields/text").extend({template:r.template(e("text!bb-form/fields/html/textarea.html"))})}),define("text!bb-form/fields/html/select.html",[],function(){return'<div>\n	<select data-bind-<%- attribute %>="val" data-binding-event="change">\n\n		<option value="">NONE</option>\n\n		<% _.forEach(options, function(opt) { %>\n			<option value="<%- opt.value %>">\n				<%- opt.label %>\n			</option>\n		<% }); %>\n	</select>\n</div>\n'}),define("bb-form/fields/select",["require","exports","module","lodash","bb-form/fields/base/incorporated","text!bb-form/fields/html/select.html"],function(e,t,i){var r=e("lodash");i.exports=e("bb-form/fields/base/incorporated").extend({template:r.template(e("text!bb-form/fields/html/select.html"))})}),define("bb-form/field-management",["require","exports","module","jquery","lodash","bb-form/fields/text","bb-form/fields/textarea","bb-form/fields/select"],function(e,t){function i(e){if(!e.type)throw new Error("[bb-form | createField] Type is required as a field option.");var t=a.isFunction(this.fieldElementWrapper)?this.fieldElementWrapper(e):this.fieldElementWrapper,i=r(t).appendTo(this.$container),n=this.fieldConstructors[e.type];if(!a.isFunction(n))throw new Error(e.type+" is not a field constructor function.");e.formView=this,e.model=this.model,e.el=i;var s=n(e);return this.fieldViews.push(s),s}var r=e("jquery"),a=e("lodash");t.fieldConstructors={text:e("bb-form/fields/text"),textarea:e("bb-form/fields/textarea"),select:e("bb-form/fields/select")},t.fieldElementWrapper="<div></div>",t.createField=function(e){return a.isArray(e)?a.map(e,i,this):i.call(this,e)},t.removeField=function(e){var t=a.isObject(e)?e.cid:e,i=a.indexOf(this.fieldViews,function(e){return e.cid===t});if(!a.isUndefined(i)){var r=this.fieldViews.splice(i,1);r[0].remove()}return this}}),define("bb-form",["require","exports","module","bbmv","lodash","bb-form/field-management"],function(e,t,i){var r=e("bbmv"),a=e("lodash"),n=r.extend({initialize:function(e){r.prototype.initialize.call(this,e),a.each(["containerSelector"],function(t){this[t]=e[t]||this[t]},this),this.$container=this.containerSelector?this.$el.find(this.containerSelector):this.$el,this.fieldViews=[],e.fields&&this.createField(e.fields)}});n.assignProto(e("bb-form/field-management")),n.assignStatic({fieldConstructor:function(){return a.isObject(arguments[0])?a.assign(this.fieldConstructors,arguments[0]):this.fieldConstructors[arguments[0]]=arguments[1],this},extendFieldConstructors:function(e){var t=a.create(this.prototype.fieldConstructors);return a.assign(t,e),this.extend({fieldConstructors:t})}}),i.exports=n});