const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {expressjwt: jwt} = require('express-jwt');
const fs = require('fs');
const cors = require('cors');

const {excelFilter} = require("./middleware/upload");

const fileupload = require("express-fileupload");
app.use(fileupload());
const jwks = require('jwks-rsa');
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


const jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-s7kim5zq.eu.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://prampta.com',
    issuer: 'https://dev-s7kim5zq.eu.auth0.com/',
    algorithms: ['RS256']
});

//TODO: Use JWT client credentials 
//app.use(jwtCheck);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/getGeoData', (req, res) => {
  fs.readFile(__dirname + "/resources/static/assets/geojson/data.geojson", (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
});
});

app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.send("File was not found");
    return;
  }

  // wait for the process to complete before taking a new job
 
 
    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    data = req.files.data;
    uploadPath =  __dirname + "/resources/static/assets/uploads/" + data.name;

    excelFilter(req,data,(err)=>{
      if(err){
        return res.status(500).send(err);
      }   
      else{
        // Use the mv() method to place the file somewhere on your server
        data.mv(uploadPath, (err)=>{
          if (err)
            return res.status(500).send(err);

          res.send('File uploaded!');
        });
      }

    });

  
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});