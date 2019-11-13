const webtoken = require('jsonwebtoken')




module.exports = function(request, response, next) {
  try {
    const token = request.headers.authorization.split(' ')[1]
    const decodedToken = 
      webtoken.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY)
    request.decodedToken = decodedToken
    next()
  } catch (e) {
    console.error(e)
    const report = {
      name: 'NotLoggedIn',
      message: 'User authentication required'
    }
    response.status(401).json(report)
  }
}
