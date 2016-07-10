document.addEventListener('DOMContentLoaded', function() {
	var galleryElement = document.getElementsByClassName('gallery')[0];
	var workspaceElement = document.getElementsByClassName('workspace')[0];
	var galleryImagesElement = document.getElementsByClassName('gallery-images')[0];
	workspaceElement.style.height = window.innerHeight - 250 + 'px';
	workspaceElement.addEventListener('dragenter', handleDragEnter);
	workspaceElement.addEventListener('dragover', handleDragOver);
	workspaceElement.addEventListener('dragend', handleDragEnd);
	workspaceElement.addEventListener('drop', handleDrop);
	var currentDraggedElement;

	function handleUploadedFile(evt) {
		var newImageForGallery = evt.target.files[0];
		var newImgGallery = document.createElement('img');
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
		currentDraggedElement = this;
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("src", this.src);
	}

	function handleDragEnter(e) {
		
	} 

	function handleDragEnd(e) {
		console.log(e);
	}

	function handleDrop(e) {
		var src = e.dataTransfer.getData('src');
		var workspaceImg = document.createElement('img');
		workspaceImg.src = src;
		this.appendChild(workspaceImg);
		currentDraggedElement.remove();
		if(e.stopPropogation) {
			e.stopPropogation();
		}
		return false;
	}

	function handleDragOver(e) {
	  	if (e.preventDefault) {
	    		e.preventDefault();
	  	}
	  	e.dataTransfer.dropEffect = 'move';
	  	return false;
	}

	var init = function() {
		var fileUploadElement = document.getElementById('upload-file');
		fileUploadElement.addEventListener('change', handleUploadedFile)
	}();
});