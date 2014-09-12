require.config({
	urlArgs: 'bust=0.5544952827040106',
	baseUrl: '/js',
	paths: {
		requirejs: '../bower_components/requirejs/require',
		text: '../bower_components/requirejs-text/text',
		mocha: '../node_modules/mocha/mocha',
		should: '../node_modules/should/should',
		'bb-form': 'bb-form',
		backbone: '../bower_components/backbone/backbone',
		bbcv: '../bower_components/bbcv/built/bbcv',
		bbdv: '../bower_components/bbdv/built/bbdv',
		'jquery-selector-data-prefix': '../bower_components/jquery-selector-data-prefix/built/jquery-selector-data-prefix',
		'jquery-value': '../bower_components/jquery-value/built/jquery-value',
		bbmv: '../bower_components/bbmv/built/bbmv',
		jquery: '../bower_components/jquery/dist/jquery',
		'lowercase-backbone': '../bower_components/lowercase-backbone/built/lowercase-backbone',
		pipe: '../bower_components/pipe/built/pipe',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		qunit: '../bower_components/qunit/qunit/qunit',
		'requirejs-text': '../bower_components/requirejs-text/text',
		subject: '../bower_components/subject/built/subject',
		underscore: '../bower_components/underscore/underscore',
		'bb-dock': '../bower_components/bb-dock/built/bb-dock',
		dock: '../bower_components/dock/built/dock',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		'blueimp-canvas-to-blob': '../bower_components/blueimp-canvas-to-blob/js/canvas-to-blob',
		'blueimp-tmpl': '../bower_components/blueimp-tmpl/js/tmpl',
		'load-image': '../bower_components/blueimp-load-image/js/load-image',
		'load-image-ios': '../bower_components/blueimp-load-image/js/load-image-ios',
		'load-image-orientation': '../bower_components/blueimp-load-image/js/load-image-orientation',
		'load-image-meta': '../bower_components/blueimp-load-image/js/load-image-meta',
		'load-image-exif': '../bower_components/blueimp-load-image/js/load-image-exif',
		'load-image-exif-map': '../bower_components/blueimp-load-image/js/load-image-exif-map',
		'jquery.postmessage-transport': '../bower_components/jquery-file-upload/js/cors/jquery.postmessage-transport',
		'jquery.xdr-transport': '../bower_components/jquery-file-upload/js/cors/jquery.xdr-transport',
		'jquery.ui.widget': '../bower_components/jquery-file-upload/js/vendor/jquery.ui.widget',
		'jquery.fileupload': '../bower_components/jquery-file-upload/js/jquery.fileupload',
		'jquery.fileupload-process': '../bower_components/jquery-file-upload/js/jquery.fileupload-process',
		'jquery.fileupload-validate': '../bower_components/jquery-file-upload/js/jquery.fileupload-validate',
		'jquery.fileupload-image': '../bower_components/jquery-file-upload/js/jquery.fileupload-image',
		'jquery.fileupload-audio': '../bower_components/jquery-file-upload/js/jquery.fileupload-audio',
		'jquery.fileupload-video': '../bower_components/jquery-file-upload/js/jquery.fileupload-video',
		'jquery.fileupload-ui': '../bower_components/jquery-file-upload/js/jquery.fileupload-ui',
		'jquery.fileupload-jquery-ui': '../bower_components/jquery-file-upload/js/jquery.fileupload-jquery-ui',
		'jquery.fileupload-angular': '../bower_components/jquery-file-upload/js/jquery.fileupload-angular',
		'jquery.iframe-transport': '../bower_components/jquery-file-upload/js/jquery.iframe-transport',
		'bb-rendered-view': '../bower_components/bb-rendered-view/built/bb-rendered-view'
	},
	shim: {
		backbone: {
			exports: 'Backbone',
			deps: [
				'jquery',
				'underscore'
			]
		},
		underscore: {
			exports: '_'
		},
		mocha: {
			exports: 'mocha'
		},
		should: {
			exports: 'should'
		}
	}
});
