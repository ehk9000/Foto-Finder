// QuerySelectors
var photosArray = JSON.parse(localStorage.getItem('uploads')) || [];
var addToAlbum = document.querySelector('.add-btn');
var viewFavsBtn = document.querySelector('.view-fav-btn');
var bodyClick = document.querySelector('.main-style');
var input = document.querySelector('#image-upload');
var bodyClick = document.querySelector('.main-container');
var search = document.querySelector('.search-bar-style')
var title = document.querySelector('#title-input');
var caption = document.querySelector('#caption-input');
var reader = new FileReader();


// EVENT LISTENERS
addToAlbum.addEventListener('click', loadImg);
bodyClick.addEventListener('click', photoButtonListener);
bodyClick.addEventListener('focusout', saveContent);
search.addEventListener('keyup', searchPhotos);
title.addEventListener('input', saveStatus);
caption.addEventListener('input', saveStatus);
input.addEventListener('input', saveStatus);
viewFavsBtn.addEventListener('click', showFaves)


// FUNCTIONS
loadAlbum(photosArray);

function createPhoto(e) {
  var title = document.querySelector('#title-input').value
  var caption = document.querySelector('#caption-input').value
  var newPhoto = new Photo (Date.now(), title, caption, e.target.result);
  clearInputs();
  photosArray.push(newPhoto);
  newPhoto.saveToStorage(photosArray)
  publishPhoto(newPhoto);
}

function loadImg() {
  if (input.files[0]) {
    reader.readAsDataURL(input.files[0]);
    reader.onload = createPhoto
  }
}

function publishPhoto(newPhotoObj) {
  var photoContainer = document.querySelector('.main-container');
  var text = `<article class="image-card" data-id=${newPhotoObj.photoId}>
    <h3 contenteditable="true" data-content="title">${newPhotoObj.title}</h3>
    <img  class="uploaded-photo-style" src=${newPhotoObj.file} alt="test">
    <p contenteditable="true" class="caption-style" data-content="caption">${newPhotoObj.caption}</p>
    <section class="image-btn-style">
      <img class="photo-btns delete-btn" src="./images/delete.svg" alt="delete button">
      <img class="photo-btns fav-btn"  data-fav=${newPhotoObj.favorite} src="./images/favorite.svg" alt="favorite button unchecked">
    </section>
    </article>`
    photoContainer.insertAdjacentHTML('afterbegin', text);
}

function loadAlbum(prsArray) {
  photosArray = [];
  prsArray.forEach(function(prsPhoto) {
    var newPhotoWithMethods = new Photo(prsPhoto.photoId, prsPhoto.title, prsPhoto.caption, prsPhoto.file, prsPhoto.favorite);
    publishPhoto(newPhotoWithMethods);
    photosArray.push(newPhotoWithMethods);
    loadFavs(prsArray);
    addToAlbum.disabled = true
  })
}

function saveStatus() {
  if (title.value && caption.value && input.files[0]) {
    addToAlbum.disabled = false;
  } else {
    addToAlbum.disabled = true;
  }
}

function loadFavs(prsArray) {
  var favorites = document.querySelectorAll('.fav-btn');
   for (var i = 0; i < favorites.length; i++){
    if (JSON.parse(favorites[i].dataset.fav)) {
      showFav(favorites[i]);
    }
  }
}

function photoButtonListener(e) {
  if (e.target.classList.contains('delete-btn')){
    deletePhoto(e);
  } else if (e.target.classList.contains('fav-btn')) {
    favClick(e);
  }
  else {
    return;
  }
}

function deletePhoto(e) {
  var photo = e.target.parentElement.parentElement;
  var targetPhoto = findPhoto(e);
  targetPhoto.deleteFromStorage();
  photo.remove();
}

function findPhoto(e) {
  var photo = e.target.closest('article');
  var photoId = parseInt(photo.getAttribute('data-id'));
  return photosArray.find(function(photos) {
    return photos.photoId === photoId;
  });
}

function saveContent(e) {
  var element = e.target;
  var text = e.target.textContent;
  var targetPhoto = findPhoto(e);
  var inputType = element.dataset.content;
    targetPhoto[inputType] = text;
  targetPhoto.updatePhoto();
  targetPhoto.saveToStorage(photosArray);
}

function favClick(e) {
  var element = e.target;
  var targetPhoto = findPhoto(e);
  if (!targetPhoto.favorite) {
    showFav(element);
    activateFav(targetPhoto);
    } else {
      hideFav(element);
      deactivateFav(targetPhoto);
    }
    targetPhoto.updatePhoto();
    targetPhoto.saveToStorage(photosArray);
}

function deactivateFav(targetPhoto) {
  (targetPhoto.favorite = false);
  targetPhoto.updatePhoto();
  targetPhoto.saveToStorage(photosArray);
}

function showFav(element) {
  element.setAttribute('src', './images/favorite-active.svg');
}

function hideFav(element) {
  element.setAttribute('src', './images/favorite.svg');
}

function activateFav(targetPhoto) {
  (targetPhoto.favorite = true);
}

function clearInputs() {
  title.value = '';
  caption.value = '';
}

function showFaves(e) {
  var show = viewFavsBtn.value;
  var regex = new RegExp(show, 'i');
  var photoFavs = [];
  clearPhotos();
  for (let i = 0; i < photosArray.length; i ++) {
    if (photosArray[i].favorite == true) {
      photoFavs.push(photosArray[i]);
      publishPhoto(photosArray[i]);
      loadFavs(photosArray[i]);
    }
  }
}

function searchPhotos(e) {
  var currentSearch = e.target.value;
  var regex = new RegExp(currentSearch, 'i');
  var photoMatches = [];
  clearPhotos();
  for (let i = 0; i < photosArray.length; i++) {
    if (regex.test(photosArray[i].title) || regex.test(photosArray[i].caption)) {
      photoMatches.push(photosArray[i]);
      publishPhoto(photosArray[i]);
    }
  }
}

function clearPhotos() {
  var photoContainer = document.querySelector('.main-container');
  while (photoContainer.hasChildNodes()){
    photoContainer.removeChild(photoContainer.lastChild);
  }
}
