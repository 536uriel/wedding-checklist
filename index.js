const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
var _dirname = path.resolve();
const { Storage } = require('@google-cloud/storage');

// const storage = process.env.NODE_ENV === 'production'
//     ? new Storage() // GCP auto auth
//     : new Storage({
//         keyFilename: 'secret.json'
//     });

const storage = new Storage();

const bucketName = 'wedding-checklist-data';
const fileName = 'data.json';

async function setDataFileFromMainListArray(data) {
    try {
        const file = storage.bucket(bucketName).file(fileName);

        await file.save(JSON.stringify(data, null, 2), {
            contentType: 'application/json',
        });

        console.log('File updated successfully!');
        return 'File updated successfully!';

    } catch (error) {
        console.error('Error handling JSON file:', error.message);
        return 'Error handling JSON file:';
    }
}

async function getMainListArray() {
    try {
        const file = storage.bucket(bucketName).file(fileName);

        const [contents] = await file.download();
        const data = JSON.parse(contents.toString());

        console.log('Read data:', data);
        return data;

    } catch (error) {
        console.error('Error handling JSON file:', error.message);
        return null;
    }
}



// Use the built-in JSON body parser middleware
app.use(express.json());

app.use(express.static(path.join(_dirname, 'public')))

app.get("/getArray", async (req, res) => {
    let mainListArray = await getMainListArray();
    if (mainListArray !== null) {
        res.send(JSON.stringify(mainListArray))
    } else {
        res.status(500).send(null);
    }

})

app.post("/update", async (req, res) => {
    if (req.body !== null) {
        if (req.body.length > 0) {

            let mainListArray = req.body;
            console.log("new rew//", mainListArray)
            let msg = await setDataFileFromMainListArray(mainListArray);
            return res.status(200).send({ message: msg });

        }
    }

    return res.status(400).send(null);

})

app.listen(PORT, () => {
    console.log('app is running on port: ' + PORT);
});



