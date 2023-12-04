const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


//middleware
app.use(express.json())
app.use(cors())



const uri = "mongodb+srv://snapSale:snapSale1122@cluster0.oqkryfl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const userCollaction = client.db('skyGoal').collection('users')

async function run() {
  try {
    await client.connect();
      app.get('/', (req, res) => {
          res.send('hello world')
      })

      app.post('/signup', async (req, res) => {
          const data = req.body
          const findFromDatabase = await userCollaction.findOne({ email: data.email })
          if (findFromDatabase) {
               res.send({msg:'this email alredy used'})
          } else {
              const insertedUser = await userCollaction.insertOne(req.body)
              res.send(insertedUser)
           }
      })

      app.post('/signin', async (req, res) => {
          const data = req.body
          const findFromDatabase = await userCollaction.findOne({ email: data.email })
          if (findFromDatabase) {
              res.send({status:true})
          } else {
              res.send({ msg: 'ivalid user please provide a valid email and password' })
          }
        //   const findFromDatabase = await userCollaction.findOne({
        //       $and: [
        //           { email: data.email },
        //           {password:data.password}
        //       ]
        //   })
        //   console.log(findFromDatabase)
      })

      app.listen(port, () => {
          console.log('server is running on 5000 port')
      })
  } finally {
   
  }
}
run().catch(console.dir);
