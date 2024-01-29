var onlineNow = document.getElementById("online-now");
var enhanced = document.getElementById("enhanced");
var all = document.getElementById("all");
var trueName = "Unknown";
var developer = "Unknown";
var publisher = "Unknown";
var region = "Unknown";
var date = "Unknown";
var month = "Unknown";
var day = "Unknown";
var genre = "Unknown";
var rating = "Unknown";
var languages = "Unknown";
var mainGenre = "Unknown";
var onlineSupport = "Unknown";
var classification = "Unknown";
var wifiPlayers = "Unknown";
var isSupported = "Unknown";
var inputPlayers = "Unknown";
var romName = "Unknown";
var romSize = "Unknown";
var romVersion = "Unknown";
var hash = "Unknown";
var hash2 = "Unknown";
var hash3 = "Unknown";
var imgLang = "Unknown";
var id = "Unknown";

function render(xml, GameID) {
  var xmlDoc = xml.responseXML;
  var x = xmlDoc.getElementsByTagName("game");
  var desiredLang = "EN"; // Replace with the desired language
  for (var i = 0; i < x.length; i++) {
    // Loop through gamelist of gameTDB
    var tid = x[i].getElementsByTagName("id")[0];
    if (tid.childNodes[0].nodeValue.substring(0, 3) === GameID) {
      // Check if the titleid of the query matches the titleid of the gameTDB entry
      var locales = x[i].getElementsByTagName("locale");
      for (var j = 0; j < locales.length; j++) {
        // Loop through available locales
        var region = x[i].getElementsByTagName("region")[0].textContent;
        if (locales[j].getAttribute("lang") === desiredLang) {

          // Get all the data from the XML
          trueName = x[i].getAttribute("name") || "Unknown";
          developer =
            x[i].getElementsByTagName("developer")[0]?.textContent ||
            "Unknown";
          region =
            x[i].getElementsByTagName("region")[0]?.textContent || "Unknown";
          languages =
            x[i].getElementsByTagName("languages")[0]?.textContent ||
            "Unknown";
          publisher =
            x[i].getElementsByTagName("publisher")[0]?.textContent ||
            "Unknown";
          date =
            x[i].getElementsByTagName("date")[0]?.getAttribute("year") ||
            "YYYY";
          month =
            x[i].getElementsByTagName("date")[0]?.getAttribute("month") ||
            "MM";
          day =
            x[i].getElementsByTagName("date")[0]?.getAttribute("day") || "DD";
          genre =
            x[i].getElementsByTagName("genre")[0]?.textContent || "Unknown";
          mainGenre = genre.split(",")[0].trim();
          rating =
            x[i].getElementsByTagName("rating")[0]?.getAttribute("value") ||
            "Unknown";
          classification =
            x[i].getElementsByTagName("rating")[0]?.getAttribute("type") ||
            "Unknown";

          wifiPlayers =
            x[i].getElementsByTagName("wi-fi")[0]?.getAttribute("players") ||
            "Unknown";
          onlineSupport =
            x[i]
              .getElementsByTagName("wi-fi")[0]
              ?.getElementsByTagName("feature") || [];
          isSupported = Array.from(onlineSupport)
            .map((feature) => feature.textContent)
            .join(" | ");

          inputPlayers = x[i]
            .getElementsByTagName("input")[0]
            .getAttribute("players");

          // Get extra data
          romName = x[i].getElementsByTagName("rom")[0].getAttribute("name");
          romSize = (
            x[i].getElementsByTagName("rom")[0].getAttribute("size") /
            1024 /
            1024 /
            1024
          ).toFixed(2);
          romVersion = x[i]
            .getElementsByTagName("rom")[0]
            .getAttribute("version");
          hash = x[i].getElementsByTagName("rom")[0].getAttribute("crc");
          hash2 = x[i].getElementsByTagName("rom")[0].getAttribute("md5");
          hash3 = x[i].getElementsByTagName("rom")[0].getAttribute("sha1");

          id = x[i].getElementsByTagName("id")[0].textContent;

          // Get the correct image URL based on the title's region
          switch (region) {
            case "NTSC-U":
              imgLang = "US";
              break;
            case "PAL":
              imgLang = "EN";
              break;
            case "NTSC-J":
              imgLang = "JA";
              break;
            case "NTSC-K":
              imgLang = "KO";
              break;
          }

          var titleData = [trueName, developer, publisher, region, date, month, day, genre, rating, classification, wifiPlayers, isSupported, inputPlayers, languages, mainGenre, romName, romSize, romVersion, hash, hash2, hash3, imgLang, id];
          return titleData;
        }
      }
      break;
    }
  }
}

function displayTitleData(GameID) {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var titleData = render(this, GameID);
        resolve(titleData);
      } else if (this.readyState == 4) {
        reject('Error: ' + this.status);
      }
    };
    xmlhttp.open("GET", "/xml/wiitdb.xml", true);
    xmlhttp.send();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch the list of all games
  fetch("../json/gamespy_titles.json")
    .then((response) => response.json())
    .then(async (allGames) => {
      // Fetch the list of online games
      fetch("https://api.wfc.wiilink24.com/api/stats")
        .then((response) => response.json())
        .then(async (onlineStats) => {
          // Loop through all games
          for (let game of allGames) {
            // Check if the game is in the list of online games
            if (
              onlineStats[game.GamespyName] &&
              onlineStats[game.GamespyName].online > 0
            ) {
              // If the game is online, display it
              var extraData = [onlineStats[game.GamespyName].online, onlineStats[game.GamespyName].active, onlineStats[game.GamespyName].groups];
              var titleDataReturn = await displayTitleData(game.GameID);
              // Create the HTML elements
              var isBig = "";
              if (extraData[1] > 6) {
                isBig = "grid-column: auto / span 2; grid-row: auto / span 1;";
              } else{
                isBig = "grid-column: auto / span 1; grid-row: auto / span 1";
              }

              onlineNow.innerHTML +=
                '<a href="/online/' + titleDataReturn[22] + '" class="card-online" style="' + isBig + '"><img src="https://art.gametdb.com/wii/cover/US/' +
                titleDataReturn[22] +
                '.png" onerror="this.onerror=null; this.src=\'https://art.gametdb.com/wii/cover/EN/' +
                titleDataReturn[22] +
                ".png'; this.onerror=function(){this.src='https://art.gametdb.com/wii/cover/JA/" +
                titleDataReturn[22] +
                ".png'; this.onerror=function(){this.src='https://art.gametdb.com/wii/cover/KO/" +
                titleDataReturn[22] +
                '.png\'; this.onerror=function(){this.src=\'/img/disc_placeholder.png\';};};};" id="card-bg" width="100%"><div style="display:flex; align-items:center; justify-content:space-between;"><img src="https://art.gametdb.com/wii/disc/US/' +
                titleDataReturn[22] +
                '.png" onerror="this.onerror=null; this.src=\'https://art.gametdb.com/wii/disc/EN/' +
                titleDataReturn[22] +
                ".png'; this.onerror=function(){this.src='https://art.gametdb.com/wii/disc/JA/" +
                titleDataReturn[22] +
                ".png'; this.onerror=function(){this.src='https://art.gametdb.com/wii/disc/KO/" +
                titleDataReturn[22] +
                '.png\'; this.onerror=function(){this.src=\'/img/disc_placeholder.png\';};};};" style="margin-right:20px;" width="70px">' +
                '<div><h5 style="font-weight:800; text-align:right;">' +
                titleDataReturn[0] +
                "</h5><h6 style='text-align:right; opacity:0.5;'>" +
                titleDataReturn[1] + " / " + titleDataReturn[2] + 
                "</h6></div></div><p style='padding-top:20px; padding-bottom:25px; display:flex; gap:20px; align-items:center; justify-content:center;'><b style='text-align:center;'><b style='font-family:rubik; font-size:30px;'>" + extraData[0] + "</b><br><i class='fa-solid fa-user' style='margin-right:5px;'></i> online</b><b style='text-align:center;'><b style='font-family:rubik; font-size:30px;'>" + extraData[1] + "</b><br><i class='fa-solid fa-gamepad' style='margin-right:5px;'></i> Active</b><b style='text-align:center;'><b style='font-family:rubik; font-size:30px;'>" + extraData[2] + "</b><br><i class='fa-solid fa-users-rays' style='margin-right:5px;'></i>Groups</b></p>" +
                titleDataReturn[7] + " <br><div style='display:flex; align-items:center; justify-content:space-between;'><p><span class='badge bg-translucent'>" +
                titleDataReturn[3] +
                "</span> <span class='badge bg-translucent'>" + titleDataReturn[4] +"</span></p><p><span class='badge bg-translucent'>" + titleDataReturn[9] + "-" + titleDataReturn[8] + "</span> <span class='badge bg-translucent'>" + titleDataReturn[12] + " <i class='fa-solid fa-user'></i> | " + titleDataReturn[10] + " <i class='fa-solid fa-earth-americas'></i></span></p></div></div></div></a>";
            }
            if(Object.keys(onlineStats).length < 2) {
              document.getElementsByClassName("online-now-holder")[0].style.opacity = "0";
              document.getElementsByClassName("online-now-holder")[0].style.pointerEvents = "none";
              document.getElementById("noResults").style.display = "block";
              document.getElementById("main").style.top = "45%";
              document.getElementById("main").style.transform = "translate(-50%, -50%)";
            }
          }
        });
    })
    .catch((error) => console.error(error));
});