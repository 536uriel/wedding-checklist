async function setPage() {

    var url = undefined || "/getArray";


    async function createPost(postData) {
        try {
            const response = await fetch("/update", {
                method: 'POST', // Specify the method
                headers: {
                    'Content-Type': 'application/json', // Inform the server the body is JSON
                },
                body: JSON.stringify(postData), // Convert the JavaScript object to a JSON string
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Parse the JSON response
            //console.log(data); // The newly created post object returned from the server
        } catch (error) {
            // Handle network errors or the error thrown above
            console.error('There was a problem with the fetch operation:', error);
        }
    }


    var mainListArray = null;
    var db = localStorage.getItem("mainListArray");

    try {
        let res = await fetch(url);
        let res2 = await res.json();
        console.log("get array")
        console.log(res2)
        mainListArray = res2;

    } catch (error) {
        console.log(error)
        mainListArray = db;
    }



    var mainList = document.getElementById("mainList");

    var draggedItem = null;

    function updateMainListFromArray() {

        mainList.innerHTML = "";
        let li1InnerText = "";

        mainListArray.forEach((val, i) => {

            let keyName = Object.keys(val)[0];

            let isDone = Object.values(val)[1];

            let dateStr = "";

            dateStr = ((val).hasOwnProperty("date") ? val["date"] : "");


            let valsArr = val[keyName];


            if (valsArr.length > 0) {

                let li2InnerText = ""

                valsArr.forEach((val2, i2) => {

                    let keyname2 = Object.keys(val2)[0]
                    let isDone2 = val2[keyname2];

                    console.log("isdone - ", isDone2)

                    li2InnerText += `<li contenteditable="false" id="${"l" + i + "_ul_l" + i2}"> ${keyname2} <button contenteditable="false" id="${"l" + i + "_ul_l" + i2 + "_btn"}" data-id="${i + "," + i2}"> - </button>
                <button contenteditable="false" id="${"+" + "," + i + "," + i2}" data-id="${"+" + "," + i + "," + i2}"> + </button> 
                <input id="${"l" + i + "_ul_l" + i2 + "checkbox"}" data-id="${i + "," + i2 + "," + "checkbox"}" type="checkbox" ${(isDone2 ? "checked" : "")}> </li>`

                })

                let ul2InnerText = `<ul id="${"l" + i + "_ul_l"}">${li2InnerText}</ul>`;

                li1InnerText = `<li contenteditable="false" id="${"l" + i}"> ${keyName} <button contenteditable="false" id="${"l" + i + "_btn"}" data-id="${i + ""}"> - </button> ${ul2InnerText} 
            <button contenteditable="false" id="${"+" + "," + i}" data-id="${"+" + "," + i}"> + </button> 
            <input id="${"+" + "," + i + "checkbox"}" data-id="${i + "," + "checkbox"}" type="checkbox" ${(isDone ? "checked" : "")}> 
            <strong class="date"> <div style="display: inline-block;"> ${dateStr} </div> <input type="date" id="${i + "," + "date"}"> בחר תאריך יעד </strong> </li>`



            } else {

                li1InnerText = `<li contenteditable="false" id="${"l" + i}">${keyName} <button contenteditable="false" id="${"l" + i + "_btn"}" data-id="${i + ""}"> - </button> 
             <button contenteditable="false" id="${"+" + "," + i + "," + 0}" data-id="${"+" + "," + i + "," + 0}"> + </button>  
             <input id="${"+" + "," + i + "," + 0 + "checkbox"}" type="checkbox" data-id="${i + "," + "checkbox"}" ${(isDone ? "checked" : "")}>  
             <strong class="date"> <div style="display: inline-block;"> ${dateStr} </div> <input type="date" id="${i + "," + "date"}"> בחר תאריך יעד </strong> </li> `

            }

            mainList.innerHTML += li1InnerText;

        })
    }

    function getOwnText(element) {
        let text = '';
        // Iterate over all direct children of the element
        for (const node of element.childNodes) {
            // Check if the node is a text node (nodeType 3)
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            }
        }
        return text.trim(); // Use .trim() to remove excess whitespace/newlines
    }

    function updateArrayFromLists() {
        //!create new array based on the lists:
        mainListArray = [];

        document.querySelectorAll("body>ul:first-of-type>li").forEach((parentLi, i) => {
            let keyName = getOwnText(parentLi);
            let ob = {};
            ob[keyName] = []

            let checkbox = parentLi.querySelector(':scope > input[type="checkbox"]');
            if (typeof checkbox === 'object' && checkbox !== null) {
                ob["done"] = checkbox.checked;
            } else {
                ob["done"] = false;
            }

            let div = parentLi.querySelector(':scope > strong > div');




            if (typeof div === 'object' && div !== null) {


                let dateStr = div.innerText;
                if (dateStr.length > 1) {

                    ob["date"] = dateStr
                    console.log(div)
                    console.log(dateStr);
                }


            }



            mainListArray.push(ob);
        });


        document.querySelectorAll("body>ul:first-of-type>li").forEach((parentLi, i) => {
            let keyName = getOwnText(parentLi);

            document.querySelectorAll("ul li ul li").forEach((childLi, j) => {

                if (childLi.parentElement.parentElement === parentLi) {

                    let childLiStr = getOwnText(childLi);

                    let ob = {};

                    let checkbox = childLi.querySelector(`input[type="checkbox"]`);
                    if (typeof checkbox === 'object' && checkbox !== null) {
                        ob[childLiStr] = checkbox.checked;
                    } else {
                        ob[childLiStr] = false;
                    }

                    mainListArray[i][keyName].push(ob);

                }

            });


        });


        createPost(mainListArray).then(res => {
            //console.log(res)
            localStorage.setItem("mainListArray", JSON.stringify(mainListArray));

        });
    }

    var mainLiDraggedItem = null;
    var parentLiOrChildLi = ""

    function resetDragableClasses() {

        document.querySelectorAll("body>ul:first-of-type>li").forEach(mainLi => {
            mainLi.classList.add("draggable")
            mainLi.classList.add("unselectable")
            mainLi.setAttribute("draggable", "true");


            mainLi.addEventListener("dragstart", (e) => {
                mainLiDraggedItem = mainLi;
                parentLiOrChildLi = "parent"
                e.stopPropagation();
            });

            mainLi.addEventListener("dragover", e => {
                e.preventDefault();
            });

            mainLi.addEventListener("drop", e => {
                e.preventDefault();

                //IMPORTANT: prevent moving into itself or its descendants
                if (parentLiOrChildLi == "child") return;


                mainLi.parentNode.insertBefore(mainLiDraggedItem, mainLi);

                updateArrayFromLists();
                //$new code
                update();

            });
        });


        document.querySelectorAll("ul li ul li").forEach(li => {
            li.classList.add("draggable")
            li.classList.add("unselectable")
            li.setAttribute("draggable", "true");


            li.addEventListener("dragstart", (e) => {
                draggedItem = li;
                parentLiOrChildLi = "child"
                e.stopPropagation();
            });

            li.addEventListener("dragover", e => {
                e.preventDefault();
            });

            li.addEventListener("drop", e => {
                e.preventDefault();

                if (!(draggedItem instanceof HTMLElement)) {
                    return;
                }

                //IMPORTANT: prevent moving into itself or its descendants
                if (draggedItem.contains(li) || parentLiOrChildLi == "parent") return;

                li.parentNode.insertBefore(draggedItem, li);
                //!need to test!!

                updateArrayFromLists();
                //$new code
                update();


            });
        })
    }

    //#new code

    function addTouchSupport() {

        let currentDragged = null;
        let touchTimer = null;
        let isDragging = false;

        //$new code
        function isInteractive(el) {
            return el.closest("input, textarea, select, button");
        }



        // ===== TOUCH START =====
        document.addEventListener("touchstart", (e) => {


            //$new code
            e.stopPropagation();
            if (isInteractive(e.target)) {
                isDragging = false;
                return;
            }

            touchTimer = setTimeout(() => {

                //$new code
                e.stopPropagation();
                if (isInteractive(e.target)) {
                    isDragging = false;
                    return;
                }

                isDragging = true;

                const li = e.target.closest("li");
                if (!li) return;



                // Parent LI
                if (li.parentNode.matches("body > ul:first-of-type")) {
                    mainLiDraggedItem = li;
                    parentLiOrChildLi = "parent";
                }
                // Child LI
                else if (li.parentNode.closest("ul")) {
                    draggedItem = li;
                    parentLiOrChildLi = "child";
                }

                currentDragged = li;
                li.classList.add("dragging");

            }, 500);

        }, { passive: true });


        // ===== TOUCH MOVE =====
        document.addEventListener("touchmove", (e) => {
            if (!currentDragged) return;

            if (isDragging && e.cancelable) {
                e.preventDefault();
            }
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const li = target?.closest("li");

            if (!li || li === currentDragged) return;

            // ===== PARENT MOVE =====
            if (parentLiOrChildLi === "parent") {
                if (li.parentNode.matches("body > ul:first-of-type")) {
                    li.parentNode.insertBefore(mainLiDraggedItem, li);
                }
            }

            // ===== CHILD MOVE =====
            if (parentLiOrChildLi === "child") {
                if (draggedItem.contains(li)) return;

                if (li.parentNode === currentDragged.parentNode) {
                    li.parentNode.insertBefore(draggedItem, li);
                }
            }

        }, { passive: false });


        // ===== TOUCH END =====
        document.addEventListener("touchend", () => {

            isDragging = false;
            clearTimeout(touchTimer);

            if (!currentDragged) return;

            currentDragged.classList.remove("dragging");

            updateArrayFromLists();

            //$new code
            update();

            currentDragged = null;
            draggedItem = null;
            mainLiDraggedItem = null;
            parentLiOrChildLi = null;
        });
    }


    //$new code
    update();

    var dateClicked = null;


    document.addEventListener("click", (e) => {

        let elem = document.getElementById(e.target.id) || { tagName: "" };

        if (typeof elem !== 'object' || elem === null) {
            return;
        }


        console.log(elem)
        if (!(elem.tagName.toLowerCase() === "input")) {

            e.preventDefault();


            if (e.target.id == "addBtn") {
                return;
            }

            if (elem.tagName == "BUTTON") {
                let indexStr = elem.dataset.id;
                indexStr = indexStr.split(",");
                console.log(indexStr)



                if (indexStr.length > 1) {
                    //case " - "
                    if (indexStr[0] != "+") {

                        if (mainListArray.length > 1) {
                            Object.values(mainListArray[indexStr[0]])[0].splice(indexStr[1], 1)
                        }

                    } else {
                        //+ case -> case child li:
                        if (indexStr.length > 2) {
                            let str = prompt("הכנס משימה");
                            console.log(Object.values(mainListArray[indexStr[1]])[0])
                            let ob = {};
                            ob[str] = false;
                            Object.values(mainListArray[indexStr[1]])[0].push(ob);
                        } else {
                            let str = prompt("הכנס משימה");
                            let ob = {}
                            ob[str] = [];
                            ob["done"] = false;
                            mainListArray.push(ob);
                        }

                    }
                } else {
                    //case parent li
                    if (mainListArray.length > 1) {
                        mainListArray.splice(indexStr, 1)
                    }
                }

                //$new code
                update();

            }
        } else {
            //checkbox - case:
            if (elem.tagName.toLowerCase() === "input" && elem.type === "checkbox") {


                console.log("checkbox case");


                let checked = elem.checked;

                console.log(checked)

                let indexStr = elem.dataset.id;
                indexStr = indexStr.split(",");


                //case of: indexStr = [i, checkbox]
                if (indexStr.length <= 2) {
                    mainListArray[indexStr[0]]["done"] = checked;
                    console.log(mainListArray[indexStr[0]]["done"])
                } else {
                    //case of: indexStr = [i, j, checkbox]
                    let i = indexStr[0];
                    let j = indexStr[1];
                    let keyName = Object.keys(mainListArray[i])[0];
                    let keyname2 = Object.keys(mainListArray[i][keyName][j])[0];

                    console.log(mainListArray[i][keyName][j][keyname2])

                    mainListArray[i][keyName][j][keyname2] = checked;
                }

                update();
            }

            //$new code
            //date case
            if (elem.tagName.toLowerCase() === "input" && elem.type === "date") {

                console.log("date case");
                dateClicked = elem;

                function handler(e) {
                    if (typeof dateClicked === 'object' || dateClicked !== null) {
                        let dateStr = dateClicked.value;
                        if (dateStr) {

                            let i = dateClicked.id.split(",")[0];

                            mainListArray[i]["date"] = dateStr;
                            console.log("date was picked");

                            update(() => {
                                dateClicked.removeEventListener("change", handler);
                            });


                        }
                    }

                }

                dateClicked.addEventListener("change", handler);

            }



        }

    });

    //@new code
    function update(callback) {
        updateMainListFromArray();
        resetDragableClasses();
        //#new code
        addTouchSupport();

        createPost(mainListArray).then(res => {
            //console.log(res)
            localStorage.setItem("mainListArray", JSON.stringify(mainListArray));

        });

        if (typeof callback === "function" && callback !== null) {
            callback();
            console.log("callback")
        }
    }


    //$new code
    function convertToCSV(data) {
        const rows = [];

        // Header row
        rows.push(["Category", "Task"]);

        data.forEach(obj => {
            const key = Object.keys(obj)[0];
            const values = obj[key];

            if (values.length === 0) {
                rows.push([key, ""]);
            } else {
                values.forEach(val => {
                    rows.push([key, val]);
                });
            }
        });

        return rows.map(row => row.join(",")).join("\n");
    }

    // Download CSV
    function downloadCSV(csvContent, filename = "tasks.csv") {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }



    document.getElementById("download-btn").addEventListener("click", (e) => {
        // Usage
        let csv = convertToCSV(mainListArray);

        downloadCSV(csv);
    });

    //$new code
    document.getElementById("addBtn").addEventListener("click", (e) => {
        let str = prompt("הכנס משימה");
        let ob = {}
        ob[str] = [];
        ob["done"] = false;
        console.log(mainListArray)
        mainListArray.push(ob);


        updateMainListFromArray();
        resetDragableClasses();
        addTouchSupport();

        createPost(mainListArray).then(res => {
            //console.log(res)
            localStorage.setItem("mainListArray", JSON.stringify(mainListArray));

        });
    })


    function DefineAndGetAlertsFromDatesArrayByDaysBefore(day) {
        let alertText = "";

        mainListArray.forEach((val, i) => {

            if (val.hasOwnProperty("date")) {
                let today = new Date();
                let dateAlert = new Date(val["date"]);
                dateAlert.setDate(dateAlert.getDate() - day);

                if (today > dateAlert) {
                    let keyName = Object.keys(mainListArray[i]);
                    let dateStr = val["date"];
                    alertText += `תזכורת: ${keyName}
                    עד לתאריך: ${dateStr} \n`;


                }
            }

        });

        if (alertText.length > 1) {
            alert(alertText);
        }
    }

    DefineAndGetAlertsFromDatesArrayByDaysBefore(7);

}

setPage().then();



