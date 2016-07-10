;(function() {
	document.addEventListener('DOMContentLoaded', function() {
		var galleryElement = document.getElementsByClassName('gallery')[0];
		var workspaceElement = document.getElementsByClassName('workspace')[0];
		var galleryImagesElement = document.getElementsByClassName('gallery-images')[0];
		workspaceElement.style.height = window.innerHeight - 250 + 'px';
		workspaceElement.addEventListener('dragover', handleDragOver);
		workspaceElement.addEventListener('drop', handleDrop);
		var currentDraggedElement, offsetMouseClickX, offsetMouseClickY, resizeCtrlDragged = false, rotateCtrlDragged = false;
		document.addEventListener('click', handleBlur);

		function handleUploadedFile(evt) {
			var newImageForGallery = evt.target.files[0];
			var newImgGallery = document.createElement('img');
			newImgGallery.id = newImageForGallery.name.split('.')[0] + (new Date()).getTime();
			newImgGallery.className += " gallery-image";
			newImgGallery.draggable = "true";
			newImgGallery.addEventListener('dragstart', handleDragStart);
			var reader = new FileReader();
			reader.onload = function(e) {
				newImgGallery.src = e.target.result;
				galleryImagesElement.appendChild(newImgGallery);
			}
			reader.readAsDataURL(newImageForGallery);
		}

		function handleDragStart(e) {
			var imageCoordinates = this.getBoundingClientRect();
			offsetMouseClickX = e.clientX - imageCoordinates.left;
			offsetMouseClickY = e.clientY - imageCoordinates.top; 
			var imgElement = this.getElementsByTagName('img')[0];
			currentDraggedElement = this;
			var src = imgElement ? imgElement.src : this.src;
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("id", this.id);
			e.dataTransfer.setData("src", src);
			e.dataTransfer.setData("width", this.clientWidth);
			e.dataTransfer.setData("height", this.clientHeight);
		}

		function handleDrop(e) {
			if(!resizeCtrlDragged && !rotateCtrlDragged) {
				var src = e.dataTransfer.getData('src');
				var id = e.dataTransfer.getData('id');
				var height = e.dataTransfer.getData('height');
				var width = e.dataTransfer.getData('width');
				var workspaceImg = document.createElement('img');
				var workspaceImgContainer = document.createElement('div');
				workspaceImgContainer.style["left"] = e.clientX - offsetMouseClickX + 'px';
				workspaceImgContainer.style["top"] = e.clientY - offsetMouseClickY + 'px';
				workspaceImgContainer.draggable = "true";
				workspaceImgContainer.id = 'workspace-' + id;
				workspaceImgContainer.style.height = height + 'px';
				workspaceImgContainer.style.width = width + 'px';
				workspaceImgContainer.addEventListener('dragstart', handleDragStart);
				workspaceImgContainer.addEventListener('click', handleClick);
				workspaceImgContainer.classList.add('workspace-image-container');
				workspaceImg.classList.add('workspace-image');
				workspaceImg.src = src;
				workspaceImgContainer.appendChild(workspaceImg);
				this.appendChild(workspaceImgContainer);
				currentDraggedElement.remove();
				if(e.stopPropogation) {
					e.stopPropogation();
				}
				return false;
			}
		}

		function handleDragOver(e) {
		  	if (e.preventDefault) {
		    		e.preventDefault();
		  	}
		  	e.dataTransfer.dropEffect = 'move';
		  	return false;
		}

		function handleRotateControlDrag(e) {
			var degree = Math.atan(e.offsetY/e.offsetX)*180/Math.PI;
			var imgElement = document.getElementById(e.target.dataset.imgId);
			imgElement.style.transform = "rotate(" + degree  + "deg)";
			rotateCtrlDragged = true
		}

		function handleRotateControlDragEnd(e) {
			rotateCtrlDragged = false;
		} 

		function handleResizeControlDrag(e) {
			resizeCtrlDragged = true;
			var toBeDraggedImg = document.getElementById(e.target.dataset.imgId);
			var toBeDraggedImgCoordinates = toBeDraggedImg.getBoundingClientRect();
			var resizeDirection = e.target.dataset.direction;
			hideOtherResizeControls(e.target.dataset.direction, e.target.dataset.imgId, toBeDraggedImg);
			switch(resizeDirection) {

				case "right-middle":
									if(e.offsetX !== 0) {
										toBeDraggedImg.style.width = e.offsetX + toBeDraggedImg.clientWidth + 'px';
									}
									break;

				case "left-middle":
									if(e.offsetX !== 0) {
										toBeDraggedImg.style.left = toBeDraggedImgCoordinates.left + e.offsetX + 'px';
										toBeDraggedImg.style.width = toBeDraggedImg.clientWidth - e.offsetX + 'px';
									}
									break;

				case "top-middle":
									if(e.offsetY !== 0) {
										toBeDraggedImg.style.top = toBeDraggedImgCoordinates.top + e.offsetY + 'px';
										toBeDraggedImg.style.height = toBeDraggedImg.clientHeight - e.offsetY + 'px';
									}
									break;

				case "bottom-middle":
									if(e.offsetY !== 0) {
										toBeDraggedImg.style.height = e.offsetY + toBeDraggedImg.clientHeight + 'px';
									}
									break;

				case "top-right":
									if(e.offsetX !== 0 && e.offsetY !== 0 && Math.abs(e.offsetY) < toBeDraggedImgCoordinates.top) {
										toBeDraggedImg.style.width = e.offsetX + toBeDraggedImg.clientWidth + 'px';
										toBeDraggedImg.style.top = toBeDraggedImgCoordinates.top + e.offsetY + 'px';
										toBeDraggedImg.style.height = toBeDraggedImg.clientHeight - e.offsetY + 'px';
									}
									break;

				case "top-left":
									if(e.offsetX !== 0 && e.offsetY !== 0 && Math.abs(e.offsetX) < toBeDraggedImgCoordinates.left && Math.abs(e.offsetY) < toBeDraggedImgCoordinates.top) {
										toBeDraggedImg.style.left = toBeDraggedImgCoordinates.left + e.offsetX + 'px';
										toBeDraggedImg.style.width = toBeDraggedImg.clientWidth - e.offsetX + 'px';
										toBeDraggedImg.style.top = toBeDraggedImgCoordinates.top + e.offsetY + 'px';
										toBeDraggedImg.style.height = toBeDraggedImg.clientHeight - e.offsetY + 'px';	
									}
									break;

				case "bottom-left": 
									if(e.offsetX !== 0 && e.offsetY !== 0 && Math.abs(e.offsetX) < toBeDraggedImgCoordinates.left) {
										toBeDraggedImg.style.left = toBeDraggedImgCoordinates.left + e.offsetX + 'px';
										toBeDraggedImg.style.width = toBeDraggedImg.clientWidth - e.offsetX + 'px';
										toBeDraggedImg.style.height = e.offsetY + toBeDraggedImg.clientHeight + 'px';	
									}
									break;

				case "bottom-right": 
									if(e.offsetX !== 0 && e.offsetY !== 0) {
										toBeDraggedImg.style.width = e.offsetX + toBeDraggedImg.clientWidth + 'px';
										toBeDraggedImg.style.height = e.offsetY + toBeDraggedImg.clientHeight + 'px';	
									}
									break;																						
			}
		}

		function handleResizeControlDragEnd(e) {
			var imgContainerElement = document.getElementById(e.target.dataset['imgId']);
			imgContainerElement.getElementsByTagName('img')[0].click();
		}

		function handleClick(e) {
			var workspaceSelectedImgContainer = e.target.classList.contains('workspace-image-container') ? e.target : e.target.parentNode;
			if(!workspaceSelectedImgContainer.classList.contains('selected-workspace-image-container')) {
				clearOldSelectedImage();
				workspaceSelectedImgContainer.classList.add('selected-workspace-image-container');
				var workspaceSelectedImgContainerCoordinates = this.getBoundingClientRect();
				var workspaceSelectedImgContainerWidth = workspaceSelectedImgContainer.clientWidth;
				var workspaceSelectedImgContainerHeight = workspaceSelectedImgContainer.clientHeight;
				var resizeCtrls = [];

				["top-left", "top-middle", "top-right", "right-middle", "bottom-right", "bottom-middle", "bottom-left", "left-middle"].forEach(function(direction, i) {
					var resizeCtrl = document.createElement('div');
					resizeCtrl.classList.add('resize-control');
					resizeCtrl.draggable = "true";
					resizeCtrl.dataset['imgId'] = workspaceSelectedImgContainer.id;
					resizeCtrl.addEventListener("drag", handleResizeControlDrag);
					resizeCtrl.addEventListener("dragend", handleResizeControlDragEnd);

					switch(direction) {
						case "right-middle": 
								resizeCtrl.classList.add('resize-control-ew');
								resizeCtrl.dataset['direction'] = 'right-middle';
								resizeCtrl.style.top = workspaceSelectedImgContainerHeight/2 + 'px';
								resizeCtrl.style.right = '0px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;

						case "left-middle":
								resizeCtrl.classList.add('resize-control-ew');
								resizeCtrl.dataset['direction'] = 'left-middle';
								resizeCtrl.style.top = workspaceSelectedImgContainerHeight/2 + 'px';
								resizeCtrl.style.left = '0px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;

						case "top-middle":
								resizeCtrl.classList.add('resize-control-ns');
								resizeCtrl.dataset['direction'] = 'top-middle';
								resizeCtrl.style.top = '0px';
								resizeCtrl.style.left = workspaceSelectedImgContainerWidth/2 + 'px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;

						case "top-right":
								resizeCtrl.classList.add('resize-control-nesw');
								resizeCtrl.dataset['direction'] = 'top-right';
								resizeCtrl.style.top = '0px';
								resizeCtrl.style.right = '0px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;

						case "top-left":
								resizeCtrl.classList.add('resize-control-nwse');
								resizeCtrl.dataset['direction'] = 'top-left';
								resizeCtrl.style.top = '0px';
								resizeCtrl.style.left = '0px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;

						case "bottom-right":
								resizeCtrl.classList.add('resize-control-nwse');
								resizeCtrl.dataset['direction'] = 'bottom-right';
								resizeCtrl.style.bottom = '0px';
								resizeCtrl.style.right = '0px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;

						case "bottom-left":
								resizeCtrl.classList.add('resize-control-nesw');
								resizeCtrl.dataset['direction'] = 'bottom-left';
								resizeCtrl.style.bottom = '0px';
								resizeCtrl.style.left = '0px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;

						case "bottom-middle":
								resizeCtrl.classList.add('resize-control-ns');
								resizeCtrl.dataset['direction'] = 'bottom-middle';
								resizeCtrl.style.bottom = '0px';
								resizeCtrl.style.left = workspaceSelectedImgContainerWidth/2 +  'px';
								workspaceSelectedImgContainer.appendChild(resizeCtrl);
								break;
					}	
				});

				/*var rotateCtrl = document.createElement('div');
				rotateCtrl.classList.add('rotate-control');
				rotateCtrl.draggable = "true";
				rotateCtrl.dataset['imgId'] = workspaceSelectedImgContainer.id;
				rotateCtrl.addEventListener("drag", handleRotateControlDrag);
				rotateCtrl.addEventListener("dragend", handleRotateControlDragEnd);
				rotateCtrl.style.top = '-15px';
				rotateCtrl.style.left = workspaceSelectedImgContainerWidth/2 + 'px';
				workspaceSelectedImgContainer.appendChild(rotateCtrl);*/
			}
		}

		function handleBlur(e) {
			if(!(e.target.parentNode.classList.contains('selected-workspace-image-container') || e.target.parentNode.classList.contains('resize-control'))) {
				clearOldSelectedImage();
			}
		}

		function hideOtherResizeControls(direction, imageId, img) {
			var resizeCtrls = Array.prototype.slice.call(document.querySelectorAll('[data-img-id="' + imageId + '"]'));
			resizeCtrls.forEach(function(resizeCtrl) {
				if(resizeCtrl.dataset["direction"] !== direction) {
					resizeCtrl.remove();
				}	
			});
			img.classList.remove('selected-workspace-image-container');
		}

		function clearOldSelectedImage() {
			var oldWorkSpaceImg = document.getElementsByClassName('selected-workspace-image-container')[0];
			if(oldWorkSpaceImg) {
				oldWorkSpaceImg.classList.remove('selected-workspace-image-container');
				var resizeCtrls = Array.prototype.slice.call(document.querySelectorAll('[data-img-id="' + oldWorkSpaceImg.id + '"]'));
				resizeCtrls.forEach(function(resizeCtrl) {
					resizeCtrl.remove();
				});
				resizeCtrlDragged = false;
			}
		}

		var init = function() {
			var fileUploadElement = document.getElementById('upload-file');
			fileUploadElement.addEventListener('change', handleUploadedFile)
		}();
	});
})();
