const { google } = require("googleapis");

module.exports = async function handler(req, res) {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON, "base64").toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
      fields: "files(id, name, mimeType)",
      orderBy: "createdTime desc",
    });

    const images = response.data.files.map(file => ({
      name: file.name,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`,
    }));

    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load images" });
  }
};
