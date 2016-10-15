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

				if( !instance ) return;

				instance.setZoom(value);

			};

			scope.cropImageZoomIn = rate => {

				if( !instance ) return;

				instance.zoomIn(rate);

			};


			scope.cropImageZoomOut = rate => {

				if( !instance ) return;

				instance.zoomOut(rate);

			};


			scope.cropImageCut = () => {

				if( !instance ) return;

				scope.cropImageModeEdit = false;

				instance.disabled = true;

				return instance.crop();

			};


			scope.cropImageCancel = () => {

				if( !instance ) return;

				scope.cropImageModeEdit = false;

				instance.cancel();

				instance.disabled = true;

			};


		}

	};

}


module.exports.$inject = [
	'CropImage'
];