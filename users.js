var mongoose = require('mongoose')
require('mongoose-type-email')


///////////////////////////////////////////////////////////////////////////
// Database Setup

const server = '127.0.0.1:27017'
const database = 'users'
const connection_parameters = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const db = async () => {
  try {
    mongodb = await mongoose.connect(`mongodb://${server}/${database}`, connection_parameters)
    console.log('Database connection successful')
    return mongodb
  } catch (error) {
    console.log(`Database connection failed :\r\n${error}`)
  }
}

const user_schema = new mongoose.Schema({
  row_id: { type: Number, required: true, unique: true },
  pseudo: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String }
})

const user = mongoose.model('User', user_schema)

////////////////////////////////////////////////////////////////////////////////////
// Mongo queries

module.exports = {
  get: async (user_id) => {
    return await user.findOne({ row_id: user_id })
  },

  count: async () => {
    let number = await user.find({}).countDocuments()

    return { count: number }
  },

  getAll: async (limit, offset) => {
    return await user.find({})
  },

  insert: async (params) => {
    let users = await user.find({})
    let id = 1

    if (users.length > 0) {
      users.forEach(element => {
        if (element.row_id > id) {
          id = element.row_id
        }
      })
      id = parseInt(id) + 1
    }

    let new_user = new user({
      row_id: id,
      pseudo: params.pseudo,
      firstname: params.firstname,
      lastname: params.lastname,
      email: params.email,
      password: params.password
    })

    return await new_user.save()
  },

  update: async (user_id, params) => {
    let updated_user = await user.findOne({ row_id: user_id })

    updated_user.pseudo = params.pseudo
    updated_user.firstname = params.firstname
    updated_user.lastname = params.lastname
    updated_user.email = params.email
    updated_user.password = params.password

    updated_user.save()
  },

  remove: async (user_id) => {
    return await user.deleteOne({ row_id: user_id })
  }
}