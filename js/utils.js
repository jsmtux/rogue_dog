//min and max are inclusive
function randomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function cloneObject(_object)
{
  // This won't work on dates
  // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/5344074#5344074
  return JSON.parse(JSON.stringify(_object));
}

Phaser.Plugin.SlickUI.prototype.removeAll         =
SlickUI.Element.Button.prototype.removeAll        =
SlickUI.Element.Checkbox.prototype.removeAll      =
SlickUI.Element.DisplayObject.prototype.removeAll =
SlickUI.Element.Panel.prototype.removeAll         =
SlickUI.Element.Slider.prototype.removeAll        =
SlickUI.Element.Text.prototype.removeAll          =
SlickUI.Element.TextField.prototype.removeAll     =
function(destroy, silent, destroyTexture) {
  this.container.displayGroup.removeAll(destroy, silent, destroyTexture);
};