
var mainListArray = [{
    "לסגור אולם": [
        " לסגור עם DJ / נגנים",
        "להחליט ולתכנן עיצוב אולם",
        "לסגור עם מעצב אולם",
        "לעשות סידורי ישיבה",
        "להכין רשימת אורחים סופית עם טלפונים ושמות מלאים לתיאום הגעה",
        "לסגור צלם + מגנטים",
        "להכין פלייליסט לחתונה",
        "להכין רשימת אביזרים אקסטרה לאולם",
        "לארגן מתנות לאורחים",
        "טעימות ובניית תפריט",
        "סגירת סידור עם האולם",
        "לתאם הסעות לאולם"
    ]
}, {
    "להמציא מסמכים לפתיחת תיק רבנות": [
        " לפתוח תיק ברבנות",
        "לסגור עם רב",
        "לתאם הדרכות חתן וכלה",
        "לסיים הדרכות חתן וכלה",
        "לתאם מקווה",
        "להזמין כתובה",
    ]
}, {
    "להכין SAVE THE DATE": [
" לשלוח SAVE THE DATE",
"לעצב הזמנות",
"להדפיס הזמנות",
"לחלק ולשלוח הזמנות",
"להזמין טבעות נישואין",
"לתאם רכב + נהג לחתונה",
"לדאוג לקישוט רכב",
    ]
},{
    "לסגור עם מאפרת+שיער":[
" לעשות סיור שמלות",
"להחליט על עיצוב שמלה",
"למצוא ולתאם עם תופרת",
"לקנות חליפת חתן",
"לארגן אביזרים לשושבינות",
"לבחור שושבינות",
"לתאם מסיבות רווקים רווקות",
"לארגן מסיבת אירוסין",
"להסוף שמלה + נעליים",
"לעשות קנייה מרוכזת לאביזרים תכשיטים",
"להזמין/לקנות זר כלה לחתונה",
    ]
}]

var mainList = document.getElementById("mainList");

function updateMainListFromArray() {

    mainList.innerHTML = "";
    let li1InnerText = "";

    mainListArray.forEach((val, i) => {

        let keyName = Object.keys(val)[0];

        let valsArr = val[keyName];


        if (valsArr.length > 0) {

            let li2InnerText = ""

            valsArr.forEach((val2, i2) => {

                li2InnerText += `<li id="${"l" + i + "_ul_l" + i2}"> ${val2} <button id="${"l" + i + "_ul_l" + i2 + "_btn"}" data-id="${i + "," + i2}"> - </button>
                <button id="${"+" + "," + i + "," + i2}" data-id="${"+" + "," + i + "," + i2}"> + </button> </li>`

            })

            let ul2InnerText = `<ul id="${"l" + i + "_ul_l"}">${li2InnerText}</ul>`;

            li1InnerText = `<li id="${"l" + i}"> ${keyName} <button id="${"l" + i + "_btn"}" data-id="${i + ""}"> - </button> ${ul2InnerText} 
            <button id="${"+" + "," + i}" data-id="${"+" + "," + i}"> + </button> </li>`



        } else {
            li1InnerText = `<li id="${"l" + i}">${keyName} <button id="${"l" + i + "_btn"}" data-id="${i + ""}"> - </button> 
             <button id="${"+" + "," + i + "," + 0}" data-id="${"+" + "," + i + "," + 0}"> + </button>  </li> `

        }

        mainList.innerHTML += li1InnerText;

    })
}

updateMainListFromArray();


document.addEventListener("click", (e) => {
    let elem = document.getElementById(e.target.id) || { tagName: "" };

    if (elem.tagName == "BUTTON") {
        let indexStr = elem.dataset.id;
        indexStr = indexStr.split(",");
        console.log(indexStr)

        if (indexStr.length > 1) {
            if (indexStr[0] != "+") {

                if (mainListArray.length > 1) {
                    Object.values(mainListArray[indexStr[0]])[0].splice(indexStr[1], 1)
                }

            } else {
                //+ case:
                if (indexStr.length > 2) {
                    let str = prompt("הכנס משימה");
                    console.log(Object.values(mainListArray[indexStr[1]])[0])
                    Object.values(mainListArray[indexStr[1]])[0].push(str)
                } else {
                    let str = prompt("הכנס משימה");
                    let ob = {}
                    ob[str] = [];
                    mainListArray.push(ob);
                }

            }
        } else {
            if (mainListArray.length > 1) {
                mainListArray.splice(indexStr, 1)
            }
        }

        updateMainListFromArray();

    }
})



