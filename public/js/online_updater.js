import { renderMii, sanitizeHTML } from "/js/helper_functions.js";

var apiGroups = "https://api.wfc.wiilink24.com/api/groups";
var apiStats = "https://api.wfc.wiilink24.com/api/stats";
var tempPlayerData = "";

// Function to update the online stats of a game, this function gets called assuming the game is supported
export function onlineUpdater(data) {
  fetch(apiStats)
    .then((response) => response.json())
    .then((isOnline) => {
      // Check if the game has people online
      if (isOnline[data.gameId] == undefined) {
        document.getElementById("WFCdetails").innerHTML = `
               <i class="fa fa-triangle-exclamation" style="margin-right:5px;"></i> There seems to be nobody around...
           `;
      } else {
        if (
          isOnline[data.gameId].active < 2 ||
          isOnline[data.gameId].online == undefined
        ) {
          document.getElementById("onlinecontainer").style.display = "none";
        }
        document.getElementById("WFCdetails").innerHTML = `
               <div style="display:flex; flex-direction:row; gap:30px; width:100%;">
                   <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%;">
                       <div style="font-size: 40px; font-family: Rubik; font-weight:800; color:white;">${
                         isOnline[data.gameId].online
                       }</div>
                       <div style="font-size: 15px; font-family: Rubik; color:white;"><i class="fa-solid fa-user" style="margin-right:5px;"></i> online</div>
                   </div>
                   <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%;">
                       <div style="font-size: 40px; font-family: Rubik; font-weight:800; color:white;">${
                         isOnline[data.gameId].active
                       }</div>
                       <div style="font-size: 15px; font-family: Rubik; color:white;"><i class="fa-solid fa-gamepad" style="margin-right:5px;"></i> active</div>
                   </div>
                   <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%;">
                       <div style="font-size: 40px; font-family: Rubik; font-weight:800; color:white;">${
                         isOnline[data.gameId].groups
                       }</div>
                       <div style="font-size: 15px; font-family: Rubik; color:white;"><i class="fa-solid fa-users-rays" style="margin-right:5px;"></i> groups</div>
                   </div>
               </div>
           `;
      }
    });

  // Specific group data for the requested game
  fetch(apiGroups)
    .then((response) => response.json())
    .then((group) => {
      var playerData = "";
      var roomStats = "";
      for (let k = 0; k < group.length; k++) {
        if (group[k].game == data.gameId) {
          // Check for online groups in the specific game
          switch (group[k].type) {
            case "anybody":
              group[k].type =
                'background-color:#3cc761;"><i class="fa-solid fa-earth-americas"></i> Public';
              break;
            case "private":
              group[k].type =
                'background-color:#c7403c;"><i class="fa-solid fa-user-group"></i> Friends';
              break;
          }
          group[k].host = group[k].players[group[k].host].name;

          if (data.gameId == "mariokartwii") {
            // MKW exclusive data
            // Add fallback in case server does not return rk data
            group[k].rk = group[k].rk || "unknown";
            group[k].rk = group[k]?.rk.substring(0, 2);
            switch (group[k].rk) {
              case "vs":
                group[k].rk =
                  'background-color:#3c86c7;"><i class="fa-solid fa-motorcycle"></i> Versus';
                break;
              case "bt":
                group[k].rk =
                  'background-color:#9f3cc7;"><i class="fa-solid fa-coins"></i> Battle';
                break;
              default:
                group[k].rk =
                  'background-color:#ffffff20;"><i class="fa-solid fa-earth-americas"></i> Finding oponents...';
                break;
            }
          }
          if (group[k].suspend) {
            group[k].suspend =
              'background-color:#c7403c;"><i class="fa-solid fa-door-closed"></i> Not joinable';
          } else {
            group[k].suspend =
              'background-color:#3cc761;"><i class="fa-solid fa-door-open"></i> Joinable';
          }
          document.getElementById("onlinecontainer").style.display = "block";

          var fontSize = "";
          var extraDisplay = "";
          var gridSize = "";

          if (localStorage.getItem("statistics") == "small") {
            fontSize = 23;
            extraDisplay = "display:none;";
            gridSize =
              "grid-template-columns: repeat(auto-fit,minmax(300px,1fr));";
          } else {
            fontSize = 30;
            extraDisplay = "display:block;";
            gridSize =
              "grid-template-columns: repeat(auto-fit,minmax(450px,1fr));";
          }

          roomStats = ` <div style="color:white; display:flex; align-items:center; justify-content:center; position:relative;"><div style="width:100%; display:flex; flex-wrap:wrap; justify-content:space-between; position:relative;"><b style="padding:8px; border-radius:4px; font-size:20px;"><i class="fa fa-crown" style="margin-right:5px; margin-bottom:18px;"></i><d style="font-family: miifont, system-ui;"> ${sanitizeHTML(
            group[k].host
          )}'s room</d><br><d style="font-size:15px; opacity:0.3; transform:translate(0, -17px); margin-left:30px; position:absolute;">(${
            group[k].id
          })</d></b> <div style="transform:translate(0, 20px);"> <b style="padding:8px; border-radius:4px; ${
            group[k].type
          }</b> <b style="padding:8px; border-radius:4px; ${
            group[k].suspend
          }</b>  <b style="padding:8px; border-radius:4px; ${
            group[k].rk
          }</b></div></div></div>`;


          // Get the players in the groups 
          playerData += roomStats;
            playerData += '<div id="mobilestats" style="width:100%; margin-bottom:30px; display:grid;' +
            gridSize +
            'margin-top:20px; margin-bottom: 30px; gap:15px; position: relative;">';

          for (let playerIndex in group[k].players) {
            var player = group[k].players[playerIndex];

            // Loop through each player and fetch its corresponding data depening on wether they are a guest or not, and the user personalization preferences
            for (let i = 0; i < player.count; i++) {
              let miiData = "0000000000000000";
              let miiName = "Guest";
              let isDisplayed = "display:none;";
              if (player.mii) {
                miiData = player.mii[i].data || miiData;
                miiName = player.mii[i].name || miiName;
                isDisplayed = "display:block;";
              }
              let miiImgId = "miiImg" + (playerIndex + (12*k));
              renderMii(miiData).then((miiImg) => {
                document.getElementById(miiImgId).innerHTML =
                  "<img src='" +
                  miiImg +
                  "' style='left:50%; top:50%; height:" +
                  fontSize * 2.5 +
                  "px; width:" +
                  fontSize * 2.5 +
                  "px; transform: translate(-50%, -50%) scale(1.3); position:relative;'>";
              });
              player.ev = player.ev || "????";
              player.eb = player.eb || "????";

              if (i == 0) {
                playerData += `<div id="mobileinner" onclick="toClipboard('${player.name} | FC:${
                  player.fc
                }');" style="border-radius:8px; padding:18px; display:flex; align-items:center; justify-content:space-between; border:2px solid #ffffff10; background-color:rgb(26, 25, 25); cursor:pointer; z-index:10; position:relative;">
        <div style="display:flex; flex-direction:row; align-items:center; gap:20px;">
          <div id="${miiImgId}" style="height:${fontSize * 2.5}px; width:${
                  fontSize * 2.5
                }px; overflow:hidden; ${isDisplayed}"></div>
          <div>
          <div style="font-size: ${fontSize}px; font-family: miifont, Rubik; font-weight:800; color:white; display:flex; align-items:center; gap:5px;">${sanitizeHTML(
                  player.name
                )}</div>
          <div style="font-size: ${
            fontSize - 10
          }px; font-family: Rubik; opacity:0.7; color:white;"><i class="fa-solid fa-user-group" style="margin-right:5px;"></i> ${
                  player.fc
                }</div>
          </div>
        </div>
        <div style="text-align:right; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size: 15px; font-family: Rubik; color:white;">${
            player.ev
          } <span class="badge bg-primary" style="font-size:13px;">VR</span>
        </div>
        <div style="font-size: 15px; font-family: Rubik; color:white;">${
          player.eb
        } <span class="badge bg-success" style="font-size:13px;">BR</span></div>
        <div style="${extraDisplay}">
        <div style="font-size: 15px; font-family: Rubik; color:white;">${
          player.pid
        } <i class="fa-solid fa-fingerprint" style="margin-left:5px;"></i></div>
        <div style="font-size: 15px; font-family: Rubik; color:white;">${
          player.count
        } <i class="fa-solid fa-user-plus" style="margin-left:5px;"></i></div>
        </div>
        </div>
      </div>
    `;
              } else {
                playerData += `
      <div id="mobileinner" onclick="toClipboard('${miiName} | Guest');" style="border-radius:8px; padding:18px; display:flex; align-items:center; justify-content:space-between; border:2px solid #ffffff10; background-color:rgb(26, 25, 25); cursor:pointer; z-index:10; position:relative;">
      <span class="badge bg-primary" style="right:15px; font-size:13px; position:absolute;">Guest</span>
        <div style="display:flex; flex-direction:row; align-items:center; justify-content:space-between; gap:20px;">
          <div id="${miiImgId}" style="height:${fontSize * 2.5}px; width:${
                  fontSize * 2.5
                }px; overflow:hidden; ${isDisplayed}"></div>
          <div>
            <div style="font-size: ${fontSize}px; font-family: miifont, Rubik; font-weight:800; color:white;">${sanitizeHTML(
                  miiName
                )}</div>
            <div style="font-size: ${
              fontSize - 10
            }px; font-family: Rubik; opacity:0.7; color:white;"><i class="fa-solid fa-person-circle-plus" style="font-size:15px; margin-right:5px;"></i> ${
                  player.name
                }'s guest</div>
          </div>
          </div>
      </div>
    `;
              }
            }
          }
          }
          playerData += '</div>';
        }
        if (playerData == tempPlayerData) {
          return;
        } else {
          tempPlayerData = playerData;
          document.getElementById("containerdata").innerHTML = playerData;
          document.getElementById("containerdata").innerHTML +=
      '<hr><div style="text-align:right;"><i class="fa fa-fingerprint" style="margin-right:5px;"></i>' +
      data.gameId +
      "</div>";
      }
      // Hide the MKW link if the game is MKW
      if (data.gameId == "mariokartwii") {
        document.getElementById("mkwlink").style.display = "none";
      }
    });
}
