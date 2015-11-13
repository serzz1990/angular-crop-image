'use strict';


export default  (CropImage) => {

	return {

		restrict: 'A',
		link: (scope, element, attributes) => {

			var dirName = 'cropImageModel';
			var model = attributes[dirName];

			if( !attributes[dirName] ){

				throw Error('No model name in attr crop-image-model');

			}


			element.on('change', function(){

				var file = this.files[0],
				    reader = new FileReader();


				if( !file || !/image/.test(file.type) ){
					// error this file not Image;
					return;
				}

				reader.onload = () => {

					scope[model] = reader.result;
					scope.$apply();

				};

				reader.readAsDataURL(file);

			});

		}

	};

}


module.exports.$inject = [

];