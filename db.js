require('dotenv').config();
const {MongoClient}= require('mongodb'),
uri ='mongodb+srv://reguadiimad20:Macbook2020@cluster0.bvmpjom.mongodb.net/',
client=new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true }),
connect= async ()=>{
    try{ 
        await client.connect();
        console.log('conected');
    }
    catch(err){
        console.error(err)
    }

}
module.exports={client,connect}