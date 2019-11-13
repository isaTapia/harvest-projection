const mongoose = require('mongoose')




const hostUri = process.env.MONGODB_URI
if (!hostUri) {
  throw new Error('No value assigned to MONGODB_URI field in the .env file')
}

const connectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

const handleSuccessfulDatabaseConnection = 
  () => console.info(`Connected to database at ${hostUri}`)

const handleDatabaseError = 
  error => console.error(error)


mongoose.connection
  .once('open', handleSuccessfulDatabaseConnection)
  .on('error', handleDatabaseError)
mongoose
  .connect(hostUri, connectionOptions)
  .catch(handleDatabaseError)
