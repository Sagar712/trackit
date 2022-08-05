if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").then(
        registration => {
            console.log("SW registered");
            console.log(registration);
        }
    ).catch(error => {
        console.log("SW failed");
    })
}

const DB_NAME = "AllTrackItData"
const MODE = "DarkModeTrackIt"
const Publish_URL = "https://sagar712.github.io/trackit/publish/publish.html?id="

let dark = 1;
if (localStorage.getItem("DarkModeTrackIt") == "on") {
    document.querySelector('.circle').classList.add('move');
    document.querySelector('.toggleme').classList.add('move');
    dark = 0;
}

function popupfiles() {
    document.querySelector('.chooseFiles').classList.toggle('show');
    document.querySelector('.opacitor2').classList.toggle('active');
}

function toggleCirc() {
    document.querySelector('.circle').classList.toggle('move');
    document.querySelector('.toggleme').classList.toggle('move');
    if (dark == 1) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("DarkModeTrackIt", "on");
        dark = 0;
    }
    else {
        document.documentElement.setAttribute("data-theme", "root");
        localStorage.setItem("DarkModeTrackIt", "off");
        dark = 1;
    }
}

function toggleMenu() {
    document.querySelector('.menuItems').classList.toggle('active');
    document.querySelector('.opacitor').classList.toggle('active');
}

let celldata = document.getElementById("allcell");
let currTimeShow = false;

console.log(JSON.parse(localStorage.getItem(DB_NAME)));
function shareList() {
    let whatsappData = JSON.parse(localStorage.getItem(DB_NAME))
    if (whatsappData.shared_index == null) {
        whatsappData.shared_index = {}
        localStorage.setItem(DB_NAME, JSON.stringify(whatsappData))
    }
    if (Object.keys(whatsappData.shared_index).includes(`${whatsappData.current_index}`)) {
        window.location.href = `whatsapp://send?text=${Publish_URL}${whatsappData.shared_index[whatsappData.current_index]}`
        //window.location.href =  `${Publish_URL}${whatsappData.shared_index[whatsappData.current_index]}`
    }
    else {
        if (confirm("This page was never published\n\n Do you want to publish it?")) {
            window.location.href = './publish/publisher.html'
        }
    }
}

function addval() {

    let name = document.getElementById("nameOfItem").value;
    let quant = document.getElementById("quant").value;
    let price = document.getElementById("price").value;

    let masterDb = getItem();
    let j = 1;
    let i = 0;


    while (masterDb[j] != null) {
        j++;
    }

    masterDb[j] = {
        name: name,
        quant: quant,
        price: price,
        timeNow: getDateTime()
    }
    console.log(masterDb);
    setItem(masterDb);
    if (currTimeShow)
        SwitchDisplay();
    else
        displayList();
}

function getDateTime() {
    let day = new Date();
    let monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
    return `${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}, ${day.getHours() == 0 || day.getHours() == 12 ? 12 : day.getHours() % 12}:${day.getMinutes()} ${day.getHours() >= 12 ? 'PM' : 'AM'}`
}

async function CreateFile() {
    toggleMenu();
    const file_name = document.querySelector('.fileName').value;
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    let indx = 1;
    while (obj[indx] != null) {
        indx++;
    }
    obj[indx] = {
        title: file_name,
        data: {}
    }
    localStorage.setItem(DB_NAME, JSON.stringify(obj));
    setIndex(indx);
    displayList();
    console.log(obj);
    popSaveAs();
}

function displayList() {
    if (localStorage.getItem(DB_NAME) == null) {
        let obj = {
            current_index: 0,
            0: {
                title: "default",
                data: {}
            }
        }
        localStorage.setItem(DB_NAME, JSON.stringify(obj));
    }
    document.querySelector('.file-Name').innerText = getItemName();
    let DATA = JSON.parse(localStorage.getItem(DB_NAME))
    let republish = document.querySelector('.republish')
    if (DATA.shared_index && !Object.keys(DATA.shared_index).includes(`${DATA.current_index}`)) {
        republish.style.display = 'none'
    }
    else if(DATA.shared_index){
        republish.style.display = 'flex'
    }

    // handles showing files to be choose
    let files = "";
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    let i = 0;
    while (obj[i] != null) {
        if (i == 0) {
            files += `<li> 
            <div class="nameOfFile" onclick="openFile(${i})"><p>${obj[i].title}</p></div></li>`;
        }
        else {
            files += `<li> 
            <div class="nameOfFile" onclick="openFile(${i})"><p>${obj[i].title}</p></div>
            <div class="delIcon" onclick="deleteItem(${i})"> <i class="fas fa-trash-alt"></i> </div>
            </li>`;
        }
        i++;
    }
    document.querySelector('.allFiles').innerHTML = files;
    // handles showing table content
    let str = `
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
    </tr>`;
    if (getItem() != null) {
        let masterDb = getItem();
        let j = 1;
        while (masterDb[j] != null) {
            j++;
        }

        for (let k = 1; k < j; k++) {
            str += `<tr id="${k}"> <td style="text-align: left">${masterDb[k].name}</td>
            <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td></tr>`;
        }

        let names = [];
        let quants = [];
        let prices = [];
        j = 1, i = 0;
        while (masterDb[j] != null) {
            names[i] = masterDb[j].name;
            quants[i] = masterDb[j].quant;
            prices[i++] = masterDb[j].price;
            j++;
        }
        celldata.innerHTML = totalcalc(str, names, quants, prices);
        resetval();
        longpress();
    }
}

displayList();

async function setIndex(id) {
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    obj.current_index = id;
    localStorage.setItem(DB_NAME, JSON.stringify(obj));
}
function getItem() {
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    return obj[obj.current_index].data;
}
function getItemName() {
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    return obj[obj.current_index].title;
}
function setItem(Data) {
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    obj[obj.current_index].data = Data;
    console.log(obj);
    localStorage.setItem(DB_NAME, JSON.stringify(obj));
}
async function openFile(index) {
    await setIndex(index);
    popupfiles();
    displayList();
}
async function deleteItem(index) {
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    let copy_of_obj = {};
    let idx = 0, count = 0;;
    while (obj[idx] != null) {
        if (index != idx)
            copy_of_obj[count++] = obj[idx];
        idx++;
    }
    localStorage.setItem(DB_NAME, JSON.stringify(copy_of_obj));
    setIndex(0);
    displayList();
}

let Toast = document.querySelector('.toastNotify')

async function republishChanges() {
    let whatsappData = JSON.parse(localStorage.getItem(DB_NAME))
    handleToast('rgb(175, 255, 206)', 'Loading...', 1)
    await fetch('https://hishob-app.herokuapp.com/publish/')
        .then(res1 => {
            return res1.json()
        })
        .then(response => {

            fetch('http://localhost:5501/publish/'+whatsappData.shared_index[whatsappData.current_index], {
                method: 'POST',
                headers: {
                    accept: 'application.json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(whatsappData[whatsappData.current_index].data)
            })
            .then(res => {
                return res.json()
            })
            .then(resp => {

                handleToast('rgb(175, 255, 206)', 'Success!', 0)

            })
        })
}

function handleToast(color, msg, status = 1) {
    Toast.innerText = msg
    Toast.style.backgroundColor = color
    if (status == 1)
        Toast.classList.add('animate')
    else
        Toast.classList.remove('animate')
}

function SwitchDisplay() {
    if (currTimeShow) {
        displayList();
        document.querySelectorAll('.currentShow')[0].innerText = "Show Dates";
        document.querySelectorAll('.currentShow')[1].innerText = "Show Dates";
        currTimeShow = false;
    }
    else {
        displayListWithTime();
        document.querySelectorAll('.currentShow')[0].innerText = "Hide Dates";
        document.querySelectorAll('.currentShow')[1].innerText = "Hide Dates";
        currTimeShow = true;
    }
}

function displayListWithTime() {
    let str = `
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
    </tr>`;
    if (getItem() != null) {
        let masterDb = getItem();
        console.log(masterDb);
        let j = 1;
        while (masterDb[j] != null) {
            j++;
        }

        for (let k = 1; k < j; k++) {
            if (masterDb[k].timeNow != null)
                str += `<tr> <td colspan="3" style="font-style: italic;color:var(--date-color);text-align:center;">${masterDb[k].timeNow}</td> </tr>`;
            else
                str += `<tr> <td colspan="3" style="font-style: italic;color:var(--date-color);text-align:center;">-- NA --</td> </tr>`;
            str += `<tr id="${k}"> <td style="text-align: left">${masterDb[k].name}</td>
            <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td></tr>`;
        }
        let names = [];
        let quants = [];
        let prices = [];
        j = 1, i = 0;
        while (masterDb[j] != null) {
            names[i] = masterDb[j].name;
            quants[i] = masterDb[j].quant;
            prices[i++] = masterDb[j].price;
            j++;
        }
        celldata.innerHTML = totalcalc(str, names, quants, prices);
        resetval();
    }
}

function resetval() {
    document.getElementById("nameOfItem").value = "";
    document.getElementById("quant").value = "";
    document.getElementById("price").value = "";
}

function totalcalc(str, names, quants, prices) {
    let total = 0;
    let j;
    for (j = 0; j < names.length; j++) {

        if ((prices[j] == "" || isNaN(parseInt(prices[j]))) && (quants[j] == "" || isNaN(parseInt(quants[j])))) {
            total += 0;
        }
        else if (quants[j] == "" || isNaN(parseInt(quants[j]))) {
            total += parseInt(prices[j]);
        }
        else if (prices[j] == "" || isNaN(parseInt(prices[j])))
            total += parseInt(quants[j]);

        else
            total += quants[j] * prices[j];
    }
    if (total > 0)
        str += `<tr> <td style="color: var(--green-variant);">Total</td> <td style="color: var(--green-variant);text-align:right;">${total}</td> <td>Will get</td> </tr>`;
    else
        str += `<tr> <td style="color: var(--dust-bin);">Total</td> <td style="color: var(--dust-bin);text-align:right;">${total}</td> <td>Will give</td> </tr>`;

    return str;
}

function totalcalcReturn(str, names, quants, prices) {
    let total = 0;
    let j;
    for (j = 0; j < names.length; j++) {

        if (prices[j] == "" && quants[j] == "") {
            total += 0;
        }
        else if (quants[j] == "") {
            total += parseInt(prices[j]);
        }
        else if (prices[j] == "")
            total += parseInt(quants[j]);
        else
            total += quants[j] * prices[j];
    }


    return total;
}

function handler(id) {

    let masterDb = JSON.parse(localStorage.getItem("AllTrackItData"));
    let j = 1;
    let i = 0;
    let cp = 1;

    let copyDb = {
        items: {

        }
    }
    let names = [];
    let quants = [];
    let prices = [];

    while (masterDb.items[j] != null) {
        if (j == id) {
            j++;
            continue;
        }
        names[i] = masterDb.items[j].name;
        quants[i] = masterDb.items[j].quant;
        prices[i++] = masterDb.items[j].price;
        copyDb.items[cp++] = masterDb.items[j];
        j++;
    }
    localStorage.setItem("AllTrackItData", JSON.stringify(copyDb));
    backupCellPush(masterDb);
    displayList();
}

let distanceToTop = 0;
window.addEventListener('scroll', function (ev) {

    var someDiv = document.getElementById('nameOfItem');
    distanceToTop = someDiv.getBoundingClientRect().top;

    //console.log(distanceToTop);
    if (distanceToTop < 30)
        document.querySelector('.optionNav').classList.add('show');
    else
        document.querySelector('.optionNav').classList.remove('show');
});

function deleteList() {
    let itr = 1;
    let arr = new Array();
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        console.log("row " + (itr++) + " : " + checkbox.checked);
        arr.push(checkbox.checked);
    });

    let masterDb = getItem();
    let copyDb = {}
    let j = 1, cp = 1;
    console.log(masterDb);
    while (masterDb[j] != null) {
        if (!arr[j - 1])
            copyDb[cp++] = masterDb[j];
        j++;
        console.log(arr[j - 1]);
    }

    setItem(copyDb);
    displayList();
    closeSlect();
}

let arr = new Array();
let count = 0;
function backupCellPush(sampleDb) {
    if (count < 10) {
        arr.push(sampleDb);
        count++;
        console.log("Backup stack:");
        console.log(arr);
    }
    printLevels();
}

function popSaveAs() {
    document.querySelector('.saveAs').classList.toggle('show');
    document.querySelector('.opacitor3').classList.toggle('active');
    document.querySelector('.menuItems').classList.remove('active');
    document.querySelector('.opacitor').classList.remove('active');
}


//Handling long presses.
let isheld = false;
let activeHold = null;
let transition_touch = 0;
function longpress() {
    if (document.querySelector("td") != null) {
        document.querySelectorAll('tr').forEach(row => {
            row.addEventListener('touchstart', (event) => {
                isheld = true;
                transition_touch = getPositionX(event);
                console.log(transition_touch);
                activeHold = setTimeout(() => {
                    if (isheld) {
                        render_with_check(row.id);
                    }
                }, 1000);
            });
            row.addEventListener('touchmove', touchMove);
            row.addEventListener('touchend', () => {
                isheld = false;
                clearTimeout(activeHold);
            });
        });
    }
}
longpress();

function closeSlect() {
    document.querySelector('.selectall').classList.remove('show');
    evenItr = true;
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    displayList();
}

function touchMove(event) {
    if (isheld) {
        if ((getPositionX(event) - transition_touch) > 2)
            isheld = false;
    }
    console.log(getPositionX(event));
}

let evenItr = true;
function selectAllOpt() {
    if (evenItr) {
        evenItr = false;
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    }
    else {
        evenItr = true;
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

function render_with_check(Id) {
    transition_touch = 0;
    document.querySelector('.selectall').classList.add('show');
    let str = `
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
        <th></th>
    </tr>`;
    if (localStorage.getItem("AllTrackItData") != null) {
        let masterDb = getItem();
        let j = 1;
        while (masterDb[j] != null) {
            j++;
        }

        for (let k = 1; k < j; k++) {
            if (k == Id) {
                str += `<tr id="${k}"> 
                <td style="text-align: left">${masterDb[k].name}</td>
                <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td>
                <td style='display:flex; align-items:center; justify-content:center;'><input type='checkbox' checked class='checkbx'></td> </tr>`;
            }
            else {
                str += `<tr id="${k}">
                <td style="text-align: left">${masterDb[k].name}</td>
                <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td>
                <td style='display:flex; align-items:center; justify-content:center;'><input type='checkbox' class='checkbx'></td> </tr>`;
            }
        }
        let names = [];
        let quants = [];
        let prices = [];
        j = 1, i = 0;
        while (masterDb[j] != null) {
            names[i] = masterDb[j].name;
            quants[i] = masterDb[j].quant;
            prices[i++] = masterDb[j].price;
            j++;
        }
        celldata.innerHTML = totalcalc(str, names, quants, prices);
        resetval();
    }
}

function getPositionX(event) {
    return event.touches[0].clientX
}