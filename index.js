const express = require("express");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();

const port = 5000;

cloudinary.config({
  cloud_name: "shub",
  api_key: "243562743221418",
  api_secret: "golVoHfX5loM64_NRlR3TbmEg-U",
});

app.set("view engine", "ejs");

// using express json middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true, // this function comes in handy if want to use the move function on the express-fileupload library
    tempFileDir: "/temp/",
  })
);

app.get("/myget", (req, res) => {
  console.log(req.body);
  res.send(req.query);
});

app.post("/mypost", async (req, res) => {
  res.send(req.body);
  console.log(req.files.fileupload);

  let result;
  let imageArray = [];

  // ### case for pultiple images
  if (req.files) {
    for (let index = 0; index < req.files.samplefile.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.samplefile[index].tempFilePath,
        {
          folder: "probackend"
        }
      );

      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url
      });
    }
  }

  // ### use case for single file upload
  // let file=req.files.fileupload

  // result= await cloudinary.uploader.upload(file.tempFilePath, {
  //     folder:"probackend"
  // } )
  // console.log(result)

  let details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    result,
    imageArray,
  };

  console.log(details);
  res.send(details);
});
app.get("/mygetform", (req, res) => {
  res.render("getform");
});
app.get("/mypostform", (req, res) => {
  res.render("postform");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
