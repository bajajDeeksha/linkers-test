var csv = require('csv-parser'); // ES5
var path = require('path');
var iconv = require('iconv-lite');
var async = require('async');
var fs = require('fs');

CsvParser = {

  findString: function (string,res) {
    async.series([
      (callback) => {
        this.readFolderFiles(string, callback);
      }
    ], (err, results) => {
      if(err){
        throw err;
      }
      res.send(results[0]);
    })
  },



  readFolderFiles: function (string, mainCallback) {
    const fileNames = fs.readdirSync('./CSV');
    const len = fileNames.length;
    const functionArr = [];
    if (len > 0) {
      for (let i = 0; i < len; ++i) {
        const func = (callback) => {
          const fileName = fileNames[i];
          if (path.extname(fileName) === '.CSV') {
            this.readCsv(fileName, string, callback);
          }
        }
        functionArr.push(func);
      }
      async.parallel(functionArr, (err, results) => {
        if(err){
          throw err;
        }
        const isValid = (val) => {
          return val != null;
        }
        const flattenArray = function(results){
          const finalResult = [];
          for(let key in results){
            const val = results[key];
            for(let innerKey in val){
              const innerVal = val[innerKey];
                finalResult.push(innerVal);
            }
          }
          return finalResult;
        }

        let finalResult = flattenArray(results);
        finalResult = finalResult.filter(isValid);
        mainCallback(null, finalResult);
      });
    } else {
      console.log("No files!!");
      mainCallback(null);
    }
  },

  readCsv: function (fileName, string, callback) {
    const fileArr = [];
    const checkString = (data, string) => {
      for (let key in data) {
        const mainString = data[key];
        if (mainString.indexOf(string) > -1) {
          //Converting Objects to array
          if(!Array.isArray(data)){
            const newData = [];
            for(let key in data){
              newData.push(data[key]);
            }
            data = newData;
          }
          fileArr.push(data);
          break;
        }
      }
    }
    fs.createReadStream(`CSV/${fileName}`)
      .pipe(iconv.decodeStream('sjis'))
      .pipe(iconv.encodeStream('utf8'))
      .pipe(csv())
      .on('headers', (data) => {
        checkString(data, string);
      })
      .on('data', (data) => {
        checkString(data, string);
      })
      .on('end', () => {
        if (fileArr.length > 0) {
          callback(null, fileArr);
        } else {
          callback(null);
        }
      })
  }
}

module.exports = CsvParser;
