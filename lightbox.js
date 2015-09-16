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
		this.image = this.popupWin.find('img.lightbox-imgae');
		this.prevBtn = this.popupWin.find('span.lightbox-prev');
		this.nextBtn = this.popupWin.find('span.lightbox-next');
		this.captionArea = this.popupWin.find('div.lightbox-caption-area');
		this.captionText = this.popupWin.find('p.lightbox-desc');
		this.currentIndex = this.popupWin.find('span.lightbox-index');
		this.closeBtn = this.popupWin.find('span.lightbox-close-btn');
		// console.log(this.picArea.length);
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
						'<span class="lightbox-index">index: 0 of 0</span>' +
						'</div>' +
						'<span class="lightbox-close-btn"></span>' +
						'</div>';
			this.popupWin.html(strDOM);
			this.bodyNode.append(this.mask, this.popupWin);
		}
	}
	window.Lightbox = Lightbox;
})(jQuery);