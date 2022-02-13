import { ObjectId } from "mongodb";

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const connectionUrl = 'mongodb://127.0.0.1/12707';
const databaseName = 'task-manager';

mongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("unable to connect to database");
    }
    const db = client.db(databaseName);
    // db.collection('users').insertOne({
    //     name: "monit",
    //     age: 23
    // },(error,result)=>{
    //     if(error){
    //         console.log("unable to insert");
    //     }
    //     console.log(result);
    //     console.log(result.ops);
    // })

    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectId("6203e42579d0f98c73b2fafc") 
    },{
        $set:{
            name:"mike"
        }
    })
    updatePromise.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error)
    })
})