var fallingObjects = document.querySelectorAll(".falling-object");
var WAnimation = document.querySelector(".animation-item-place");

function setRandomLeftPosition(element) {
  var maxX = WAnimation.offsetWidth - element.offsetWidth;
  var randomX = Math.random() * maxX;
  element.style.left = randomX + "px";
}

fallingObjects.forEach(function (obj) {
  setRandomLeftPosition(obj);

  anime({
    targets: obj,
    keyframes: [{ translateY: [-400, 1250], rotate: "1turn" }],
    duration: 3000,
    loop: true,
    easing: "linear",
    delay: function () {
      return Math.random() * 3000;
    },
    complete: function (anim) {
      anim.reset();
    },
  });
});
