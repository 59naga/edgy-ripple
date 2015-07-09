(function() {
  var EdgyRipple, Promise, calcRipple, round1, style;

  Promise = Q.Promise;

  style = document.createElement('style');

  style.textContent = '.edgy-ripple {\n  position: relative;\n}\n.edgy-ripple canvas{\n  position:absolute;\n  top:0;\n  left:0;\n  right:0;\n  bottom:0;\n}';

  document.head.appendChild(style);

  calcRipple = function(t, max) {
    var begin, i, opacity, scale;
    i = t / max;
    begin = .25;
    scale = i + begin;
    scale += (1 - begin) * i;
    opacity = .5;
    if (i + begin > 1) {
      opacity -= (i + begin - 1) / begin * .5;
      opacity = round1(opacity);
    }
    return {
      scale: scale,
      opacity: opacity
    };
  };

  round1 = function(value) {
    return Math.round(value * 10) / 10;
  };

  window.addEventListener('load', function() {
    var element, elements, j, len, results;
    elements = document.querySelectorAll('.edgy-ripple');
    results = [];
    for (j = 0, len = elements.length; j < len; j++) {
      element = elements[j];
      results.push(edgyRipple.upgrade(element));
    }
    return results;
  });

  EdgyRipple = (function() {
    function EdgyRipple() {}

    EdgyRipple.prototype.size = 2;

    EdgyRipple.prototype.frame = 60;

    EdgyRipple.prototype.upgrade = function(element) {
      return element.addEventListener('click', function(event) {
        var canvas, context, key, ref, value;
        canvas = document.createElement('canvas');
        ref = element.getBoundingClientRect();
        for (key in ref) {
          value = ref[key];
          canvas.setAttribute(key, value);
        }
        element.appendChild(canvas);
        context = canvas.getContext('2d');
        return new Promise(function(resolve, reject, notify) {
          var deferred, h, height, i, j, k, length, next, pixels, ref1, ref2, size, v, width, x, y;
          i = 0;
          requestAnimationFrame(function() {
            return next();
          });
          size = canvas.width > canvas.height ? canvas.width : canvas.height;
          pixels = [];
          length = size / window.edgyRipple.size;
          for (h = j = 0, ref1 = length; 0 <= ref1 ? j <= ref1 : j >= ref1; h = 0 <= ref1 ? ++j : --j) {
            for (v = k = 0, ref2 = length; 0 <= ref2 ? k <= ref2 : k >= ref2; v = 0 <= ref2 ? ++k : --k) {
              x = h * window.edgyRipple.size;
              y = v * window.edgyRipple.size;
              width = window.edgyRipple.size;
              height = window.edgyRipple.size;
              deferred = 0;
              pixels.push({
                x: x,
                y: y,
                width: width,
                height: height,
                deferred: deferred
              });
            }
          }
          return next = function() {
            var opacity, ref3, scale;
            ref3 = calcRipple(i, window.edgyRipple.frame), scale = ref3.scale, opacity = ref3.opacity;
            width = canvas.width * scale;
            height = canvas.height * scale;
            x = event.clientX | 0;
            y = event.clientY | 0;
            canvas.setAttribute('style', "opacity:" + opacity + ";");
            notify({
              x: x,
              y: y,
              width: width,
              height: height,
              scale: scale,
              opacity: opacity,
              pixels: pixels
            });
            if (i++ !== window.edgyRipple.frame) {
              return requestAnimationFrame(next);
            }
            return resolve(i);
          };
        }).progress(function(arg) {
          var a, aMove, b, bMove, height, j, len, opacity, pixel, pixels, red, results, scale, size, width, x, y;
          x = arg.x, y = arg.y, width = arg.width, height = arg.height, scale = arg.scale, opacity = arg.opacity, pixels = arg.pixels;
          size = width > height ? width : height;
          results = [];
          for (j = 0, len = pixels.length; j < len; j++) {
            pixel = pixels[j];
            if (pixel.rendered) {
              continue;
            }
            red = Math.atan2(pixel.y - y, pixel.x - x);
            a = pixel.x - x;
            aMove = a * Math.cos(red);
            b = pixel.y - y;
            bMove = b * Math.sin(red);
            if (aMove + bMove < size / 2) {
              if (scale > .25 && pixel.deferred < 3 && (Math.random() < 0.5)) {
                pixel.deferred++;
                continue;
              }
              context.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);
              results.push(pixel.rendered = true);
            } else {
              results.push(void 0);
            }
          }
          return results;
        }).then(function(i) {
          return element.removeChild(canvas);
        });
      });
    };

    return EdgyRipple;

  })();

  window.edgyRipple = new EdgyRipple;

  window.edgyRipple.EdgyRipple = EdgyRipple;

}).call(this);
