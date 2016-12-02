/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	angular.module('angularCropImage', []).service('CropImage', __webpack_require__(3)).directive('cropImageSource', __webpack_require__(4)).directive('cropImage', __webpack_require__(5));

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = ['$document', function ($document) {
		var CropImage = function () {
			function CropImage(element, data) {
				_classCallCheck(this, CropImage);

				this.$element = element;
				this.data = angular.extend({}, CropImage.DEFAULT, data);

				this.checkZoom();

				this.data.ratio = _private.methods.getRatio(this);
				this.data.size = _private.methods.getSize(this);
				this.data.position = _private.methods.getCenterPosition(this);

				this.__last = this.getStyle();

				_private.methods.setCss(this);

				this.listen();
			}

			_createClass(CropImage, [{
				key: 'listen',
				value: function listen() {

					var _self = this;

					this.$element.on('mousedown', startChangePosition).on('touchstart', startChangePosition);

					function startChangePosition(event) {

						if (_self.__disabled) return;

						_self.__startChangePosition(event);

						$document.on('mousemove', updatePosition).on('mouseup', stopChangePosition).on('touchmove', updatePosition).on('touchend', stopChangePosition);
					}

					function updatePosition(event) {

						_self.__updatePosition(event);

						return false;
					}

					function stopChangePosition(event) {

						$document.off('mousemove', updatePosition).off('mouseup', stopChangePosition).off('touchmove', updatePosition).off('touchend', stopChangePosition);

						_self.__stopChangePosition(event);
					}

					return this;
				}
			}, {
				key: 'setZoom',
				value: function setZoom(val) {

					this.data.zoom = val < 1 ? 1 : val;

					this.recalcSize();
				}
			}, {
				key: 'zoomIn',
				value: function zoomIn(rate) {

					if (this.__disabled) return;

					this.data.zoom += rate;

					this.checkZoom();

					this.recalcSize();
				}
			}, {
				key: 'zoomOut',
				value: function zoomOut(rate) {

					if (this.__disabled) return;

					this.data.zoom -= rate;

					this.checkZoom();

					this.recalcSize();
				}
			}, {
				key: 'checkZoom',
				value: function checkZoom() {

					if (this.data.zoom > this.data.maxZoom) this.data.zoom = +this.data.maxZoom;else if (this.data.zoom < this.data.minZoom) this.data.zoom = +this.data.minZoom;else this.data.zoom = +this.data.zoom;
				}
			}, {
				key: 'getStyle',
				value: function getStyle() {

					var instance = {
						$element: this.$element,
						data: {
							image: {
								src: (this.$element[0].style.backgroundImage || 'none').replace(/^url\(/, '').replace(/\)$/, '')
							},
							size: {
								width: this.$element[0].clientWidth,
								height: this.$element[0].clientHeight
							}
						}
					};

					instance.data = angular.extend({}, CropImage.DEFAULT, instance.data);

					return instance;
				}
			}, {
				key: 'cancel',
				value: function cancel() {

					if (this.__disabled) return;

					_private.methods.setCss(this.__last);
				}
			}, {
				key: 'recalcSize',
				value: function recalcSize() {

					var size = _private.methods.getSize(this);

					this.data.position.x += (size.width - this.data.size.width) / 2;
					this.data.position.y += (size.height - this.data.size.height) / 2;

					this.data.size = size;

					this.__checkPosition();

					this.$element.css({
						backgroundSize: size.width + 'px ' + size.height + 'px',
						backgroundPosition: -1 * this.data.position.x + 'px ' + -1 * this.data.position.y + 'px'
					});

					return this;
				}
			}, {
				key: 'crop',
				value: function crop() {

					var instance = this;
					var canvas = this.getCanvas();
					var scale = this.data.ratio.width < this.data.ratio.height ? this.data.ratio.height * this.data.zoom : this.data.ratio.width * this.data.zoom;

					canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
					canvas.ctx.restore();
					canvas.ctx.save();

					canvas.ctx.setTransform(scale * this.data.pixelRatio, 0, 0, scale * this.data.pixelRatio, -1 * this.data.position.x * this.data.pixelRatio, -1 * this.data.position.y * this.data.pixelRatio);
					canvas.ctx.drawImage(this.data.image, 0, 0);

					this.data.image = new Image();
					this.data.image.src = canvas.element.toDataURL('image/jpg');
					this.data.image.onload = function () {

						instance.data.image.width = instance.data.image.width / instance.data.pixelRatio;
						instance.data.image.height = instance.data.image.height / instance.data.pixelRatio;

						instance.data.zoom = 1;
						instance.data.ratio = _private.methods.getRatio(instance);
						instance.data.size = _private.methods.getSize(instance);
						instance.data.position = _private.methods.getCenterPosition(instance);

						_private.methods.setCss(instance);
					};

					return this.data.image.src;
				}
			}, {
				key: 'getCanvas',
				value: function getCanvas() {

					if (this.__canvas) {
						return this.__canvas;
					}

					var canvas = this.__canvas = {};
					canvas.element = document.createElement('canvas');
					canvas.ctx = canvas.element.getContext('2d');
					canvas.element.width = this.$element[0].clientWidth * this.data.pixelRatio;
					canvas.element.height = this.$element[0].clientHeight * this.data.pixelRatio;

					return canvas;
				}
			}, {
				key: '__checkPosition',
				value: function __checkPosition() {

					if (this.data.border === 'false' || !this.data.border) {
						return;
					}

					var fx = this.data.size.width - this.$element[0].clientWidth;
					var fy = this.data.size.height - this.$element[0].clientHeight;

					if (fx < this.data.position.x) this.data.position.x = fx;else if (this.data.position.x < 0) this.data.position.x = 0;

					if (fy < this.data.position.y) this.data.position.y = fy;else if (this.data.position.y < 0) this.data.position.y = 0;
				}
			}, {
				key: '__startChangePosition',
				value: function __startChangePosition(event) {

					this.__changePosition = event;

					body.addClass('cursor-move');
				}
			}, {
				key: '__updatePosition',
				value: function __updatePosition(event) {

					var _event = event.type == 'touchmove' ? event.touches[0] : event;
					var _lastEvent = event.type == 'touchmove' ? this.__changePosition.touches[0] : this.__changePosition;

					this.data.position.x += _lastEvent.clientX - _event.clientX;
					this.data.position.y += _lastEvent.clientY - _event.clientY;

					this.__changePosition = event;

					this.__checkPosition();

					this.$element.css({ 'backgroundPosition': -1 * this.data.position.x + 'px ' + -1 * this.data.position.y + 'px' });
				}
			}, {
				key: '__stopChangePosition',
				value: function __stopChangePosition() {

					this.__changePosition = null;

					body.removeClass('cursor-move');
				}
			}, {
				key: 'disabled',
				set: function set(disabled) {
					this.__disabled = disabled;
				}
			}]);

			return CropImage;
		}();

		CropImage.DEFAULT = {

			image: {
				src: null,
				width: 0,
				height: 0
			},
			position: {
				x: 0,
				y: 0
			},
			size: {
				width: 0,
				height: 0
			},
			pixelRatio: 1,
			zoom: 1,
			maxZoom: 5,
			minZoom: 1,
			border: true

		};

		var body = angular.element(document.body);

		var _private = {

			methods: {

				getCenterPosition: function getCenterPosition(instance) {

					return {
						x: parseInt((instance.data.size.width - instance.$element[0].clientWidth) / 2),
						y: parseInt((instance.data.size.height - instance.$element[0].clientHeight) / 2)
					};
				},

				getSize: function getSize(instance) {
					var _instance$data = instance.data,
					    ratio = _instance$data.ratio,
					    image = _instance$data.image,
					    zoom = _instance$data.zoom;


					return {
						width: parseInt(ratio.width < ratio.height ? image.width * ratio.height * zoom : image.width * ratio.width * zoom),
						height: parseInt(ratio.width < ratio.height ? image.height * ratio.height * zoom : image.height * ratio.width * zoom)
					};
				},

				getRatio: function getRatio(instance) {

					return {
						width: instance.$element[0].clientWidth / instance.data.image.width,
						height: instance.$element[0].clientHeight / instance.data.image.height
					};
				},

				setCss: function setCss(instance) {

					instance.$element.css({
						backgroundImage: 'url(' + instance.data.image.src + ')',
						backgroundPosition: -1 * instance.data.position.x + 'px ' + -1 * instance.data.position.y + 'px',
						backgroundSize: instance.data.size.width + 'px ' + instance.data.size.height + 'px',
						backgroundRepeat: 'no-repeat'
					});
				}

			}

		};

		return CropImage;
	}];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {

		return {

			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ngModel) {

				element.on('change', function () {

					var file = this.files[0],
					    reader = new FileReader();

					if (!file || !/image/.test(file.type)) {
						// error this file not Image;
						return;
					}

					reader.onload = function () {

						ngModel.$setViewValue(reader.result);
						scope.$apply();
					};

					reader.readAsDataURL(file);
				});
			}

		};
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['CropImage', function (CropImage) {

		return {

			restrict: 'A',

			link: function link(scope, element, attributes) {

				var instance;
				var directiveName = 'cropImage';
				var source = attributes[directiveName];

				var data = angular.extend({}, attributes);

				scope.$watch(source, function (src) {

					if (!src) return;

					data.image = new Image();
					data.image.src = src;

					scope.cropImageModeEdit = true;

					data.image.onload = function () {
						return element.data(directiveName, instance = new CropImage(element, data));
					};
				});

				scope.cropImageZoom = function (value) {

					if (!instance) return;

					instance.setZoom(value);
				};

				scope.cropImageZoomIn = function (rate) {

					if (!instance) return;

					instance.zoomIn(rate);
				};

				scope.cropImageZoomOut = function (rate) {

					if (!instance) return;

					instance.zoomOut(rate);
				};

				scope.cropImageCut = function () {

					if (!instance) return;

					scope.cropImageModeEdit = false;

					instance.disabled = true;

					return instance.crop();
				};

				scope.cropImageCancel = function () {

					if (!instance) return;

					scope.cropImageModeEdit = false;

					instance.cancel();

					instance.disabled = true;
				};
			}

		};
	}];

/***/ }
/******/ ]);