var aToZ = (function(){

  var baseURI = "https://ibl.api.bbci.co.uk/ibl/v1/atoz/";

  // create the markup where results will be displayed
  var main = document.getElementById("main");
  var divResults = document.createElement("div");
  divResults.id = "results";
  main.appendChild(divResults);

  // create the markup where pagination for results will be displayed
  var paginationDiv = document.createElement("div");
  paginationDiv.id = "pagination";


  /* after calling httpGet, update baseURIResult as it will be
    used as a base for pagination
  */
  var baseURIResult;


  /*
    Dispay a list of programme titles and images, 
    and paginate those results if there 
    are more than 20
  */

  var displayLetterResults = function (data, page) {

    // if there are results displayed on the page, clear them
    if (divResults.children.length > 0 ) {
      while (divResults.hasChildNodes()) {
        divResults.removeChild(divResults.lastChild);
      }
    }

    // if there is results pagination displayed on the page, clear them
    if (paginationDiv.children.length > 0 ) {
      while (paginationDiv.hasChildNodes()) {
        paginationDiv.removeChild(paginationDiv.lastChild);
      }
    }

    // if there are 20 or less results
    if (data.atoz_programmes.count <= 20) {

      // display the number of results
      // displayResultsCount(data);
      
      var cache = data.atoz_programmes.elements;
      for(var i = 0; i < cache.length; i++) {
        var divMedia = document.createElement("div");
        divMedia.classList.add("media");
        var divMediaLeft = document.createElement("div");
        divMediaLeft.classList.add("media-left");
        var img = document.createElement("img");
        img.src = "http://placehold.it/100x50";
        // img.alt = cache[i].title;
        img.classList.add("media-object");
        divMediaLeft.appendChild(img);
        divMedia.appendChild(divMediaLeft);
        var divMediaBody = document.createElement("div");
        divMediaBody.classList.add("media-body");
        divMediaBody.innerHTML = cache[i].title;
        divMedia.appendChild(divMediaBody);
        divResults.appendChild(divMedia);

      }
    } else {

      // display the number of results
      // displayResultsCount(data);

      var paginationUl = document.createElement("ul");
      paginationUl.classList.add("pagination");
      paginationDiv.appendChild(paginationUl);
      paginationUl.id = "paginationList";
      main.appendChild(paginationDiv);
  
      /* determine the count of programs per letter
        and divide that by the number of items that should
        be displayed by page for pagination
      */
      var pageCounter = function(count) {

        var letter = data.atoz_programmes.character;
        var pages = count/data.atoz_programmes.per_page;

        if(pages % 1 !== 0) {
          pages = Math.ceil(pages);
        }

        pages += 1;

        var ul = document.getElementById("paginationList");
        for (var i = 1; i < pages; i++) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.innerHTML = i;
          a.addEventListener("click", httpGetPaginate);
          li.appendChild(a);
          ul.appendChild(li);
        }

      }(data.atoz_programmes.count);

  

      var items = data.atoz_programmes.per_page;
      for (var j = 0; j < items; j++ ) {
        var divMediaPaged = document.createElement("div");
        divMediaPaged.classList.add("media");
        var divMediaLeft2 = document.createElement("div");
        divMediaLeft2.classList.add("media-left");
        var img2 = document.createElement("img");
        img2.src = "http://placehold.it/100x50";
        // img.alt = data.atoz_programmes.elements[j].title;
        img2.classList.add("media-object");
        divMediaLeft2.appendChild(img2);
        divMediaPaged.appendChild(divMediaLeft2);

        var divMediaBodyPaged = document.createElement("div");
        divMediaBodyPaged.classList.add("media-body");
        divMediaBodyPaged.innerHTML = data.atoz_programmes.elements[j].title;

        divMediaPaged.appendChild(divMediaBodyPaged);
        // divMediaPaged.appendChild(small);
        divResults.appendChild(divMediaPaged);
      }
    }
    
  
  };

  // count and display the number of results
  // optionally allow the user to pull up another page
  // var displayResultsCount = function (data) {

    // var results = data.atoz_programmes.count;
    // var p = document.createElement("p");
    // p.classList.add("resultCount");
    // p.innerHTML = results;
    // divResults.appendChild(p);
  // };

 

  /* 
    Get the letter chosen by the end user
    and pass that letter into an http get request
    to return the results for that letter in a string
  */

  var init = true;

  var httpGet = function (e) {
  
    var lowercase;
  
    if(init === true) {
      lowercase = "a";
      init = false;
    }
    else {
      lowercase = e.target.innerHTML.toLowerCase();
    }
    
    var xmlHttp = new XMLHttpRequest();
    var constructedURL = baseURI + lowercase + "/programmes";
    baseURIResult = constructedURL;
    // console.log(constructedURL);
    xmlHttp.open( "GET", constructedURL, false );
    xmlHttp.send( null );
    if (xmlHttp.status === 200) {
      var data = JSON.parse(xmlHttp.responseText);
      displayLetterResults(data);
    } else {
      console.warn(xmlHttp.responseText);
    }

  };

  /* 
    Get the page number chosen by the end user
    Build that, and the letter being viewed,
    into a GET request
  */

  var httpGetPaginate = function (e) {
 
    var xmlHttp = new XMLHttpRequest();
    var constructedURL = baseURIResult + "?page=" + e.target.innerHTML;
   
    xmlHttp.open( "GET", constructedURL, false );
    xmlHttp.send( null );
    if (xmlHttp.status === 200) {
       var data = JSON.parse(xmlHttp.responseText);
       displayLetterResults(data);
    } else {
      console.warn(xmlHttp.responseText);
    }

  };

  // Build the A to Z navigation
  var populateNavLinks = function () {

    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    var nav = document.getElementById("nav");

    for (var i = 0; i < alphabet.length; i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      li.appendChild(a);
      a.href="#";
      a.innerHTML = alphabet[i].toUpperCase();
      var letter = a.innerHTML;
      a.addEventListener("click", httpGet);
      nav.appendChild(li);
    }

  }();

  // display the "A" results the first time the page is loaded. 
  httpGet("A");

})();
