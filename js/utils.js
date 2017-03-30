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