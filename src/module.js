'use strict';

import CropImage from './services/CropImage';
import CropService from './services/CropService';

import cropImageModel from './directives/cropImageModel';
import cropImage from './directives/cropImage';


angular
	.module('angularCropImage', [])
	.service('CropImage', CropImage)
	.service('CropService', CropService)
	.directive('cropImageModel', cropImageModel)
	.directive('cropImage', cropImage);