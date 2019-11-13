require('dotenv').config()
require('./db-config')
const app = require('./app-config')




async function main() {
  const port = app.get('port')

  if (!port) {
    throw new Error('No value assigned to PORT field in the .env file')
  }

  await app.listen(port)
  console.info(`Server started on port ${port}`)
}


main()
