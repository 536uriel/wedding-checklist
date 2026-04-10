const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
var _dirname = path.resolve();
const fs = require('node:fs/promises');

async function setDataFileFromMainListArray(data) {
    const filePath = './data.json';

    try {

        // --- WRITE ---
        // JSON.stringify params: (object, replacer, space)
        // Using '2' for the space parameter makes the file human-readable
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('File updated successfully!');
        return 'File updated successfully!';

    } catch (error) {
        console.error('Error handling JSON file:', error.message);
        return 'Error handling JSON file:';
    }
}

async function getMainListArray() {
    const filePath = './data.json';

    try {
        // --- READ ---
        const rawData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawData);
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



