document.addEventListener('DOMContentLoaded', function() {
	var galleryElement = document.getElementsByClassName('gallery')[0];
	var workspaceElement = document.getElementsByClassName('workspace')[0];
	var galleryImagesElement = document.getElementsByClassName('gallery-images')[0];

	function handleUploadedFile(evt) {
		var newImageForGallery = evt.target.files[0];
		var newImgGallery = document.createElement('img');
		newImgGallery.className += " gallery-image";
		var reader = new FileReader();
		reader.onload = function(e) {
			newImgGallery.src = e.target.result;
			galleryImagesElement.appendChild(newImgGallery);
		}
		reader.readAsDataURL(newImageForGallery);
	}

	var init = function() {
		var fileUploadElement = document.getElementById('upload-file');
		fileUploadElement.addEventListener('change', handleUploadedFile)
	}();
});