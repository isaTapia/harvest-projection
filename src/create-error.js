module.exports = function(name, message, code = 500) {
  const error = Error(message)
  error.name = name
  error.code = code
  return error
}
