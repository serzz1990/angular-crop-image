'use strict';


module.exports = function () {

	return {

		restrict: 'A',
		require: 'ngModel',
		link: (scope, element, attrs, ngModel) => {

			element.on('change', function () {

				var file = this.files[0],
				    reader = new FileReader();


				if (!file || !/image/.test(file.type)) {
					// error this file not Image;
					return;
				}

				reader.onload = () => {

					ngModel.$setViewValue(reader.result);
					scope.$apply();

				};

				reader.readAsDataURL(file);

			});

		}

	};

};