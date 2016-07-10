document.addEventListener('DOMContentLoaded', function() {
	var galleryElement = document.getElementsByClassName('gallery')[0];
	var workspaceElement = document.getElementsByClassName('workspace')[0];
	var galleryImagesElement = document.getElementsByClassName('gallery-images')[0];
	workspaceElement.style.height = window.innerHeight - 250 + 'px';
	workspaceElement.addEventListener('dragover', handleDragOver);
	workspaceElement.addEventListener('drop', handleDrop);
	var currentDraggedElement, offsetMouseClickX, offsetMouseClickY, resizeCtrlDragged = false;
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
		currentDraggedElement = this;
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("id", this.id);
		e.dataTransfer.setData("src", this.src);
		e.dataTransfer.setData("width", this.clientWidth);
		e.dataTransfer.setData("height", this.clientHeight);
	}

	function handleDrop(e) {
		if(!resizeCtrlDragged) {
			var src = e.dataTransfer.getData('src');
			var id = e.dataTransfer.getData('id');
			var height = e.dataTransfer.getData('height');
			var width = e.dataTransfer.getData('width');
			var workspaceImg = document.createElement('img');
			workspaceImg.style["left"] = e.clientX - offsetMouseClickX + 'px';
			workspaceImg.style["top"] = e.clientY - offsetMouseClickY + 'px';
			workspaceImg.draggable = "true";
			workspaceImg.id = 'workspace-' + id;
			workspaceImg.style.height = height + 'px';
			workspaceImg.style.width = width + 'px';
			workspaceImg.addEventListener('dragstart', handleDragStart);
			workspaceImg.addEventListener('click', handleClick);
			workspaceImg.classList.add('workspace-image');
			workspaceImg.src = src;
			this.appendChild(workspaceImg);
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

	function handleResizeControlDrag(e) {
		resizeCtrlDragged = true;
		var toBeDraggedImg = document.getElementById(e.target.dataset.imgId);
		var toBeDraggedImgCoordinates = toBeDraggedImg.getBoundingClientRect();
		var resizeDirection = e.target.dataset.direction;
		hideOtherResizeControls(e.target.dataset.direction, e.target.dataset.imgId, toBeDraggedImg);
		switch(resizeDirection) {
			case "right-middle":
								var newWidth = e.clientX - toBeDraggedImgCoordinates.left;
								e.target.style.left = e.clientX + 'px';
								toBeDraggedImg.style.width = newWidth + 'px';
								break;

			case "left-middle":
								var newWidth = toBeDraggedImg.clientWidth + toBeDraggedImgCoordinates.left - e.clientX;
								if(e.clientX && newWidth > 0) {
									e.target.style.left = e.clientX + 'px';
									toBeDraggedImg.style.width = newWidth + 'px';
									toBeDraggedImg.style.left = e.clientX + 'px';
								}
								break;

			case "top-middle":
								var newHeight = toBeDraggedImg.clientHeight + toBeDraggedImgCoordinates.top - e.clientY;
								if(e.clientY && newHeight > 0) {
									e.target.style.top = e.clientY + 'px';
									toBeDraggedImg.style.height = newHeight + 'px';
									toBeDraggedImg.style.top = e.clientY + 'px';
								}
								break;

			case "bottom-middle":
								var newHeight = e.clientY - toBeDraggedImgCoordinates.top;
								if(e.clientY && newHeight > 0) {
									e.target.style.top = e.clientY + 'px';
									toBeDraggedImg.style.height = newHeight + 'px';
								}
								break;

			case "top-right":
								var newWidth = e.clientX - toBeDraggedImgCoordinates.left;
								var newHeight = toBeDraggedImg.clientHeight + toBeDraggedImgCoordinates.top - e.clientY;
								e.target.style.left = e.clientX + 'px';
								toBeDraggedImg.style.width = newWidth + 'px';
								if(e.clientY && newHeight > 0) {
									e.target.style.top = e.clientY + 'px';
									toBeDraggedImg.style.height = newHeight + 'px';
									toBeDraggedImg.style.top = e.clientY + 'px';
								}
								break;

			case "top-left":
								var newWidth = toBeDraggedImg.clientWidth + toBeDraggedImgCoordinates.left - e.clientX;
								var newHeight = toBeDraggedImg.clientHeight + toBeDraggedImgCoordinates.top - e.clientY;
								if(e.clientX && newWidth > 0) {
									e.target.style.left = e.clientX + 'px';
									toBeDraggedImg.style.width = newWidth + 'px';
									toBeDraggedImg.style.left = e.clientX + 'px';
								}
								if(e.clientY && newHeight > 0) {
									e.target.style.top = e.clientY + 'px';
									toBeDraggedImg.style.height = newHeight + 'px';
									toBeDraggedImg.style.top = e.clientY + 'px';
								}
								break;

			case "bottom-left": 
								var newWidth = toBeDraggedImg.clientWidth + toBeDraggedImgCoordinates.left - e.clientX;
								var newHeight = e.clientY - toBeDraggedImgCoordinates.top;
								if(e.clientX && newWidth > 0) {
									e.target.style.left = e.clientX + 'px';
									toBeDraggedImg.style.width = newWidth + 'px';
									toBeDraggedImg.style.left = e.clientX + 'px';
								}
								if(e.clientY && newHeight > 0) {
									e.target.style.top = e.clientY + 'px';
									toBeDraggedImg.style.height = newHeight + 'px';
								}
								break;

			case "bottom-right": 
								var newWidth = e.clientX - toBeDraggedImgCoordinates.left;
								var newHeight = e.clientY - toBeDraggedImgCoordinates.top;
								e.target.style.left = e.clientX + 'px';
								toBeDraggedImg.style.width = newWidth + 'px';
								if(e.clientY && newHeight > 0) {
									e.target.style.top = e.clientY + 'px';
									toBeDraggedImg.style.height = newHeight + 'px';
								}
								break;																						
		}
	}

	function handleResizeControlDragEnd(e) {
		var imgElement = document.getElementById(e.target.dataset['imgId']);
		e.target.remove();
		imgElement.click();
	}

	function handleClick(e) {
		var workspaceSelectedImg = e.target;
		if(!workspaceSelectedImg.classList.contains('selected-workspace-image')) {
			clearOldSelectedImage();
			workspaceSelectedImg.classList.add('selected-workspace-image');
			var workspaceSelectedImgCoordinates = this.getBoundingClientRect();
			var workspaceSelectedImgWidth = workspaceSelectedImg.clientWidth;
			var workspaceSelectedImgHeight = workspaceSelectedImg.clientHeight;
			var resizeCtrls = [];

			["top-left", "top-middle", "top-right", "right-middle", "bottom-right", "bottom-middle", "bottom-left", "left-middle"].forEach(function(direction, i) {
				var resizeCtrl = document.createElement('div');
				resizeCtrl.classList.add('resize-control');
				resizeCtrl.draggable = "true";
				resizeCtrl.dataset['imgId'] = workspaceSelectedImg.id;
				resizeCtrl.addEventListener("drag", handleResizeControlDrag);
				resizeCtrl.addEventListener("dragend", handleResizeControlDragEnd);
				switch(direction) {
					case "right-middle": 
							resizeCtrl.classList.add('resize-control-ew');
							resizeCtrl.dataset['direction'] = 'right-middle';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + workspaceSelectedImgHeight/2 + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + workspaceSelectedImgWidth + 'px';
							workspaceElement.appendChild(resizeCtrl);
							break;

					case "left-middle":
							resizeCtrl.classList.add('resize-control-ew');
							resizeCtrl.dataset['direction'] = 'left-middle';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + workspaceSelectedImgHeight/2 + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + 'px';
							workspaceElement.appendChild(resizeCtrl);
							break;

					case "top-middle":
							resizeCtrl.classList.add('resize-control-ns');
							resizeCtrl.dataset['direction'] = 'top-middle';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + workspaceSelectedImgWidth/2 + 'px';
							workspaceElement.appendChild(resizeCtrl);
							break;

					case "top-right":
							resizeCtrl.classList.add('resize-control-nesw');
							resizeCtrl.dataset['direction'] = 'top-right';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + workspaceSelectedImgWidth + 'px';
							workspaceElement.appendChild(resizeCtrl);
							break;

					case "top-left":
							resizeCtrl.classList.add('resize-control-nwse');
							resizeCtrl.dataset['direction'] = 'top-left';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + 'px';
							workspaceElement.appendChild(resizeCtrl);
							break;

					case "bottom-right":
							resizeCtrl.classList.add('resize-control-nwse');
							resizeCtrl.dataset['direction'] = 'bottom-right';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + workspaceSelectedImgHeight + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + workspaceSelectedImgWidth + 'px';
							workspaceElement.appendChild(resizeCtrl);
							break;

					case "bottom-left":
							resizeCtrl.classList.add('resize-control-nesw');
							resizeCtrl.dataset['direction'] = 'bottom-left';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + workspaceSelectedImgHeight + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + 'px';
							workspaceElement.appendChild(resizeCtrl);
							break;

					case "bottom-middle":
							resizeCtrl.classList.add('resize-control-ns');
							resizeCtrl.dataset['direction'] = 'bottom-middle';
							resizeCtrl.style.top = workspaceSelectedImgCoordinates.top + workspaceSelectedImgHeight + 'px';
							resizeCtrl.style.left = workspaceSelectedImgCoordinates.left + workspaceSelectedImgWidth/2 +  'px';
							workspaceElement.appendChild(resizeCtrl);
							break;
				}	
			});
		}
	}

	function handleBlur(e) {
		if(!(e.target.classList.contains('selected-workspace-image') || e.target.classList.contains('resize-control'))) {
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
		img.classList.remove('selected-workspace-image');
	}

	function clearOldSelectedImage() {
		var oldWorkSpaceImg = document.getElementsByClassName('selected-workspace-image')[0];
		if(oldWorkSpaceImg) {
			oldWorkSpaceImg.classList.remove('selected-workspace-image');
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
