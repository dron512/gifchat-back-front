const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
// const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@ cluster0-shard-00-00.n7xpd.mongodb.net:27017`;
const MONGO_URL = "mongodb+srv://parkmyounghoi:${MONGO_PASSWORD}@cluster0.n7xpd.mongodb.net/";

console.log(MONGO_URL);

const connect = async () => {
    if (NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    try{
        const res = await mongoose.connect(MONGO_URL, {
            dbName: 'gifchat',
            useNewUrlParser: true,
        })
        console.log('connected successfully'+ res);
    }catch (error) {
        console.error(error);
    }
};

mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

connect()
module.exports = connect;

// const {MongoClient, ServerApiVersion} = require('mongodb');
// const uri = "mongodb+srv://parkmyounghoi:<db_password>@cluster0.n7xpd.mongodb.net/?appName=Cluster0";
//
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
//
// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ping: 1});
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } catch (e) {
//         console.log(e)
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
//
// run().catch(console.dir);
