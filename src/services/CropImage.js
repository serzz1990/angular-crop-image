'use strict';


export default ($document) => {

	var body = angular.element(document.body);

	class CropImage {


		constructor (data) {

			this.zoom    = 1;
			this.element = data.element;
			this.image   = data.image;
			this.pixelRatio = data.pixelRatio;
			this.ratio   = _private.methods.getRatio(data.element, data.image);
			this.size    = {
				width: parseInt( this.ratio.width < this.ratio.height ? data.image.width * this.ratio.height : data.image.width * this.ratio.width),
				height: parseInt(this.ratio.width < this.ratio.height ? data.image.height * this.ratio.height : data.image.height * this.ratio.width)
			};

			console.log('this.pixelRatio',this.pixelRatio);

			this.position = {
				x : parseInt((this.size.width - data.element[0].clientWidth) / 2),
				y: parseInt((this.size.height -  data.element[0].clientHeight) / 2)
			};

			_private.methods.setCss( this );

			console.log(this);

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


		zoomIn (rate) {

			this.zoom += rate;

			//if( this.zoom > 1 ) this.zoom = 1;

			this.recalcSize();

		}


		zoomOut (rate) {

			this.zoom -= rate;

			if( this.zoom < 1 ) this.zoom = 1;

			this.recalcSize();

		}


		recalcSize () {

			var height,width;


			if( this.ratio.width < this.ratio.height ) {

				width = this.image.width * this.ratio.height * this.zoom;
				height = this.image.height * this.ratio.height * this.zoom;

			}else {

				width =  this.image.width * this.ratio.width * this.zoom;
				height = this.image.height * this.ratio.width * this.zoom;

			}


			this.position.x += (width - this.size.width)/2;
			this.position.y += (height - this.size.height)/2;

			this.size = { width, height };

			this.checkPosition ();

			this.element.css({
				backgroundSize: width + 'px ' + height + 'px',
				backgroundPosition: (-1*this.position.x) + 'px ' + (-1*this.position.y) + 'px'
			});

			return this;

		}


		cut () {

			var canvas = this.getCanvas();
			var scale = this.ratio.width < this.ratio.height? this.ratio.height * this.zoom: this.ratio.width * this.zoom;

			canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
			canvas.ctx.restore();
			canvas.ctx.save();

			canvas.ctx.setTransform(scale*this.pixelRatio, 0, 0, scale*this.pixelRatio, -1*this.position.x*this.pixelRatio, -1*this.position.y*this.pixelRatio);

			canvas.ctx.drawImage(this.image, 0, 0);

			return this.result = canvas.element.toDataURL('image/jpg');

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

			console.log(this.element[0].clientWidth);
			console.log(this.element[0].clientHeight);


			return canvas;
		}



		checkPosition () {

			var f_x = this.size.width - this.element[0].clientWidth;
			var f_y = this.size.height - this.element[0].clientHeight;

			if( f_x < this.position.x ) this.position.x = f_x;
			else if( this.position.x < 0 ) this.position.x = 0;

			if( f_y < this.position.y ) this.position.y = f_y;
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



	var _private = {



		methods : {

			getRatio : (element, image) => {
				return {
					width: element[0].clientWidth / image.width,
					height: element[0].clientHeight / image.height
				}
			},

			setCss : function( instance ) {

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