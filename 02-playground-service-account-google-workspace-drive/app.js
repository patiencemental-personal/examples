const { google } = require("googleapis");
const fs = require("fs");

console.log("start..!");

const auth = new google.auth.GoogleAuth({
  keyFile: "./baruncorp-file-service-...-......json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

async function start() {
  const authClient = await auth.getClient();

  console.log("created authClient");

  const driveClient = google.drive({ version: "v3", auth: authClient });

  console.log("created driveClient");

  const sharedDriveName = "_240517_Case3";
  const params = { q: `name = '${sharedDriveName}'` };
  const searchResponse = await driveClient.drives.list(params);
  const { drives } = searchResponse.data;
  console.log(drives);

  const file = {
    filepath: "./data.json",
    newFilename: "data.json",
    originalFilename: "data.json",
    mimetype: "application/json",
  };

  console.log("before upload");

  const uploadResponse = await driveClient.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: file.originalFilename,
      originalFilename: file.originalFilename,
      parents: ["xVC3tbI3rvkUuJMpHO4M4_sHiCd1ZNHG-"],
    },
    media: {
      // mimeType: file.mimetype ?? "",
      body: fs.createReadStream(file.filepath),
    },
  });

  console.log("completed upload");

  const uploadedFile = uploadResponse.data;

  console.log(JSON.stringify(uploadedFile, null, 2));
}

start();
