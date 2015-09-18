;(function($){
	function Lightbox(){
		var __this__ = this;
		// create nodes of mask and popup window
		this.mask = $('<div id="lightbox-mask">');
		this.popupWin = $('<div id="lightbox-popup-win">');
		// cache of body node
		this.bodyNode = $('body');
		// console.log(this);
		// render other DOM
		this.renderDOM();
		// cache of nodes of DOM
		this.picArea = this.popupWin.find('div.lightbox-pic-area');
		this.image = this.popupWin.find('img.lightbox-image');
		this.prevBtn = this.popupWin.find('span.lightbox-prev');
		this.nextBtn = this.popupWin.find('span.lightbox-next');
		this.captionArea = this.popupWin.find('div.lightbox-caption-area');
		this.captionText = this.popupWin.find('p.lightbox-desc');
		this.currentIndex = this.popupWin.find('span.lightbox-index');
		this.closeBtn = this.popupWin.find('span.lightbox-close-btn');		
		
		this.groupName = null;
		this.groupData = [];
		this.bodyNode.delegate('.js-lightbox, [data-role="lightbox"]', 'click', function(events){
			// delegate the click events to the body
			events.stopPropagation();
			// console.log($(this).attr('data-group'));
			__this__.groupName = $(this).attr('data-group');
			__this__.getGroup();
			__this__.initLightbox($(this));
		});
		// add close function of mask
		this.mask.click(function(){
			$(this).fadeOut();
			__this__.popupWin.fadeOut();
		});
	}
	Lightbox.prototype = {
		renderDOM: function(){
			var strDOM= '<div class="lightbox-pic-area">' +
						'<span class="lightbox-btn lightbox-prev"></span>' +
						'<img class="lightbox-image" src="images/2-2.jpg" width="100%">' +
						'<span class="lightbox-btn lightbox-next"></span>' +
						'</div>' +
						'<div class="lightbox-caption-area">' +
						'<div class="lightbox-caption">' +
						'<p class="lightbox-desc">Here is caption.</p>' +
						'</div>' +
						'<span class="lightbox-index">index: 0 of 0</span>' +						
						'<span class="lightbox-close-btn"></span>' +
						'</div>';
			this.popupWin.html(strDOM);
			this.bodyNode.append(this.mask, this.popupWin);
		},
		initLightbox: function(imgObj){
			// collect the parameters of the clicked image 
			var imgSrc = imgObj.attr('data-source'),
				imgId = imgObj.attr('data-id');
			this.showLightbox(imgSrc, imgId);		
		},
		showLightbox: function(src, id){
			// show the mask and the popup window
			var __this__ = this;
			this.image.hide();
			this.captionArea.hide();
			this.mask.fadeIn();
			// cache of the width and height of visible window
			var winWidth = $(window).width(),
				winHeight = $(window).height(),
				viewWidth = (winWidth / 2) + 10,
				viewHeigth = (winHeight / 2) + 10;
			this.picArea.css({
				width: winWidth / 2,
				height: winHeight / 2
			});
			this.popupWin.fadeIn();
			this.popupWin.css({
				width: viewWidth,
				height: viewHeigth,
				marginLeft: - viewWidth / 2,
				top: - viewHeigth
			}).animate({
				top: (winHeight - viewHeigth) / 2
			}, function(){
				__this__.loadImgSize(src);
			});
		},
		loadImgSize: function(src){
			// get the size of image
			var __this__ = this;
			this.image.css({
				// clean the original size of image view
				width: 'auto',
				height: 'auto'
			});
			this.preLoadImg(src, function(){
				__this__.image.attr('src', src);
				var imgWidth = __this__.image.width(),
					imgHeight = __this__.image.height();
				__this__.changeImg(imgWidth, imgHeight);
			});
		},
		preLoadImg: function(src, callback){
			// load the image, and callback after loading
			var img = new Image();
			img.onload = function(){
				callback();
			}
			img.src = src;
		},
		changeImg: function(width, height){
			// set the visable image height and width
			var __this__ = this,
				winWidth = $(window).width(),
				winHeight = $(window).height(),
				// scale the image if it's too large 
			    scale = Math.min(winWidth / (width + 10), winHeight / (height + 10), 1);
			width *= scale;
			height *= scale;
			this.picArea.animate({
				width: width,
				height: height - 10
			});
			this.popupWin.animate({
				width: width,
				height: height -10,
				marginLeft: - width / 2,
				top: (winHeight - height) / 2
			}, function(){
				__this__.image.css({
					width: width,
					height: height
				}).fadeIn();
				// __this__.captionText.text(__this__.grou)
			});
		},
		getGroup: function (){
			// to get the data of chosen group
			var __this__ = this,
				groupList = this.bodyNode.find("[data-group="+this.groupName+"]");
			groupList.each(function(){
				__this__.groupData.push({
					src: $(this).attr("data-source"),
					id: $(this).attr("data-id"),
					caption: $(this).attr("data-caption")
				});
			});			
		}
	}
	window.Lightbox = Lightbox;
})(jQuery);