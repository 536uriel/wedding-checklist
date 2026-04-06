const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
var _dirname = path.resolve();

var mainListArray = [
    { "לסגור אולם": [], "done": false },
    { " לסגור עם DJ / נגנים": [], "done": false },
    {
        "להחליט ולתכנן עיצוב אולם":
            [{ "לסגור עם מעצב אולם": false }, { "לעשות סידורי ישיבה": false }], "done": false
    },
    { "להכין רשימת אורחים סופית עם טלפונים ושמות מלאים לתיאום הגעה": [] },
    { "לסגור צלם + מגנטים": [], "done": false },
    { "להכין פלייליסט לחתונה": [], "done": false },
    { "להכין רשימת אביזרים אקסטרה לאולם": [], "done": false },
    { "לארגן מתנות לאורחים": [], "done": false },
    { "טעימות ובניית תפריט": [], "done": false },
    { "סגירת סידור עם האולם": [], "done": false },
    { "לתאם הסעות לאולם": [], "done": false },
    { "להמציא מסמכים לפתיחת תיק רבנות": [], "done": false },
    { " לפתוח תיק ברבנות": [], "done": false },
    { "לסגור עם רב": [], "done": false },
    { "לתאם הדרכות חתן וכלה": [], "done": false },
    { "לסיים הדרכות חתן וכלה": [], "done": false },
    { "לתאם מקווה": [], "done": false },
    { "להזמין כתובה": [], "done": false },
    { "להכין SAVE THE DATE": [], "done": false },
    { " לשלוח SAVE THE DATE": [], "done": false },
    { "לעצב הזמנות": [], "done": false },
    { "להדפיס הזמנות": [], "done": false },
    { "לחלק ולשלוח הזמנות": [], "done": false },
    { "להזמין טבעות נישואין": [], "done": false },
    { "לתאם רכב + נהג לחתונה": [], "done": false },
    { "לדאוג לקישוט רכב": [], "done": false },
    { "לסגור עם מאפרת+שיער": [], "done": false },
    { " לעשות סיור שמלות": [], "done": false },
    { "להחליט על עיצוב שמלה": [], "done": false },
    { "למצוא ולתאם עם תופרת": [], "done": false },
    { "לקנות חליפת חתן": [], "done": false },
    { "לארגן אביזרים לשושבינות": [], "done": false },
    { "לבחור שושבינות": [], "done": false },
    { "לתאם מסיבות רווקים רווקות": [], "done": false },
    { "לארגן מסיבת אירוסין": [], "done": false },
    { "להסוף שמלה + נעליים": [], "done": false },
    { "לעשות קנייה מרוכזת לאביזרים תכשיטים": [], "done": false },
    { "להזמין/לקנות זר כלה לחתונה": [], "done": false },
]


// Use the built-in JSON body parser middleware
app.use(express.json());

app.use(express.static(path.join(_dirname, 'public')))

app.get("/getArray", (req, res) => {
    res.send(JSON.stringify(mainListArray))
})

app.post("/update", (req, res) => {
    mainListArray = req.body;
    console.log("new rew//", mainListArray)
    res.status(200).send({ message: "Updated successfully" });
})

app.listen(PORT, () => {
    console.log('app is running on port: ' + PORT);
});



