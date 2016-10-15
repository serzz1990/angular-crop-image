'use strict';

angular
	.module('angularCropImage', [])
	.factory('CropImage', require('./src/services/crop-image.js'))
	.directive('cropImageModel', require('./src/directives/crop-image-model.js'))
	.directive('cropImage', require('./src/directives/crop-image.js'));