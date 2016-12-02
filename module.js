'use strict';

import './index.styl'

angular
	.module('angularCropImage', [])
	.service('CropImage', require('./src/services/crop-image.js'))
	.directive('cropImageSource', require('./src/directives/crop-image-source.js'))
	.directive('cropImage', require('./src/directives/crop-image.js'));