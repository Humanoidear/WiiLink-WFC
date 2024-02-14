// Receives a base64 string and returns a link to the rendered mii image
export function renderMii(base64String) {
  // Decode base64 string
  let binaryString = atob(base64String);
  let binaryLen = binaryString.length;
  // Create binary array from base64 decoded string
  let bytes = new Uint8Array(binaryLen);
  // Fill the binary array
  for (let i = 0; i < binaryLen; i++) {
    let ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }

  // Create a blob object
  let blob = new Blob([bytes], { type: "application/octet-stream" });

  // Create a file object from the blob
  let file = new File([blob], "file.miigx");

  // Send the file to the server
  let formData = new FormData();
  formData.append("platform", "wii");
  formData.append("data", file);

  // Use larsen's funky studio.cgi to get the data needed to render the mii
  return fetch("https://miicontestp.wii.rc24.xyz/cgi-bin/studio.cgi", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      let mii = data.mii;

      // Render the mii using Nintendo's servers
      var src =
        "https://studio.mii.nintendo.com/miis/image.png?data=" +
        mii +
        "&type=face_only&expression=normal&width=270&bgColor=FFFFFF00";

      // Return the mii image
      return src;
    });
}

// Loads the correct GameTDB URL image depending on the region of the game
export function loadImage(format, title) {
  switch (title.charAt(3)) {
    case "E":
      return "https://art.gametdb.com/wii/" + format + "/US/" + title + ".png";
    case "P":
    case "D":
    case "H":
    case "X":
    case "Y":
    case "F":
      return "https://art.gametdb.com/wii/" + format + "/EN/" + title + ".png";
    case "J":
      return "https://art.gametdb.com/wii/" + format + "/JA/" + title + ".png";
    case "K":
      return "https://art.gametdb.com/wii/" + format + "/KO/" + title + ".png";
    default:
      return "/img/disc_placeholder.png";
  }
}

// Obtains an accompanying icon for the genre of the game
export function getIconForGenre(genre) {
  switch (genre) {
    case "action":
      return "fa-fist-raised";
    case "adventure":
      return "fa-hiking";
    case "racing":
      return "fa-car-side";
    case "party":
      return "fa-gift";
    case "board game":
      return "fa-dice";
    case "strategy":
      return "fa-chess";
    case "puzzle":
      return "fa-puzzle-piece";
    case "sports":
      return "fa-football-ball";
    case "simulation":
      return "fa-gamepad";
    case "music":
      return "fa-music";
    case "horror":
      return "fa-ghost";
    case "shooter":
      return "fa-crosshairs";
    case "fighting":
      return "fa-user-ninja";
    case "platform":
      return "fa-running";
    case "rpg":
      return "fa-dragon";
    case "bike racing":
      return "fa-motorcycle";
    case "kart racing":
      return "fa-flag-checkered";
    case "platformer":
      return "fa-running";
    // More to be added
    default:
      return "fa-circle-solid";
  }
}

// Obtains the correct age rating image for the game
export function getRating(rating, classification) {
  switch (rating) {
    case "3":
      return '<img src="/img/ratings/pegi3.jpg" alt="Pegi 3" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "7":
      return '<img src="/img/ratings/pegi7.jpg" alt="Pegi 7" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "12":
      if (classification == "PEGI") {
        return '<img src="/img/ratings/pegi12.jpg" alt="Pegi 12" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';
      } else {
        return '<img src="/img/ratings/grac-12.jpg" alt="Pegi 12" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';
      }

    case "16":
      return '<img src="/img/ratings/pegi16.jpg" alt="Pegi 16" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "18":
      if (classification == "PEGI") {
        return '<img src="/img/ratings/pegi18.jpg" alt="Pegi 18" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';
      } else {
        return '<img src="/img/ratings/grac-18.jpg" alt="Pegi 18" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';
      }

    case "EC":
      return '<img src="/img/ratings/esrb-ec.webp" alt="ESRB EC" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "E":
      return '<img src="/img/ratings/esrb-e.webp" alt="ESRB E" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "E10+":
      return '<img src="/img/ratings/esrb-e10.webp" alt="ESRB E10+" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "T":
      return '<img src="/img/ratings/esrb-t.webp" alt="ESRB T" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "M":
      return '<img src="/img/ratings/esrb-m.webp" alt="ESRB M" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "A":
      return '<img src="/img/ratings/cero-a.png" alt="CERO A" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "B":
      return '<img src="/img/ratings/cero-b.png" alt="CERO B" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "C":
      return '<img src="/img/ratings/cero-c.png" alt="CERO C" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "D":
      return '<img src="/img/ratings/cero-d.png" alt="CERO D" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "Z":
      return '<img src="/img/ratings/cero-z.png" alt="CERO Z" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "ALL":
      return '<img src="/img/ratings/grac-all.svg" alt="ALL AGES" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    case "15":
      return '<img src="/img/ratings/grac-15.svg" alt="ALL AGES" style="margin-top:20px; width:130px; left:50%; transform:translate(-50%, 0); position:relative;">';

    default:
      return "<b>Oh snap!</b><br>This title does not have an age rating.";
  }
}

// Obtains the correct controller image for each control type
export function getController(xml, i) {
  var xmlDoc = xml.responseXML;
  var x = xmlDoc.getElementsByTagName("game");
  var inputPlayers = x[i]
    .getElementsByTagName("input")[0]
    .getAttribute("players");
  var controls = x[i].getElementsByTagName("control");
  var controlTypes = "";

  if (inputPlayers == "") {
    controlTypes =
      "<b>What a bummer...</b><br>This title features no control types.";
  }

  for (var k = 0; k < controls.length; k++) {
    var type = controls[k].getAttribute("type");
    switch (type) {
      case "wiimote":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/wiimote.svg" style="margin-right:15px; filter:brightness(1000); transform:translate(-150%, 0px);" height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/wiimote.svg" style="margin-right:15px; filter:brightness(1000); transform:translate(-150%, 0px);" height="60px">`;
        }
        break;
      case "motionplus":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/motionplus.svg" style="margin-right:15px; filter:brightness(1000);"height="60px"><span style="font-size:10px; transform:translate(-80%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/motionplus.svg" style="margin-right:15px; filter:brightness(1000);"height="60px">`;
        }
        break;
      case "nunchuk":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/nunchuk.svg" style="margin-right:15px; filter:brightness(1000);"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/nunchuk.svg" style="margin-right:15px; filter:brightness(1000);"height="60px">`;
        }
        break;
      case "classiccontroller":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/classiccontroller.svg" style="margin-right:15px; filter:brightness(1000);"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/classiccontroller.svg" style="margin-right:15px; filter:brightness(1000);"height="60px">`;
        }
        break;
      case "wheel":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/wheel.svg" style="margin-right:15px; filter:brightness(1000);"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/wheel.svg" style="margin-right:15px; filter:brightness(1000);"height="60px">`;
        }
        break;
      case "gamecube":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/gamecube.svg" style="margin-right:15px; filter:brightness(1000); scale:85%;" height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/gamecube.svg" style="margin-right:15px; filter:brightness(1000); scale:85%;" height="60px">`;
        }
        break;
      case "balanceboard":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/balanceboard.svg" style="margin-right:15px; filter:brightness(1000);"height="50px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/balanceboard.svg" style="margin-right:15px; filter:brightness(1000);"height="50px">`;
        }
        break;
      case "zapper":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/zapper.svg" style="margin-right:15px; filter:brightness(1000);"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/zapper.svg" style="margin-right:15px; filter:brightness(1000);"height="60px">`;
        }
        break;
      case "guitar":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/guitar.png" style="margin-right:15px; filter:invert(1);"height="70px"><span style="font-size:10px; transform:translate(-100%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/guitar.png" style="margin-right:15px; filter:invert(1);"height="70px">`;
        }
        break;
      case "keyboard":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/keyboard.png" style="margin-right:15px; filter:brightness(1000);"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/keyboard.png" style="margin-right:15px; filter:brightness(1000);"height="60px">`;
        }
        break;
      case "drums":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/drums.png" style="margin-right:15px; filter:invert(1);"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/drums.png" style="margin-right:15px; filter:invert(1);"height="60px">`;
        }
        break;
      case "microphone":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/microphone.png" style="margin-right:15px; filter:invert(1);"height="50px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/microphone.png" style="margin-right:15px; filter:invert(1);"height="50px">`;
        }
        break;
      case "nintendods":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/nintendods.svg" style="margin-right:15px; filter: invert(1) brightness(1000); scale:80%;"height="60px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/nintendods.svg" style="margin-right:15px; filter:invert(1) brightness(1000); scale:80%;" height="60px">`;
        }
        break;
      case "wiispeak":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/wiispeak.png" style="margin-right:15px; filter:brightness(1000);"height="40px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/wiispeak.png" style="margin-right:15px; filter:brightness(1000);"height="40px">`;
        }
        break;
      case "udraw":
        if (controls[k].getAttribute("required") == "true") {
          controlTypes += `<img src="/img/controllers/udraw.svg" style="margin-right:15px; filter:brightness(1000);"height="50px"><span style="font-size:10px; transform:translate(-125%, 40px); position:absolute;" class="badge text-bg-danger">Required</span></img>`;
        } else {
          controlTypes += `<img src="/img/controllers/udraw.svg" style="margin-right:15px; filter:brightness(1000);"height="50px">`;
        }
        break;
      case "mii":
        break;
      default:
        controlTypes += type;
    }
  }
  return controlTypes;
}

// Prevents HTML injection in the usernames
export function sanitizeHTML(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}
