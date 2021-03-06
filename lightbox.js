;(function($){
	function Lightbox(){		
		var __this__ = this;
		// create nodes of mask and popup window
		this.mask = $('<div id="lightbox-mask">');
		this.popupWin = $('<div id="lightbox-popup-win">');
		// cache of body node
		this.bodyNode = $('body');
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
		this.flag = true;
		this.index = null;
		this.bodyNode.delegate('.js-lightbox, [data-role="lightbox"]', 'click', function(events){
			// delegate the click events to the body
			events.stopPropagation();
			__this__.groupName = $(this).attr('data-group');
			__this__.getGroup();
			__this__.initLightbox($(this));
		});

		// add close function of mask
		this.mask.click(function(){
			$(this).fadeOut();
			__this__.popupWin.fadeOut();
			__this__.clearFlag = false;
		});
		// add close function of close button
		this.closeBtn.click(function(){
			__this__.mask.fadeOut()
			__this__.popupWin.fadeOut();
			__this__.clearFlag = false;
		});
		// bind events of prev and next button
		this.nextBtn.hover(function(){
			if(!$(this).hasClass("disabled") && __this__.groupDataLength > 1){
				$(this).addClass("lightbox-next-show");
			}
		}, function(){
			$(this).removeClass("lightbox-next-show");
		}).click(function(e){
			if(!$(this).hasClass("disabled") && __this__.flag){
				__this__.flag = false;
				e.stopPropagation();
				__this__.goto("next");
			}
		});
		this.prevBtn.hover(function(){
			if(!$(this).hasClass("disabled") && __this__.groupDataLength > 1){
				$(this).addClass("lightbox-prev-show");
			}
		}, function(){
			$(this).removeClass("lightbox-prev-show");
		}).click(function(e){
			if(!$(this).hasClass("disabled") && __this__.flag){
				__this__.flag = false;
				e.stopPropagation();
				__this__.goto("prev");
			}
		});
		var timer = null;
		this.clearFlag = true;
		$(window).resize(function(){
			if(__this__.index != null){
				if(__this__.clearFlag){
					window.clearTimeout(timer);				
					timer = window.setTimeout(function(){
						__this__.loadImgSize(__this__.groupData[__this__.index].src);
					}, 500)
				}
			}
		});
	}
	Lightbox.prototype = {
		renderDOM: function(){
			var strDOM= '<div class="lightbox-pic-area">' +
						'<span class="lightbox-btn lightbox-prev"></span>' +
						'<img class="lightbox-image" src="#" width="100%">' +
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
			this.captionArea.hide();					
			this.image.hide();
			this.mask.fadeIn();			
			// get the current index
			this.index = this.getIndexOf(id);
			this.groupDataLength = this.groupData.length;
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
				__this__.clearFlag = true;
			});
			if(this.groupDataLength > 1){
				if(this.index === 0){
					this.prevBtn.addClass('disabled');					
					this.nextBtn.removeClass('disabled');
				}else if(this.index === this.groupDataLength - 1){
					this.prevBtn.removeClass('disabled');
					this.nextBtn.addClass('disabled');
				}else{
					this.prevBtn.removeClass('disabled');
					this.nextBtn.removeClass('disabled');
				}
			}
		},
		loadImgSize: function(src){	
			// get the size of image			
			this.image.hide();
			this.captionArea.hide();
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
				__this__.captionArea.fadeIn();
				__this__.flag = true;				
			});
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text("current index: " + (this.index + 1) + " of " + this.groupDataLength)
		},
		getGroup: function (){
			// to get the data of chosen group
			var __this__ = this,
				groupList = this.bodyNode.find("[data-group="+this.groupName+"]");
			// empty the past groupData
			this.groupData.length = 0;
			groupList.each(function(){
				__this__.groupData.push({
					src: $(this).attr("data-source"),
					id: $(this).attr("data-id"),
					caption: $(this).attr("data-caption")
				});
			});			
		},
		getIndexOf: function(id){
			// get the index of clicked picture
			var index = 0;
			$(this.groupData).each(function(i){
				index = i;
				if(this.id === id){
					return false;
				}
			});
			return index;
		},
		goto: function(dir){
			this.image.hide();
			this.captionArea.hide();
			if(dir == "next"){
				this.index ++;
				if(this.index >= (this.groupDataLength - 1)){
					this.nextBtn.addClass("disabled").removeClass("lightbox-next-show");
				}
				if(this.index != 0){
					this.prevBtn.removeClass("disabled");
				};
				this.loadImgSize(this.groupData[this.index].src);
			}else if(dir == "prev"){
				this.index --;
				if(this.index <= 0){
					this.prevBtn.addClass("disabled").removeClass("lightbox-prev-show");
				}
				if(this.index != (this.groupDataLength - 1)){
					this.nextBtn.removeClass("disabled");
				}
				this.image.hide();
				this.loadImgSize(this.groupData[this.index].src);
			}
		}
	}
	window.Lightbox = Lightbox;
})(jQuery);