exports.uploadFile = (req, res) => {
  console.log("===============================================");
  console.log("File upload request received", req.body);
  console.log("File upload request received11111s", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  return res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/${req.query.folderName}/${req.file.filename}`,
  });
};
