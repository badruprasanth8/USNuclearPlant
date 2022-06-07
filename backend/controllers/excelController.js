const readXlsxFile = require("read-excel-file/node");
const upload = async (req, res) => {
    try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload an excel file!");
      }
      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
      });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Could not upload the file: " + req.file.originalname,
        });
    }
};