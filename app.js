const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const path = require('path');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  console.log(req.body)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ message: 'WELCOME' })
})

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".zip")
    // cb(null, file.fieldname + '-' + Date.now() + ".jpeg")
  }
})

var upload = multer({ storage: storage })

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  console.log(req.body.fileSelected)
  console.log(req.file)
  const file = req.file;
  const data = 'https://www.nasa.gov/sites/default/files/thumbnails/image/image_functional_test.jpg';

  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send({ file, data })

})

// define a route to download a file 
app.get('/downloadfile', (req, res) => {
  // var file = req.params.filename;
  var fileLocation = path.join(__dirname, 'uploads/myFile-1612332941421.zip');
  console.log(fileLocation);
  res.sendFile(fileLocation);
});

app.listen(3000, () => {
  console.log("server is up")
})