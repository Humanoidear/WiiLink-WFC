import { loadImage, getIconForGenre } from "/js/helper_functions.js";

export function getRecommendedTitles(mainGenre, x) {
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // Get all titles with the same genre on an array
    var sameGenreTitles = [];
    for (var i = 0; i < x.length; i++) {
      var genre =
        x[i].getElementsByTagName("genre")[0]?.textContent || "Unknown";
      genre = genre.split(",")[0].trim();

      if (mainGenre == genre) {
        var trueName = x[i].getAttribute("name") || "Unknown";
        var tid = x[i].getElementsByTagName("id")[0]?.textContent || "Unknown";
        var disc =
          x[i].getElementsByTagName("disc")[0]?.textContent || "Unknown";
        var publisher =
          x[i].getElementsByTagName("publisher")[0]?.textContent || "Unknown";
        var releaseYear =
          x[i].getElementsByTagName("date")[0]?.getAttribute("year") || "YYYY";
        sameGenreTitles.push({
          title: trueName,
          tid,
          disc,
          publisher,
          releaseYear,
          genre,
        });
      }
    }
    // Shuffle the array
    shuffleArray(sameGenreTitles);

    // Get the first 4 titles
    sameGenreTitles = sameGenreTitles.slice(0, 4);
    document.getElementById("recommendedTitles").innerHTML = "";
    var genreIconClass = getIconForGenre(mainGenre);
    document.getElementById("genreSuggestion").innerHTML =
      '<i class="fas ' +
      genreIconClass +
      '" style="margin-right:5px;"></i> ' +
      mainGenre;

    // Display recommended titles
    sameGenreTitles.forEach(function (game) {
      document.getElementById("recommendedTitles").innerHTML +=
        '<a style="text-decoration:none;" href="/online/' +
        game.tid +
        '" <div class="recommended-title"><img src="' +
        loadImage("cover", game.tid) +
        '" onerror="this.onerror=null; this.src=\'/img/disc_placeholder.png\';" class="img-bg" width="100%"><div style="padding:10px; display:flex; align-items:center; justify-content:space-between;"><img src="' +
        loadImage("disc", game.tid) +
        '" onerror="this.onerror=null; this.src=\'/img/disc_placeholder.png\';" width="70px">' +
        "<div style='text-align:right;'><t style='width:auto; font-family:Gilroy; font-size:20px; text-align:right; text-overflow:ellipsis; line-height:20px; display:block; overflow:hidden;'> " +
        game.title +
        "</t><i>" +
        game.tid +
        "</i></div></div><div style='bottom:0; width:100%; padding:10px; display:flex; justify-content:space-between; position:relative;'><p style='margin-bottom:0px; text-align:left;'><i class='fa fa-code'></i> " +
        game.publisher +
        "</p>" +
        "<p style='margin-bottom:0px; text-align:right;'>" +
        game.releaseYear +
        " <i class='fa fa-calendar'></i></p></div></div>";
    });
  }