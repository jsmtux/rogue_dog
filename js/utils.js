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