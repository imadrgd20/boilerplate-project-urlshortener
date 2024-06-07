require('dotenv').config();
const 
express = require('express'),
cors = require('cors'),
app = express(),
// Basic Configuration
port = 3000,
{client,connect}=require('./db'),
getUrls=async ()=>{
  let shortUrls,originalUrls;
  await connect();
  try{
    const urlsList= await client.db('UrlsDb').collection('urlList').find({}).toArray();
    shortUrls=urlsList.map(url=>url.short_url);
    originalUrls=urlsList.map(url=>url.original_url);
  }
  catch(err){
    console.error(err);
  }
  return 
}


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
