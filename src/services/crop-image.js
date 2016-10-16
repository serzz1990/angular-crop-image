'use strict';

module.exports = ['$document', function ($document) {


	class CropImage {


		constructor (element, data) {

			this.$element = element;
			this.data = angular.extend({}, CropImage.DEFAULT, data);

			this.checkZoom();

			this.data.ratio    = _private.methods.getRatio(this);
			this.data.size     = _private.methods.getSize(this);
			this.data.position = _private.methods.getCenterPosition(this);

			this.__last = this.getStyle();

			_private.methods.setCss( this );

			this.listen();
		}


		listen () {

			var _self = this;

			this.$element
				.on('mousedown', startChangePosition)
				.on('touchstart', startChangePosition);



			function startChangePosition (event) {

				if( _self.__disabled ) return;

				_self.__startChangePosition(event);

				$document
					.on('mousemove', updatePosition)
					.on('mouseup', stopChangePosition)
					.on('touchmove', updatePosition)
					.on('touchend', stopChangePosition);
			}

			function updatePosition (event) {

				_self.__updatePosition(event);

				return false;

			}

			function stopChangePosition (event) {

				$document
					.off('mousemove', updatePosition)
					.off('mouseup', stopChangePosition)
					.off('touchmove', updatePosition)
					.off('touchend', stopChangePosition);

				_self.__stopChangePosition(event);

			}

			return this;

		}


		setZoom (val) {

			this.data.zoom = val < 1? 1: val;

			this.recalcSize();
		}


		zoomIn (rate) {

			if( this.__disabled ) return;

			this.data.zoom += rate;

			this.checkZoom();

			this.recalcSize();

		}

		zoomOut (rate) {

			if( this.__disabled ) return;

			this.data.zoom -= rate;

			this.checkZoom();

			this.recalcSize();

		}

		checkZoom () {

			if(this.data.zoom > this.data.maxZoom) this.data.zoom = +this.data.maxZoom;
			else if( this.data.zoom < this.data.minZoom ) this.data.zoom = +this.data.minZoom;
			else this.data.zoom = +this.data.zoom;

		}

		getStyle () {

			var instance = {
				$element: this.$element,
				data : {
					image : {
						src: (this.$element[0].style.backgroundImage || 'none').replace(/^url\(/,'').replace(/\)$/,'')
					},
					size : {
						width : this.$element[0].clientWidth,
						height : this.$element[0].clientHeight
					}
				}
			};

			instance.data = angular.extend({}, CropImage.DEFAULT, instance.data);

			return instance;

		}


		cancel () {

			if( this.__disabled ) return;

			_private.methods.setCss(this.__last);

		}


		recalcSize () {

			var size     = _private.methods.getSize(this);

			this.data.position.x += (size.width - this.data.size.width)/2;
			this.data.position.y += (size.height - this.data.size.height)/2;

			this.data.size = size;

			this.__checkPosition ();

			this.$element.css({
				backgroundSize: size.width + 'px ' + size.height + 'px',
				backgroundPosition: (-1*this.data.position.x) + 'px ' + (-1*this.data.position.y) + 'px'
			});

			return this;

		}


		crop () {

			var instance = this;
			var canvas = this.getCanvas();
			var scale = this.data.ratio.width < this.data.ratio.height? this.data.ratio.height * this.data.zoom: this.data.ratio.width * this.data.zoom;

			canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
			canvas.ctx.restore();
			canvas.ctx.save();

			canvas.ctx.setTransform(scale*this.data.pixelRatio, 0, 0, scale*this.data.pixelRatio, -1*this.data.position.x*this.data.pixelRatio, -1*this.data.position.y*this.data.pixelRatio);
			canvas.ctx.drawImage(this.data.image, 0, 0);


			this.data.image = new Image ();
			this.data.image.src = canvas.element.toDataURL('image/jpg');
			this.data.image.onload = () => {

				instance.data.image.width = instance.data.image.width / instance.data.pixelRatio;
				instance.data.image.height = instance.data.image.height / instance.data.pixelRatio;

				instance.data.zoom     = 1;
				instance.data.ratio    = _private.methods.getRatio(instance);
				instance.data.size     = _private.methods.getSize(instance);
				instance.data.position = _private.methods.getCenterPosition(instance);

				_private.methods.setCss(instance);

			};

			return this.data.image.src;

		}


		getCanvas () {

			if( this.__canvas ){
				return this.__canvas;
			}

			var canvas = this.__canvas = {};
			canvas.element = document.createElement('canvas');
			canvas.ctx = canvas.element.getContext('2d');
			canvas.element.width = this.$element[0].clientWidth * this.data.pixelRatio;
			canvas.element.height = this.$element[0].clientHeight * this.data.pixelRatio;

			return canvas;

		}



		__checkPosition () {

			if( this.data.border === 'false' || !this.data.border) {
				return;
			}

			var fx = this.data.size.width - this.$element[0].clientWidth;
			var fy = this.data.size.height - this.$element[0].clientHeight;

			if( fx < this.data.position.x ) this.data.position.x = fx;
			else if( this.data.position.x < 0 ) this.data.position.x = 0;

			if( fy < this.data.position.y ) this.data.position.y = fy;
			else if( this.data.position.y < 0 ) this.data.position.y = 0;

		}




		__startChangePosition (event) {

			this.__changePosition = event;

			body.addClass('cursor-move');

		}

		__updatePosition (event) {

			let _event = event.type == 'touchmove'? event.touches[0]: event;
			let _lastEvent = event.type == 'touchmove'? this.__changePosition.touches[0]: this.__changePosition;


			this.data.position.x += _lastEvent.clientX - _event.clientX;
			this.data.position.y += _lastEvent.clientY - _event.clientY;

			this.__changePosition = event;


			this.__checkPosition();

			this.$element.css({'backgroundPosition': (-1*this.data.position.x) + 'px ' + (-1*this.data.position.y) + 'px'})

		}

		__stopChangePosition () {

			this.__changePosition = null;

			body.removeClass('cursor-move');

		}

		set disabled (disabled) {
			this.__disabled = disabled;
		}

	}


	CropImage.DEFAULT = {

		image : {
			src : null,
			width: 0,
			height: 0
		},
		position : {
			x: 0,
			y: 0
		},
		size : {
			width: 0,
			height: 0
		},
		pixelRatio : 1,
		zoom : 1,
		maxZoom : 5,
		minZoom : 1,
		border : true

	};


	var body = angular.element(document.body);


	var _private = {



		methods : {

			getCenterPosition : instance => {

				return {
					x : parseInt((instance.data.size.width - instance.$element[0].clientWidth) / 2),
					y: parseInt((instance.data.size.height -  instance.$element[0].clientHeight) / 2)
				};

			},

			getSize : instance => {

				let {ratio,image,zoom} = instance.data;

				return {
					width: parseInt( ratio.width < ratio.height ? image.width * ratio.height * zoom: image.width * ratio.width * zoom),
					height: parseInt( ratio.width < ratio.height ? image.height * ratio.height * zoom : image.height * ratio.width * zoom)
				};

			},

			getRatio : instance => {

				return {
					width: instance.$element[0].clientWidth / instance.data.image.width,
					height: instance.$element[0].clientHeight / instance.data.image.height
				}

			},

			setCss : instance => {

				instance.$element.css({
					backgroundImage: 'url('+instance.data.image.src+')',
					backgroundPosition: (-1*instance.data.position.x) + 'px ' + (-1*instance.data.position.y) + 'px',
					backgroundSize: instance.data.size.width + 'px ' + instance.data.size.height + 'px',
					backgroundRepeat: 'no-repeat'
				});

			}


		}

	};


	return CropImage;


}];
