window.closeCustomization = function () {
  var customization = document.getElementById("customization");
  var backblur = document.getElementById("backblur");

  customization.classList.add("fade-move");
  backblur.classList.add("fade-out");

  // After the animation is done, hide the elements
  setTimeout(function () {
    customization.style.display = "none";
    backblur.style.display = "none";
  }, 500);
};

window.openCustomization = function () {
  var customization = document.getElementById("customization");
  var backblur = document.getElementById("backblur");

  // Show the elements
  customization.style.display = "block";
  backblur.style.display = "block";

  // Delay the removal of the classes that trigger the animations
  setTimeout(function () {
    customization.classList.remove("fade-move");
    backblur.classList.remove("fade-out");
  }, 0);
};
