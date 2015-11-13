'use strict';


export default  (CropImage) => {

	return {

		restrict: 'A',
		link: (scope, element, attributes) => {

			var directiveName = 'cropImage';
			var zoom = attributes.zoom;
			var source = attributes[directiveName];
			var instance;

			var data = {
				element : element,
				pixelRatio : attributes.pixelRatio || 1
			};

			scope[zoom] = scope[zoom] || 0;


			scope.$watch(source, src => {

				if( !src ) return;

				data.image = new Image();
				data.image.src = src;

				data.image.onload = () => element.data(directiveName, (instance = new CropImage(data)));

			});

			//scope.$watch(zoom, (val, old, scope) => {
			//
			//	if( !instance ) return;
			//
			//	instance.zoom = val;
			//
			//});


			scope.cropImageZoomIn = rate => {

				instance.zoomIn(rate);

			};

			scope.cropImageZoomOut = rate => {

				instance.zoomOut(rate);

			};


			scope.cropImageCut = () => instance.cut();


		}

	};

}


module.exports.$inject = [
	'CropImage'
];