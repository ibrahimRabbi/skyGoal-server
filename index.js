const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
const accessToken = "11b9f30ffe457554a235d7011288010a3ac858fbbce0b5e3690e41386f14b8c6f54c7466df42066dbb7d66f3a3b40d5352c99badad7914f1813d26aaf2aa033d"

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

//json web token middleware
const verifyJwt = (req, res, next) => {
  console.log('hwt verify func hitting')
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).send({ error: true, message: "unauthorizde access" })
  }
  jwt.verify(token, accessToken, (error, decode) => {
    if (error) {
      return res.status(403).send({ error: true, message: 'unauthorized access' })
    }
    req.decode = decode
    next()
  })
}

async function run() {
  try {
    await client.connect();
      app.get('/', (req, res) => {
          res.send('hello world')
      })
    
    app.get('/verified', verifyJwt, (req, res) => {
      if (req.decode) {
         res.send(req.decode)
       }
    })

//sign up authentication Api 
      app.post('/signup', async (req, res) => {
          const data = req.body
          const findFromDatabase = await userCollaction.findOne({ email: data.email })
          if (findFromDatabase) {
               res.send({msg:'this email alredy used'})
          } else {
            const token = jwt.sign({email:data.email}, accessToken, { expiresIn: '1h' })
              const insertedUser = await userCollaction.insertOne(req.body)
            res.send({ refreshToken: token,insertedUser })
           }
      })
    
    
// sign in authentication api
      app.post('/signin', async (req, res) => {
          const data = req.body
          const findFromDatabase = await userCollaction.findOne({
              $and: [
                  { email: data.email },
                  {password:data.password}
              ]
          })
        
        if (findFromDatabase) {
            res.send({status:true})
        } else {
            res.send({ msg:'ivalid user please provide a valid email and password'})
        }
           
      })


    // app.post('/jwt', (req, res) => {
    //   const user = req.body
    //   console.log(user)
     
    //   res.send()
    // })



      app.listen(port, () => {
          console.log('server is running on 5000 port')
      })
  } finally {
   
  }
}
run().catch(console.dir);
