'use strict';


export default  (CropImage) => {

	return {

		restrict: 'A',
		scope: {
			cropImageModel : '='
		},
		link: (scope, element) => {

			element.on('change', function(){

				var file = this.files[0],
				    reader = new FileReader();


				if( !file || !/image/.test(file.type) ){
					// error this file not Image;
					return;
				}

				reader.onload = () => {

					scope.cropImageModel = reader.result;
					scope.$apply();

				};

				reader.readAsDataURL(file);

			});

		}

	};

}


module.exports.$inject = [

];