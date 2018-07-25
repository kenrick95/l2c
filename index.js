var x = {
  0: '![]',
  1: '!![]'
};
function getExpression(number) {
  if (number === 0) {
    return '+' + x[0];
  } else if (number === 1) {
    return '+' + x[1];
  } else {
    // TODO: Do some complicated magic
    return getExpression(number - 1) + '+' + x[1];
  }
}
module.exports = {
  getExpression: getExpression
};
