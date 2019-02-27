class Photo {
  constructor(photoId, title, caption, file, favorite) {
    this.photoId = photoId;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage(array) {
    localStorage.setItem('uploads', JSON.stringify(array));
  }

  deleteFromStorage() {
    var index = photosArray.indexOf(this);
    photosArray.splice(index, 1);
    if (this === undefined) {
      photosArray = [];
      localStorage.clear();
    } else {
      this.saveToStorage(photosArray);
    }
  }

  updatePhoto() {
    var index = photosArray.indexOf(this)
    photosArray.splice(index, 1, this)
  }
}
