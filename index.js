require('dotenv').config();
let originalUrls, shortUrls;

const express = require('express'),
cors = require('cors'),
app = express(),
port = 3000,
{ client, connect } = require('./db'),

runTheApp=async()=>{
  try{
    await connect();
    await getUrls();
    startServer();
  }catch(err){
    console.error('Error during server initialization:', err);
  }
  
},

getUrls=async ()=>{
  try{
    const urlsList= await client.db('UrlsDb').collection('urlList').find({}).toArray();
    originalUrls=urlsList.map(url=>url.original_url);
    shortUrls=urlsList.map(url=>url.short_url);
  }catch (err) {
    console.error('Error fetching URLs from the database:', err);
  }
},

insertUrl=async(orgl)=>{
  
  try{
    const shrt = shortUrls.length + 1;
    
    await client.db('UrlsDb').collection('urlList').insertOne({
      'original_url':orgl,
      'short_url':shrt
    });
    originalUrls.push(orgl);
    shortUrls.push(shrt.toString());
    return shrt.toString();
    
  }catch (err) { 
    console.error('Error fetching URLs from the database:', err);
  }
},

startServer=()=>{
  app.use(express.urlencoded({extended:true}));
  app.use(cors());
  app.use('/public', express.static(`${process.cwd()}/public`));
  app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });


  app.post('/api/shorturl',async (req,res)=>{
    const userUrl=req.body.url,
    foundedIndex=originalUrls.indexOf(userUrl);

    if(!userUrl.includes('https://')&&!userUrl.includes('http://')) return res.json({ error: 'invalid url' });

    if (foundedIndex < 0) {
      try {
        const shortUrl = await insertUrl(userUrl);
        return res.json({ original_url: userUrl, short_url: shortUrl });
      } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    return res.json({"original_url":userUrl,"short_url":foundedIndex+1});
    
  });
  console.log(shortUrls.indexOf(parseInt('1')))
  app.get('/api/shorturl/:shorturl', (req, res) => {
    const userShortUrl = req.params.shorturl;
    const foundedIndex = shortUrls.indexOf(parseInt(userShortUrl));
    console.log(userShortUrl+' '+foundedIndex);
    if (foundedIndex < 0 || foundedIndex >= originalUrls.length) {
      return res.json({ "error": "No short URL found for the given input" });
    }
  
    res.redirect(originalUrls[foundedIndex]);
  });
  
  

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });



}

runTheApp()
