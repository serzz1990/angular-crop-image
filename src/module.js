'use strict';

import CropImage from './services/CropImage';

import cropImageModel from './directives/cropImageModel';
import cropImage from './directives/cropImage';


angular
	.module('angularCropImage', [])
	.factory('CropImage', CropImage)
	.directive('cropImageModel', cropImageModel)
	.directive('cropImage', cropImage);