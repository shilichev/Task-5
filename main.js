API_URL =
  "https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=f6146b5aea320305af01030c6fc04c59&user_id=48600090482%40N01&format=json&nojsoncallback=1";

API_URL_PHOTOSET = [
  "https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=f6146b5aea320305af01030c6fc04c59&photoset_id=",
  "&user_id=48600090482%40N01&format=json&nojsoncallback=1",
];

API_URL_PHOTO = [
  "https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=f6146b5aea320305af01030c6fc04c59&photo_id=",
  "&format=json&nojsoncallback=1",
];

onePage = 15;
target = 1;

massiveOfPhotosets = [];
massiveOfPhoto = [];
massiveOfApi = [];
massiveOfMainIdPhoto = [];

obj = {};

const getPhotosets = () => {
  $.ajax({
    url: API_URL,
    dataType: "json",
    success: getPhotosetsList,
  });
};
const getPhotosetsList = (photosetsList) => {
  massiveOfPhotosets = photosetsList.photosets.photoset;
  getApiOfPhotosets(massiveOfPhotosets);
};
const getApiOfPhotosets = (massiveOfPhotosets) => {
  massiveOfPhotosets.forEach((e) => {
    api = API_URL_PHOTOSET[0] + e.id + API_URL_PHOTOSET[1];
    obj = { name: e.title._content, api: api };
    massiveOfPhoto.push(obj);
  });
  newMassive(massiveOfPhoto);
};
// let new_array = arr.map(function callback( currentValue[, index[, array]]) {
//   // Возвращает элемент для new_array
// }[, thisArg])
const newMassive = (massiveOfPhoto) => {
  massiveOfPhoto.forEach((e) => {
    massiveOfApi.push(e.api);
  });

  const requests = [];

  for (i = 0; i < massiveOfApi.length; i++) {
    requests.push(
      $.ajax({
        url: massiveOfApi[i],
        dataType: "json",
        success: getPhotoList,
      })
    );
    // getPhoto(massiveOfApi[i], i, massiveOfApi.length - 1);
    // if (i === massiveOfApi.length - 1) {
    // }
  }
  $.when.apply(undefined, requests).then(function () {
    showResult();
  });
};
getPhotosets();
const getPhotoList = (photo) => {
  mainPhotoApi =
    API_URL_PHOTO[0] + photo.photoset.photo[0].id + API_URL_PHOTO[1];
  massiveOfMainIdPhoto.push(mainPhotoApi);
};
const showResult = () => {
  if (massiveOfMainIdPhoto.length) {
    newArray(massiveOfMainIdPhoto);
  }
};
const newArray = (massiveOfMainIdPhoto) => {
  const requests = [];
  massiveOfMainIdPhoto.forEach((e) => {
    requests.push(
      $.ajax({
        url: e,
        dataType: "json",
        success: getListOfImages,
      })
    );
  });
  $.when.apply(undefined, requests).then(function () {
    showPhotosetsList(target);
    countPages();
  });
};
const arrayOfImg = [];
const getListOfImages = (photo) => {
  arrayOfImg.push(photo.sizes.size[5].source);
};
const showPhotosetsList = (target) => {
  firstPhoto = target * onePage - onePage;
  lastPhoto = target * onePage;
  for (i = firstPhoto; i < lastPhoto; i++) {
    $("div.photosets").append(
      `<div class="photoset" id="${i}">${massiveOfPhotosets[i].title._content}<img class="photoset" src="${arrayOfImg[i]}"></div>`
    );
  }
};
const countPages = () => {
  cnt = Math.ceil(massiveOfPhotosets.length / onePage);
  for (i = 1; i <= cnt; i++) {
    $("div.pages").append(
      `<input type ="button" class= "pageNumber" value="${i}"></input>`
    );
  }
  clicker();
};
const clear = () => {
  $(".photoset").remove();
  console.log(1);
};
const clicker = () => {
  $(".pageNumber").click(function () {
    target = event.target.value;
    clear();
    showPhotosetsList(target);
  });
};
