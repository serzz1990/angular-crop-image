'use strict';


export default CropImage => {


	return {

		restrict: 'A',

		link: (scope, element, attributes) => {

			var instance;
			var directiveName = 'cropImage';
			var source = attributes[directiveName];

			var data = angular.extend({}, attributes);

			scope.$watch(source, src => {

				if( !src ) return;

				data.image = new Image();
				data.image.src = src;

				scope.cropImageModeEdit = true;

				data.image.onload = () => element.data(directiveName, (instance = new CropImage( element, data )));

			});


			scope.cropImageZoom = value => {

				instance.setZoom(value);

			};

			scope.cropImageZoomIn = rate => {

				instance.zoomIn(rate);

			};


			scope.cropImageZoomOut = rate => {

				instance.zoomOut(rate);

			};


			scope.cropImageCut = () => {

				scope.cropImageModeEdit = false;
				return instance.crop();

			};


			scope.cropImageCancel = () => {

				scope.cropImageModeEdit = false;
				instance.cancel();

			};


		}

	};

}


module.exports.$inject = [
	'CropImage'
];