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
			__this__.initLightbox($(this));
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
		}
	}
	window.Lightbox = Lightbox;
})(jQuery);