import * as THREE from '/js/three.js';

const N = 10;

  let cities = [
    { name: "New York", lat: 40.7128, lng: -74.006 },
    { name: "Tokyo", lat: 35.6895, lng: 139.6917 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
    { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
    { name: "Beijing", lat: 39.9042, lng: 116.4074 },
    { name: "Cairo", lat: 30.0444, lng: 31.2357 },
    { name: "Madrid", lat: 40.4168, lng: -3.7038 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
    { name: "Houston", lat: 29.7604, lng: -95.3698 },
    { name: "Lagos", lat: 6.5244, lng: 3.3792 },
    { name: "Nairobi", lat: -1.286389, lng: 36.817223 },
    { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
    { name: "Quito", lat: -0.1807, lng: -78.4678 },
  ];

  let gData = cities.map((city, i) => {
    return {
      lat: city.lat,
      lng: city.lng,
      startLat: city.lat,
      startLng: city.lng,
      name: [
        "Jess",
        "Alex",
        "Alex",
        "Giustino",
        "Pablo",
        "oscie",
        "Luna",
        "diego",
        "Sketch",
        "Palapeli",
        "Nova",
        "Kouacc",
        "Philemax",
        "Jau",
        "Matthe815",
      ][i % 14],
      game: [
        "Samba de Amigo",
        "UNO WiiWare",
        "Tetris Party",
        "Inazuma Eleven Go",
        "Mario Kart Wii",
        "Wii Chess",
        "Super Smash Bros. Brawl",
      ][i % 7],
      isOpen: [false, true, false, true, false, false, true, false][i % 8],
      faces: [
        "jess.png",
        "alexb.png",
        "alexv.png",
        "idk.png",
        "pablo.png",
        "oscie.png",
        "luna.png",
        "diego.png",
        "idk.png",
        "palapeli.png",
        "nova.png",
        "kouacc.png",
        "idk.png",
        "idk.png",
        "matthe.png",
      ][i % 14],
      icons: [
        "samba.png",
        "uno.png",
        "tetrisparty.png",
        "inazuma.png",
        "mkw.png",
        "chess.png",
        "smash.png",
      ][i % 7],
    };
  });

  gData = gData.map((item, index) => {
    const nextItem = gData[(index + 1) % gData.length];
    return {
      ...item,
      endLat: nextItem.lat,
      endLng: nextItem.lng,
    };
  });

  let gData2 = cities.map((city, i) => {
    return {
      lat: city.lat,
      lng: city.lng,
      startLat: city.lat,
      startLng: city.lng,
    };
  });

  gData2 = gData2.map((item, index) => {
    const nextItem = gData2[(index + 1) % gData2.length];
    return {
      ...item,
      endLat: nextItem.lat,
      endLng: nextItem.lng,
    };
  });

  let gData3 = cities.map((city, i) => {
    return {
      lat: city.lat,
      lng: city.lng,
    };
  });

  const world = Globe({ animateIn: false })(document.getElementById("globeViz"))
    .globeImageUrl("/img/globe/earth.jpg")
    .bumpImageUrl("/img/globe/bump.jpg")
    .htmlElementsData(gData)
    .htmlElement((d) => {
      const el = document.createElement("div");
      let isOpened = d.isOpen ? "block" : "none";
      let isClosed = d.isOpen ? "none" : "block";
      let size = d.isOpen ? "100%" : "60%";
      let opacity = d.isOpen ? "1" : "0.7";
      let size2 = d.isOpen ? "70" : "120";
      let zIndex = d.isOpen ? "1000000" : "1";
      el.innerHTML =
        "<div style='animation: fadein 0.2s linear forwards; filter:brightness(" +
        opacity +
        ") opacity(" +
        opacity +
        "); transform:scale(" +
        size +
        ");  width:330px; display:flex; gap:0px; z-index:" +
        zIndex +
        " position:relative;'><img style='transform:translate(-10px, 0); filter:drop-shadow(0px 0px 30px #ffffff60);' src='/img/miis/" +
        d.faces +
        "' alt='Team member' height='70px'><div style='display:" +
        isOpened +
        "; background-color:ffffff40; color:white; padding:13px; border:1.8px solid #ffffff20; backdrop-filter:blur(8px); --webkit-backdrop-filter:blur(8px); font-family:system-ui; border-radius:8px; transition:0.5s; position:relative;'><b>" +
        d.name +
        "</b> is playing </br><img style='top:0; right:0; transform:translate(0, -1px); postion:absolute;' src='/img/games/" +
        d.icons +
        "' alt='Game icon' width='20px' height='20px'> <b>" +
        d.game +
        "</b></div><img style='top:0; right:0; transform:translate(-15px, -15px); display:" +
        isClosed +
        "; postion:absolute;' src='/img/games/" +
        d.icons +
        "' alt='Game icon' width='40px' height='40px'></div>";
      el.style.width = `${size2}px`;
      return el;
    })
    .backgroundColor("#ffffff00")
    .arcsData(gData2.filter((_, index) => index < gData2.length / 1))
    .arcColor(() => "rgba(118, 118, 238, 0.5)")
    .arcStroke(0.7)
    .arcDashLength(0.9)
    .arcDashGap(1)
    .arcDashAnimateTime(() => Math.random() * 4000 + 2000)
    .ringsData(gData3)
    .ringColor(() => "rgb(118, 118, 238)")
    .ringMaxRadius(1)
    .ringPropagationSpeed(1)
    .ringRepeatPeriod(0.1);

  // Auto-rotate
  world.controls().autoRotate = true;
  world.controls().enableZoom = false;
  world.controls().autoRotateSpeed = 0.25;

  // Add clouds sphere
  const CLOUDS_IMG_URL = "/img/globe/clouds.png";
  const CLOUDS_ALT = 0.01;
  const CLOUDS_ROTATION_SPEED = 0.005; // deg/frame

  new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(
        world.getGlobeRadius() * (1 + CLOUDS_ALT),
        75,
        75,
      ),
      new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.5,
      }),
    );
    world.scene().add(clouds);

    (function rotateClouds() {
      clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
      requestAnimationFrame(rotateClouds);
    })();
  });