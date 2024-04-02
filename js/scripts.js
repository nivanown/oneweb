/*- phone-input -*/
[].forEach.call(document.querySelectorAll(".phone-input"), function (input) {
  let keyCode;
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode);
    let pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    let matrix = "+998 __ ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, ""),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = newValue.indexOf("_");
    if (i != -1) {
      i < 5 && (i = 3);
      newValue = newValue.slice(0, i);
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = newValue;
    if (event.type == "blur" && this.value.length < 5) this.value = "";
  }

  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false);
  input.addEventListener("mouseup", (event) => {
    event.preventDefault();
    if (input.value.length < 4) {
      input.setSelectionRange(4, 4);
    } else {
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });
});

/*- experience-slider -*/
const slider = document.querySelector('.experience-slider__line');
const thumb = document.querySelector('.experience-slider__thumb');
const points = document.querySelectorAll('.experience-slider__point');
const positions = [0, 33.33, 66.66, 100];

function moveThumb(event) {
  const sliderRect = slider.getBoundingClientRect();
  const offsetX = event.clientX - sliderRect.left;
  const percentage = (offsetX / sliderRect.width) * 100;

  const nearestPosition = positions.reduce((prev, curr) => {
    return (Math.abs(curr - percentage) < Math.abs(prev - percentage) ? curr : prev);
  });

  thumb.style.left = `${nearestPosition}%`;

  for (let i = 0; i < positions.length; i++) {
    if (nearestPosition === positions[i]) {
      points[i].classList.add('active');
    } else {
      points[i].classList.remove('active');
    }
  }
}

slider.addEventListener('mousedown', () => {
  document.addEventListener('mousemove', moveThumb);
});

document.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', moveThumb);
});

points.forEach((point, index) => {
  point.addEventListener('click', () => {
    thumb.style.left = `${positions[index]}%`;
    for (let i = 0; i < points.length; i++) {
      points[i].classList.remove('active');
    }
    point.classList.add('active');
  });
});

/*- meter-calc -*/
$(() => {
  const CALC_COEFF_ATTR = "calc-coeff";
  const CALC_RATE_ATTR = "calc-rate";

  const $slider = $("#calc-slider");
  const $sliderOutput = $("#slider-output");
  const $calcOutput = $("#calc-output");

  function calculatePrice() {
    const coeff = $(`[data-${CALC_COEFF_ATTR}]:checked`).data(CALC_COEFF_ATTR);
    const rate = $(`[data-${CALC_RATE_ATTR}]:checked`).data(CALC_RATE_ATTR);
    const area = $slider.val();

    $calcOutput.val(((rate * area) / coeff).toLocaleString("ru-RU") + " руб.");
  }

  function getMinMaxValue(value) {
    return !isNaN(value) ? Math.max(30, Math.min(100, value)) : 30
  }

  function initializeCalc() {
    $sliderOutput.val($slider.val());

    $slider.on("input", function (e) {
      $sliderOutput.val(e.target.value);
      calculatePrice();
    });

    $sliderOutput.on("input", function (e) {
      const value = parseInt(e.target.value);

      $slider.val(getMinMaxValue(value));
      calculatePrice();
    });

    $sliderOutput.on("blur", function (e) {
      const value = parseInt(e.target.value);

      $sliderOutput.val(getMinMaxValue(value));
    });

    $(`[data-${CALC_COEFF_ATTR}], [data-${CALC_RATE_ATTR}]`).on(
      "change",
      function () {
        calculatePrice();
      }
    );
  }

  initializeCalc();
  calculatePrice();
});

/*- auto-field -*/
var inputElements = document.getElementsByClassName("auto-field__input");
var outputElements = document.getElementsByClassName("auto-field__text");

for (var i = 0; i < inputElements.length; i++) {
  inputElements[i].style.width = outputElements[i].offsetWidth + "px";
}

for (var i = 0; i < inputElements.length; i++) {
  inputElements[i].addEventListener("input", function() {
    var index = Array.prototype.indexOf.call(inputElements, this);
    var text = this.value;
    outputElements[index].innerText = text;
    this.style.width = outputElements[index].offsetWidth + "px";
  });
}