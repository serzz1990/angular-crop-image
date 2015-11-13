'use strict';


export default ($document) => {



	class CropImage {


		constructor (data) {

			angular.extend(this, CropImage.DEFAULT, data);

			this.ratio    = _private.methods.getRatio(this);
			this.size     = _private.methods.getSize(this);
			this.position = _private.methods.getCenterPosition(this);

			this.__last = this.getStyle();

			_private.methods.setCss( this );

			this.listen();
		}


		listen () {

			var _self = this;


			this.element
				.on('mousedown', startChangePosition)
				.on('touchstart', startChangePosition);



			function startChangePosition (event) {

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

			this.zoom = val < 1? 1: val;

			this.recalcSize();
		}


		zoomIn (rate) {

			this.zoom += rate;

			this.recalcSize();

		}


		zoomOut (rate) {

			this.zoom -= rate;

			if( this.zoom < 1 ) this.zoom = 1;

			this.recalcSize();

		}


		getStyle () {

			var data = {
				element: this.element,
				image : {
					src: (this.element[0].style.backgroundImage || 'none').replace(/^url\(/,'').replace(/\)$/,'')
				},
				size : {
					width : this.element[0].clientWidth,
					height : this.element[0].clientHeight
				}
			};

			return angular.extend({}, CropImage.DEFAULT, data);

		}


		cancel () {

			_private.methods.setCss(this.__last);

		}


		recalcSize () {

			var size     = _private.methods.getSize(this);

			this.position.x += (size.width - this.size.width)/2;
			this.position.y += (size.height - this.size.height)/2;

			this.size = size;

			this.checkPosition ();

			this.element.css({
				backgroundSize: size.width + 'px ' + size.height + 'px',
				backgroundPosition: (-1*this.position.x) + 'px ' + (-1*this.position.y) + 'px'
			});

			return this;

		}


		crop () {

			var instance = this;
			var canvas = this.getCanvas();
			var scale = this.ratio.width < this.ratio.height? this.ratio.height * this.zoom: this.ratio.width * this.zoom;

			canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
			canvas.ctx.restore();
			canvas.ctx.save();

			canvas.ctx.setTransform(scale*this.pixelRatio, 0, 0, scale*this.pixelRatio, -1*this.position.x*this.pixelRatio, -1*this.position.y*this.pixelRatio);
			canvas.ctx.drawImage(this.image, 0, 0);


			this.image = new Image ();
			this.image.src = canvas.element.toDataURL('image/jpg');
			this.image.onload = () => {

				instance.image.width = instance.image.width / instance.pixelRatio;
				instance.image.height = instance.image.height / instance.pixelRatio;

				instance.zoom     = 1;
				instance.ratio    = _private.methods.getRatio(instance);
				instance.size     = _private.methods.getSize(instance);
				instance.position = _private.methods.getCenterPosition(instance);

				_private.methods.setCss(instance);

			};

			return this.image.src;

		}


		getCanvas () {

			if( this.__canvas ){
				return this.__canvas;
			}

			var canvas = this.__canvas = {};
			canvas.element = document.createElement('canvas');
			canvas.ctx = canvas.element.getContext('2d');
			canvas.element.width = this.element[0].clientWidth * this.pixelRatio;
			canvas.element.height = this.element[0].clientHeight * this.pixelRatio;

			return canvas;

		}



		checkPosition () {

			var fx = this.size.width - this.element[0].clientWidth;
			var fy = this.size.height - this.element[0].clientHeight;

			if( fx < this.position.x ) this.position.x = fx;
			else if( this.position.x < 0 ) this.position.x = 0;

			if( fy < this.position.y ) this.position.y = fy;
			else if( this.position.y < 0 ) this.position.y = 0;

		}




		__startChangePosition (event) {

			this.__changePosition = event;

			body.addClass('cursor-move');

		}

		__updatePosition (event) {

			let _event = event.type == 'touchmove'? event.touches[0]: event;
			let _lastEvent = event.type == 'touchmove'? this.__changePosition.touches[0]: this.__changePosition;


			this.position.x += _lastEvent.clientX - _event.clientX;
			this.position.y += _lastEvent.clientY - _event.clientY;

			this.__changePosition = event;


			this.checkPosition();

			this.element.css({'backgroundPosition': (-1*this.position.x) + 'px ' + (-1*this.position.y) + 'px'})

		}

		__stopChangePosition () {

			this.__changePosition = null;

			body.removeClass('cursor-move');

		}


	}


	CropImage.DEFAULT = {

		element: null,
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
		zoom : 1,
		pixelRatio : 1

	};


	var body = angular.element(document.body);


	var _private = {



		methods : {

			getCenterPosition : instance => {

				return {
					x : parseInt((instance.size.width - instance.element[0].clientWidth) / 2),
					y: parseInt((instance.size.height -  instance.element[0].clientHeight) / 2)
				};

			},

			getSize : instance => {

				let {ratio,image,zoom} = instance;

				return {
					width: parseInt( ratio.width < ratio.height ? image.width * ratio.height * zoom: image.width * ratio.width * zoom),
					height: parseInt( ratio.width < ratio.height ? image.height * ratio.height * zoom : image.height * ratio.width * zoom)
				};

			},

			getRatio : instance => {

				return {
					width: instance.element[0].clientWidth / instance.image.width,
					height: instance.element[0].clientHeight / instance.image.height
				}

			},

			setCss : instance => {

				instance.element.css({
					backgroundImage: 'url('+instance.image.src+')',
					backgroundPosition: (-1*instance.position.x) + 'px ' + (-1*instance.position.y) + 'px',
					backgroundSize: instance.size.width + 'px ' + instance.size.height + 'px',
					backgroundRepeat: 'no-repeat'
				});

			}


		}

	};


	return CropImage;

}



module.exports.$inject = [
	'$document'
];