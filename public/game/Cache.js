
var Cache = {
  Stash: [],
   
  getImage: function(image) {
    // Get cache'd image
    for (var i = 0; i < this.Stash.length; i++) {
        if(this.Stash[i].src == document.URL + image || this.Stash[i].src == image) {
            return this.Stash[i];
        }
    }
    // If not try to add it
    var tempImage = new Image();
    tempImage.src = image;
    if(tempImage) { // Check for undefined
      this.Stash.push(tempImage);
      console.log("Added: " + image + " to cache stash")
    }
        return tempImage;
    },
}