import nc from "next-connect";

const handler = nc();

handler.post(async (req, res) => {
  
  return res.status(200).json({ folderName: req.body.folder });
});

export default handler;
