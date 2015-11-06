'use strict';

import CropImage from './services/CropImage';

import cropImageFile from './directives/cropImageFile';


angular
	.module('angularCropImage', [])
	.service('CropImage', CropImage)
	.directive('cropImageFile', cropImageFile);