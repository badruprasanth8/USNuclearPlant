const chokidar = require('chokidar');
require('log-timestamp');
const fsExtra = require('fs-extra');
const GeoJSON = require('geojson');
const _ = require('underscore');
const KVdb = require('kvdb.io');
const bucket = KVdb.bucket('Pu9kqDqFXji6tvwa7YkKMA', 'irksomeduffer') // access token arg optional

let TotalNuclear=1 ;

const stateabbr = require("./utility/utility");

const UploadedFiles =   __dirname + "\\resources\\static\\assets\\uploads";
const geoJson =   __dirname + "\\resources\\static\\assets\\geojson\\data.geojson";
const reader = require('xlsx');
let key = 'Plant primary fuel';
let searchTerm = 'NUC';



console.log(`Watching for file changes on ${UploadedFiles}`);

// One-liner for current directory
chokidar.watch(UploadedFiles).on('add',async filePath => {  
    if (filePath.includes('.xlsx')) {
      console.log(
        `[${new Date().toLocaleString()}] ${filePath} has been added.`
      );
      //lock the session to avoid race
      await bucket.set('excel', 'Processing');


      // Read content of new file
      let fileData = await readExcelfile(filePath);
      await fsExtra.writeJson(geoJson, fileData);
      //console.log(JSON.stringify(fileData));
      await fsExtra.unlink(filePath);
      console.log(
        `[${new Date().toLocaleString()}] ${filePath} has been removed.`
      );
    }
  });

  function readExcelfile(filePath) {
    return new Promise(async resolve => {
        var fileContent = reader.readFile(filePath);
        let data = [];
        const sheets = fileContent.SheetNames;
        if(fileContent.SheetNames.includes('PLNT20')){
            const temp = reader.utils.sheet_to_json(
                fileContent.Sheets['PLNT20'])
            temp.forEach((res) => {  
                data.push(res);
            });

            // omit other than nuclear plants
            data =  await processExcelFile(data);

            // sort by state 
            _.sortBy(data, function(o) {
                if(o['Plant state abbreviation'] !== undefined){
                 return o['Plant state abbreviation']; 
                }
                });
            
            let states = _.keys(_.countBy(data, function(data) { return data['Plant state abbreviation']; }));
            let CountbyStates =  _.countBy(data, function(data) { return data['Plant state abbreviation']; });

           
         

            for (let [key, value] of Object.entries(CountbyStates)) {
              let fin = data.filter(function (el)
              {
                return el['Plant state abbreviation'] == key; 
              });
                
              if(fin){
                TotalNuclear = await reduceTotalNuclearPlants(fin);
              }
             
               

                data.forEach(function (element) {
                    if(element['Plant state abbreviation'] == key){
                        element['PlantName'] = element['Plant name'];
                        element['TotalPlantsinState'] = value;
                        element['State'] = stateabbr(element['Plant state abbreviation'], 'name');
                        element['PercentForState'] = isWhatPercentOf(element['Plant annual nuclear net generation (MWh)'],TotalNuclear !== null?TotalNuclear:element['Plant annual nuclear net generation (MWh)']);
                        element['AbsoulutePower'] = element['Plant annual nuclear net generation (MWh)'];
                    }   
                  });

                

         };
           


            
         await processGeoJson(JSON.parse(JSON.stringify(data))).then((data)=>resolve(data)).catch(e=>{
            resolve({"Exception":e});
        });;
        }          
             
              
    });
  }



function isWhatPercentOf(numA, numB) {
    return Number(((numA / numB) * 100).toFixed(1));
  }



  function processExcelFile(data){
    return new Promise(resolve => {
        const res = data.filter(o =>{
                if(o[key] !== undefined){
                 return   o[key].toLowerCase().includes(searchTerm.toLowerCase());
                }         
        } 
           );
        
         resolve(res); 
    });
  }

  function reduceTotalNuclearPlants(fin){
    return new Promise(resolve =>{
      let TotalPlants =fin.reduce((accumulator, current) => accumulator + current['Plant annual nuclear net generation (MWh)'], 0);
    resolve(TotalPlants);

    });
  }

  function processGeoJson(data){
    return new Promise(resolve =>{
        resolve(GeoJSON.parse(data, {Point: ['Plant latitude', 'Plant longitude'],include: ['PlantName','State','TotalPlantsinState','PercentForState','AbsoulutePower']}));    
    });
  }

  
  