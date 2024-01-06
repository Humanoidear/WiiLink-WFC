document.addEventListener("DOMContentLoaded", function () {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        render(this);
      }
    };
    xmlhttp.open("GET", "/xml/wiitdb.xml", true);
    xmlhttp.send();
  });

  function render(xml) {
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("game");
    var desiredLang = 'EN'; // Replace with the desired language
    var imglang = 'US';

    for (var i = 0; i < x.length; i++) {
      var id = x[i].getElementsByTagName("id")[0];
      var titleCheck = document.getElementById("gameId").textContent;
      if (id && id.childNodes[0].nodeValue === titleCheck) {
        var locales = x[i].getElementsByTagName("locale");
        
        fetch('../../json/gamespy_titles.json')
        .then(response => response.json())
        .then(data => {
          for (let j = 0; j < data.length; j++) {
            var gameid = id.textContent.substring(0, 3);
            if (data[j].GameID == gameid) {
              console.log(`Found an id for game with gamespy title ${data[j].GamespyName}!`);
              document.getElementById("onlineload").style.display = 'block';
              setInterval(() => {
              fetch('../../json/stats.json')
              .then(response => response.json())
              .then(isOnline => {
                document.getElementById("WFCdetails").innerHTML = `
                <div style="display:flex; flex-direction:row; gap:30px; width:100%;">
          <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%;">
            <div style="font-size: 40px; font-family: Rubik; font-weight:800; color:white;">${isOnline[0][data[j].GamespyName].online}</div>
            <div style="font-size: 15px; font-family: Rubik; color:white;"><i class="fa-solid fa-user" style="margin-right:5px;"></i> online</div>
          </div>
          <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%;">
            <div style="font-size: 40px; font-family: Rubik; font-weight:800; color:white;">${isOnline[0][data[j].GamespyName].active}</div>
            <div style="font-size: 15px; font-family: Rubik; color:white;"><i class="fa-solid fa-gamepad" style="margin-right:5px;"></i> active</div>
          </div>
          <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%;">
            <div style="font-size: 40px; font-family: Rubik; font-weight:800; color:white;">${isOnline[0][data[j].GamespyName].groups}</div>
            <div style="font-size: 15px; font-family: Rubik; color:white;"><i class="fa-solid fa-users-rays" style="margin-right:5px;"></i> groups</div>
          </div>
        </div>
               `;
               document.getElementById("containertitle").innerHTML = '';
              });
              fetch('../../json/group.json')
                .then(response => response.json())
                .then(group => {
                  document.getElementById("containerdata").innerHTML = ` `;
                    for (let k = 0; k < group.length; k++) {
                        if (group[k].game == data[j].GamespyName) {
                          console.log(`Found group data!`);
                          console.log(group[k]);
                          switch (group[k].type){
                              case 'anybody':
                                group[k].type = 'background-color:#3cc761;"><i class="fa-solid fa-earth-americas"></i> Public';
                                break;
                              case 'private':
                                group[k].type = 'background-color:#c7403c;"><i class="fa-solid fa-user-group"></i> Friends';
                                break;
                          }
                          group[k].host = group[k].players[group[k].host].name;
                         if (data[j].GamespyName == 'mariokartwii') {
                          console.log(group[k].host);
                          group[k].rk = group[k].rk.substring(0, 2); 
                          switch (group[k].rk){
                              case 'vs':
                                group[k].rk = 'background-color:#3c86c7;"><i class="fa-solid fa-motorcycle"></i> Versus';
                                break;
                              case 'bt':
                                group[k].rk = 'background-color:#9f3cc7;"><i class="fa-solid fa-coins"></i> Battle';
                                break;
                          }
                        }
                          document.getElementById("containerdata").innerHTML += ` <div style="color:white; display:flex; align-items:center; justify-content:center; position:relative;"><div style="width:100%; display:flex; justify-content:space-between; position:relative;"><b style="padding:8px; border-radius:4px; font-size:20px;"><i class="fa fa-crown" style="margin-right:5px;"></i> ${group[k].host}'s room</b> <div style="transform:translate(0, 10px);"> <b style="padding:8px; border-radius:4px; ${group[k].type}</b> <b style="padding:8px; border-radius:4px; background-color:#ffffff10;"><i class="fa-solid fa-door-open" style="margin-right:5px;"></i> ${group[k].suspend}</b>  <b style="padding:8px; border-radius:4px; ${group[k].rk}</b></div></div></div>`;
                          var playerData = '';
                          document.getElementById("onlinecontainer").style.display = 'block';
                          for (let playerIndex in group[k].players) {
                            var player = group[k].players[playerIndex];
                            console.log(player.name); // Logs the player's name
                            playerData += `
                            <div style="border-radius:8px; padding:18px; display:flex; justify-content:space-between; border:2px solid #ffffff10; background-color:rgb(26, 25, 25); z-index:10; position:relative;">
                             <div>
                              <div style="font-size: 30px; font-family: Rubik; font-weight:800; color:white;">${player.name}</div>
                              <div style="font-size: 18px; font-family: Rubik; opacity:0.7; color:white;"><i class="fa-solid fa-user-group" style="margin-right:5px;"></i> ${player.fc}</div>
                             </div>
                             <div style="text-align:right;">
                              <div style="font-size: 15px; font-family: Rubik; color:white;">${player.pid} <i class="fa-solid fa-fingerprint" style="margin-left:5px;"></i></div>
                              <div style="font-size: 15px; font-family: Rubik; color:white;">BR:${player.eb} / VR:${player.ev} <i class="fa-solid fa-flag-checkered" style="margin-left:5px;"></i></div>
                              <div style="font-size: 15px; font-family: Rubik; color:white;">${player.count} <i class="fa-solid fa-user-plus" style="margin-left:5px;"></i></div>
                             </div>
                            </div>
                            `;
                          }
                          document.getElementById("containerdata").innerHTML += '<div style="width:100%; margin-bottom:30px; display:grid; grid-template-columns: repeat(auto-fit,minmax(450px,1fr)); margin-top:20px; margin-bottom: 30px; gap:15px; position: relative;">' + playerData + '</div><hr\>';
                        } else {
                          console.log(`No group data found! Retrying...`);
                          document.getElementById("onlinecontainer").style.display += 'none';
                        }
                    }
                    document.getElementById("containerdata").innerHTML += '<div style="text-align:right;"><i class="fa fa-fingerprint" style="margin-right:5px;"></i>' + data[j].GamespyName + '</div>';
                });
            }, 5000);
                
            }
          }
        });

        for (var j = 0; j < locales.length; j++) {
          var region = x[i].getElementsByTagName('region')[0].textContent;
          if (locales[j].getAttribute('lang') === desiredLang) {
        var trueName = x[i].getAttribute('name');
        var developer = x[i].getElementsByTagName("developer")[0].textContent;
        var region = x[i].getElementsByTagName("region")[0].textContent;
        var languages = x[i].getElementsByTagName("languages")[0].textContent;
        var publisher = x[i].getElementsByTagName("publisher")[0].textContent;
        var date = x[i].getElementsByTagName("date")[0].getAttribute('year');
        var month = x[i].getElementsByTagName("date")[0].getAttribute('month');
        var day = x[i].getElementsByTagName("date")[0].getAttribute('day');
        var genre = x[i].getElementsByTagName("genre")[0].textContent;
        genre = genre.split(',').map(function(item) {
            var genreIconClass = getIconForGenre(item.trim());
            return '<b style="font-size:20px"><i class="fas ' + genreIconClass + '" style="margin-right:5px;"></i> ' + item.charAt(0).toUpperCase() + item.slice(1) + '</b>';
        }).join('<br>');
        var rating = x[i].getElementsByTagName("rating")[0].getAttribute('value');
        rating = getRating(rating);
        var classification = x[i].getElementsByTagName("rating")[0].getAttribute('type');

        var wifiPlayers = x[i].getElementsByTagName("wi-fi")[0].getAttribute('players');
        var onlineSupport = x[i].getElementsByTagName("wi-fi")[0].getElementsByTagName('feature');
var isSupported = Array.from(onlineSupport).map(feature => feature.textContent).join(' | ');

        var inputPlayers = x[i].getElementsByTagName("input")[0].getAttribute('players');
        var controlTypes = getController(xml, i);
        var romName = x[i].getElementsByTagName("rom")[0].getAttribute('name');
        var romSize = (x[i].getElementsByTagName("rom")[0].getAttribute('size')/1024/1024/1024).toFixed(2);
        var romVersion = x[i].getElementsByTagName("rom")[0].getAttribute('version');
        var hash = x[i].getElementsByTagName("rom")[0].getAttribute('crc');
        var hash2 = x[i].getElementsByTagName("rom")[0].getAttribute('md5');
        var hash3 = x[i].getElementsByTagName("rom")[0].getAttribute('sha1');
        var extraDataTitle = `Name: ${trueName}\nRom Dump: ${romName}\nFilesize: ${romSize}GB\nVersion: ${romVersion}\ncrc: ${hash}\nmd5: ${hash2}\nsha1: ${hash3}`;

            switch (region){
              case 'NTSC-U':
                imglang = 'US';
                break;
              case 'PAL':
                imglang = 'EN';
                break;
              case 'NTSC-J':
                imglang = 'JP';
                break;
            }

            var title = document.getElementById("gameId");
            title.innerHTML = '<img src="https://art.gametdb.com/wii/disc/' + imglang + '/' + titleCheck + '.png" alt="' + locales[j].getElementsByTagName("title")[0].textContent + ' Game Disc" style="margin-right:15px;" width="70px" onerror="this.onerror=null; this.src=\'/img/disc_placeholder.png\';"><b>' + locales[j].getElementsByTagName("title")[0].textContent + '</b>';
            
            var bg = document.getElementsByClassName("bginner");
            bg[0].innerHTML = '<img src="https://art.gametdb.com/wii/coverfullHQ/' + imglang + '/' + titleCheck + '.png" alt="' + locales[j].getElementsByTagName("title")[0].textContent + ' Background" style="margin-right:15px;" width="100%">';
           
            var img = document.getElementById("img");
            img.innerHTML = '<div class="coverimg"><img src="https://art.gametdb.com/wii/coverfullHQ/' + imglang + '/' + titleCheck + '.png" alt="' + locales[j].getElementsByTagName("title")[0].textContent + ' Game Boxart" class="imginner"></div>';

            data = document.getElementById("data");
            data.innerHTML = `<div class="smalldatapill"><l id="extradata" title="${extraDataTitle}" style="grid-column: auto / span 5; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;"><i class="fa-solid fa-compact-disc"></i> ${trueName}</l> <l title="${developer} | ${publisher}" style="grid-column: auto / span 3; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; position:relative;"><i class="fa-solid fa-file-code"></i> ${developer} | ${publisher}</l> <l style="grid-column: auto / span 2;"><i class="fa-solid fa-earth-americas"></i> ${region}</l> <l style="grid-column: auto / span 3;"><i class="fa-solid fa-language"></i> ${languages}</l> <l style="grid-column: auto / span 3;"><i class="fa-solid fa-calendar"></i> ${day}/${month}/${date}</l></div>`;
            data.innerHTML += `<div class="bigdatapill"><l style="border:2px solid #4287f520; grid-column: auto / span 5; grid-row: auto / span 2; display:flex; flex-direction:column; align-items:center; justify-content:center;"><div style="color:#4287f5; bottom:-50px; left:-20px; opacity:0.1; text-transform:uppercase; font-family:Gilroy; font-size:100px;position:absolute;">Genre</div> ${genre}</l> <l style="border:2px solid #42f55d20; grid-column: auto / span 2; grid-row: auto / span 2;"><div style="color:#42f55d; bottom:-50px; left:-20px; opacity:0.1; text-transform:uppercase; font-family:Gilroy; font-size:100px;position:absolute;">${classification}</div> ${rating}</l> <l style="border:2px solid #dd42f520; grid-column: auto / span 5; grid-row: auto / span 2; display:flex; justify-content:center; align-items:center; position:relative;"><div style="color:#dd42f5; bottom:-50px; left:-20px; opacity:0.1; text-transform:uppercase; font-family:Gilroy; font-size:100px; position:absolute;">WI-FI</div><b id="WFCdetails" style="width:100%; max-width:330px;"><img src="/img/loading.gif" id="onlineload" style="left:50%; transform:translate(-50%, 0); filter:brightness(100000000); display:none; position:relative;" width="30px"></b> <div id="onlineplaycontainer" style="top:20px; display:flex; align-items:center; justify-content:center; position:absolute;"><b id="onlineplayno" style="font-size:30px; margin-right:18px;">${wifiPlayers}</b><b id="wifino"></b></div> <b style="bottom:20px; position:absolute;">${isSupported}</b></l> <l style="border:2px solid #dd42f520; grid-column: auto / span 6; display:flex; justify-content:center; align-items:center;"><div style="color:#dd42f560; bottom:-50px; left:-20px; opacity:0.2; text-transform:uppercase; font-family:Gilroy; font-size:100px;position:absolute;">Players</div> <b style="font-size:30px; margin-right:18px;">${inputPlayers}</b> <b id="playerno"></b></l> <l style="border:2px solid #ffffff20; grid-column: auto / span 6; grid-row: auto / span 1;"><div style="bottom:-50px; left:-20px; opacity:0.03; text-transform:uppercase; font-family:Gilroy; font-size:100px;position:absolute;">Controllers</div> <br>${controlTypes}</l></div>`;

            var playIcon1 = document.getElementById("wifino");
            var playIcon2 = document.getElementById("onlineplaycontainer");
            if (wifiPlayers == 0) {
              document.getElementById("onlineplayno").style.display = 'none';
              playIcon1.innerHTML += '<i class="fa-solid fa-triangle-exclamation"></i> This title does not support online multiplayer.';
              playIcon2.style.top = '45%';
            } else {
              for (var l = 0; l < wifiPlayers; l++) {
                playIcon1.innerHTML += '<i class="fa fa-user" style="margin-right:8px;"></i>';
              }
            }
            var playIcon2 = document.getElementById("playerno");
            for (var l = 0; l < inputPlayers; l++) {
              playIcon2.innerHTML += '<i class="fa fa-user" style="margin-right:8px;"></i>';
            }
            synopsis = document.getElementById("synopsis");
            synopsis.innerHTML = locales[j].getElementsByTagName("synopsis")[0].textContent;
            marked.parse(synopsis.innerHTML);
          }
        }
        break;
      }
      
    }

var toSearch = 'https://www.googleapis.com/customsearch/v1?cx=14ab9bd483f1f428f&key=AIzaSyAGL6CPKL-xJez-Ee3tdOoBan08RMdaOpA&q=' + x[i].getElementsByTagName("locale")[0].getElementsByTagName("title")[0].textContent + '+Wii+screenshots&searchType=image';
    fetch(toSearch)
  .then(response => response.json())
  .then(data => {
    let images = data.items.map(item => item.link);
    for (let i = 0; i < 5; i++) {
      var div = document.getElementById("imgCaroussel");
      div.innerHTML += `<img src="${images[i]}" height="300px" style="border-radius:8px; margin-right:20px;  background-color: #ffffff10;">`;
    }
  });
  
}

function getIconForGenre(genre) {
    switch (genre) {
        case 'action':
            return 'fa-fist-raised';
          case 'adventure':
            return 'fa-hiking';
          case 'racing':
            return 'fa-car-side';
          case 'party':
            return 'fa-gift';
          case 'board game':
            return 'fa-dice';
          case 'strategy':
            return 'fa-chess';
          case 'puzzle':
            return 'fa-puzzle-piece';
          case 'sports':
            return 'fa-football-ball';
          case 'simulation':
            return 'fa-gamepad';
          case 'music':
            return 'fa-music';
          case 'horror':
            return 'fa-ghost';
          case 'shooter':
            return 'fa-crosshairs';
          case 'fighting':
            return 'fa-user-ninja';
          case 'platform':
            return 'fa-running';
          case 'rpg':
            return 'fa-dragon';
          case 'bike racing':
            return 'fa-motorcycle';
          case 'kart racing':
            return 'fa-flag-checkered';
          case 'platformer':
            return 'fa-running';
          // More to be added
          default:
            return 'fa-circle-solid';
        }
  }

function getRating(rating) {
    switch (rating){
        case '3':
          return '<img src="/img/pegi3.jpg" alt="Pegi 3" style="margin-top:20px;" width="130px">';
          
        case '7':
          return '<img src="/img/pegi7.jpg" alt="Pegi 7" style="margin-top:20px;"width="130px">';
          
        case '12':
          return '<img src="/img/pegi12.jpg" alt="Pegi 12" style="margin-top:20px;"width="130px">';
          
        case '16':
          return '<img src="/img/pegi16.jpg" alt="Pegi 16" style="margin-top:20px;"width="130px">';
          
        case '18':
          return '<img src="/img/pegi18.jpg" alt="Pegi 18" style="margin-top:20px;"width="130px">';
          
        case 'EC':
          return '<img src="/img/esrb-ec.webp" alt="ESRB EC" style="margin-top:20px;"width="130px">';
          
        case 'E':
          return '<img src="/img/esrb-e.webp" alt="ESRB E" style="margin-top:20px;"width="130px">';
          
        case 'E10+':
          return '<img src="/img/esrb-e10.webp" alt="ESRB E10+" style="margin-top:20px;"width="130px">';
          
        case 'T':
          return '<img src="/img/esrb-t.webp" alt="ESRB T" style="margin-top:20px;"width="130px">';
          
        case 'M':
          return '<img src="/img/esrb-m.webp" alt="ESRB M" style="margin-top:20px;"width="130px">';
          
        case 'A':
          return '<img src="/img/cero-a.webp" alt="CERO A" style="margin-top:20px;"width="130px">';
          
        case 'B':
          return '<img src="/img/cero-b.webp" alt="CERO B" style="margin-top:20px;"width="130px">';
          
        case 'C':
          return '<img src="/img/cero-c.webp" alt="CERO C" style="margin-top:20px;"width="130px">';
          
        case 'D':
          return '<img src="/img/cero-d.webp" alt="CERO D" style="margin-top:20px;"width="130px">';
          
        case 'Z':
          return '<img src="/img/cero-z.webp" alt="CERO Z" style="margin-top:20px;"width="130px">';
          
        default:
          return '<b>Oh snap!</b><br>This title does not have an age rating.';
      }
}

function getController(xml, i) {
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("game");
    var inputPlayers = x[i].getElementsByTagName("input")[0].getAttribute('players');
    var controls = x[i].getElementsByTagName("control");
    var controlTypes = '';

    if (inputPlayers == '') {
      controlTypes = '<b>What a bummer...</b><br>This title features no control types.';
    }

    for (var k = 0; k < controls.length; k++) {
      var type = controls[k].getAttribute('type');
      switch (type) {
        case 'wiimote':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/wiimote.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/wiimote.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'motionplus':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/motionplus.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-80%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/motionplus.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'nunchuk':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/nunchuk.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/nunchuk.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'classiccontroller':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/classiccontroller.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/classiccontroller.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'wheel':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/wheel.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/wheel.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'gamecube':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/gamecube.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/gamecube.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'balanceboard':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/balanceboard.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/balanceboard.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'zapper':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/zapper.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/zapper.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'guitar':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/guitar.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/guitar.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'keyboard':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/keyboard.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/keyboard.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'drums':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/drums.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/drums.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'nintendods':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/nintendods.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/nintendods.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'wiispeak':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/wiispeak.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/wiispeak.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'udraw':
        if (controls[k].getAttribute('required') == 'true') {
          controlTypes += `<img src="/img/udraw.png" style="margin-right:15px;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/udraw.png" style="margin-right:15px;"height="60px">`;
        }
        break;
        case 'mii':
        break;
        default:
        controlTypes += type;
      }
    }
    return controlTypes;
}