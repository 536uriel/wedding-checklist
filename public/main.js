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
            console.log(data); // The newly created post object returned from the server
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

            let valsArr = val[keyName];


            if (valsArr.length > 0) {

                let li2InnerText = ""

                valsArr.forEach((val2, i2) => {

                    li2InnerText += `<li contenteditable="true" id="${"l" + i + "_ul_l" + i2}"> ${val2} <button contenteditable="false" id="${"l" + i + "_ul_l" + i2 + "_btn"}" data-id="${i + "," + i2}"> - </button>
                <button contenteditable="false" id="${"+" + "," + i + "," + i2}" data-id="${"+" + "," + i + "," + i2}"> + </button> </li>`

                })

                let ul2InnerText = `<ul id="${"l" + i + "_ul_l"}">${li2InnerText}</ul>`;

                li1InnerText = `<li contenteditable="true" id="${"l" + i}"> ${keyName} <button contenteditable="false" id="${"l" + i + "_btn"}" data-id="${i + ""}"> - </button> ${ul2InnerText} 
            <button contenteditable="false" id="${"+" + "," + i}" data-id="${"+" + "," + i}"> + </button> </li>`



            } else {
                li1InnerText = `<li contenteditable="true" id="${"l" + i}">${keyName} <button contenteditable="false" id="${"l" + i + "_btn"}" data-id="${i + ""}"> - </button> 
             <button contenteditable="false" id="${"+" + "," + i + "," + 0}" data-id="${"+" + "," + i + "," + 0}"> + </button>  </li> `

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
            mainListArray.push(ob);
        });


        document.querySelectorAll("body>ul:first-of-type>li").forEach((parentLi, i) => {
            let keyName = getOwnText(parentLi);

            document.querySelectorAll("ul li ul li").forEach((childLi, j) => {

                if (childLi.parentElement.parentElement === parentLi) {

                    let childLiStr = getOwnText(childLi);

                    mainListArray[i][keyName].push(childLiStr);

                }

            });


        });

        localStorage.setItem("mainListArray", JSON.stringify(mainListArray));

        createPost(mainListArray).then(res => {
            console.log(res)
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
                createPost(mainListArray).then(res => {
                    console.log(res)
                });
                console.log(mainListArray)

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

                //IMPORTANT: prevent moving into itself or its descendants
                if (draggedItem.contains(li) || parentLiOrChildLi == "parent") return;

                li.parentNode.insertBefore(draggedItem, li);
                //!need to test!!

                updateArrayFromLists();
                console.log(mainListArray)

                createPost(mainListArray).then(res => {
                    console.log(res)
                });


            });
        })
    }

    //#new code
    function addTouchSupport() {

        let currentDragged = null;

        // ===== TOUCH START =====
        document.addEventListener("touchstart", (e) => {
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

        }, { passive: true });


        // ===== TOUCH MOVE =====
        document.addEventListener("touchmove", (e) => {
            if (!currentDragged) return;

            e.preventDefault(); // prevent scroll while dragging

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
            if (!currentDragged) return;

            currentDragged.classList.remove("dragging");

            updateArrayFromLists();
            console.log(mainListArray);

            createPost(mainListArray).then(res => {
                console.log(res)
            });

            currentDragged = null;
            draggedItem = null;
            mainLiDraggedItem = null;
            parentLiOrChildLi = null;
        });
    }


    updateMainListFromArray();
    resetDragableClasses();
    //#new code
    addTouchSupport();



    document.addEventListener("click", (e) => {
        e.preventDefault();
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
            resetDragableClasses();
            //#new code
            addTouchSupport();

            createPost(mainListArray).then(res => {
                console.log(res)
                localStorage.setItem("mainListArray", JSON.stringify(mainListArray));

            });

        }
    });


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
    })

}

setPage().then();



