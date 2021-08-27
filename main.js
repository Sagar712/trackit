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

let dark=1;
if(localStorage.getItem("DarkModeTrackIt") == "on"){
    document.querySelector('.circle').classList.add('move');
    document.querySelector('.toggleme').classList.add('move');
    dark=0;
}

function popupfiles() {
    document.querySelector('.chooseFiles').classList.toggle('show');
    document.querySelector('.opacitor2').classList.toggle('active');
}

function toggleCirc() {
    document.querySelector('.circle').classList.toggle('move');
    document.querySelector('.toggleme').classList.toggle('move');
    if(dark==1){
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("DarkModeTrackIt", "on");
        dark=0;
    }
    else{
        document.documentElement.setAttribute("data-theme", "root");
        localStorage.setItem("DarkModeTrackIt", "off");
        dark=1;
    }
}

function toggleMenu() {
    document.querySelector('.menuItems').classList.toggle('active');
    document.querySelector('.opacitor').classList.toggle('active');
}

let celldata = document.getElementById("allcell");
let currTimeShow = false;

function addval(){

	let name = document.getElementById("nameOfItem").value;
	let quant = document.getElementById("quant").value;
	let price = document.getElementById("price").value;
    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    let day = new Date();
    
    
    let masterDb = getItem();
    let j =1;
    let i=0;
    
    
    while(masterDb[j]!=null){
        j++;
    }

    masterDb[j] = {
        name:name,
        quant:quant,
        price:price,
        timeNow:`${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}`
    }
    console.log(masterDb);
    setItem(masterDb);
    if(currTimeShow)
        SwitchDisplay();
    else
        displayList();
}

async function CreateFile() {
    toggleMenu();
    const file_name = document.querySelector('.fileName').value;
    let obj = JSON.parse(localStorage.getItem('AllTrackItData'));
    let indx=1;
    while (obj[indx]!=null) {
        indx++;
    }
    obj[indx] = {
        title:file_name,
        data:{}
    }
    localStorage.setItem('AllTrackItData', JSON.stringify(obj));
    setIndex(indx);
    displayList();
    console.log(obj);
    popSaveAs();
}

function displayList() {
    if(localStorage.getItem('AllTrackItData') == null){
        let obj = {
            current_index:0,
            0:{
                title:"default",
                data:{}
            }
        }
        localStorage.setItem('AllTrackItData', JSON.stringify(obj));
    }
    document.querySelector('.file-Name').innerText = getItemName();

    // handles showing files to be choose
    let files="";
    let obj = JSON.parse(localStorage.getItem('AllTrackItData'));
    let i=0;
    while (obj[i]!=null) {
        if(i==0){
            files += `<li> 
            <div class="nameOfFile" onclick="openFile(${i})"><p>${obj[i].title}</p></div></li>`;
        }
        else{
            files += `<li> 
            <div class="nameOfFile" onclick="openFile(${i})"><p>${obj[i].title}</p></div>
            <div class="delIcon" onclick="deleteItem(${i})"> <i class="fas fa-trash-alt"></i> </div>
            </li>`;
        }
        i++;
    }
    document.querySelector('.allFiles').innerHTML = files;
    // handles showing table content
    let str=`
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
    </tr>`;
    if(getItem() != null){
        let masterDb = getItem();
        let j=1;
        while(masterDb[j]!=null){
            j++;
        }

        for(let k=1; k<j; k++){
            str += `<tr id="${k}"> <td style="text-align: left">${masterDb[k].name}</td>
            <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td></tr>`;
        }

        let names = [];
        let quants = [];
        let prices = [];
        j=1, i=0;
        while(masterDb[j]!=null){
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

function setIndex(id) {
    let obj = JSON.parse(localStorage.getItem('AllTrackItData'));
    obj.current_index = id;
    localStorage.setItem('AllTrackItData', JSON.stringify(obj));
}
function getItem() {
    let obj = JSON.parse(localStorage.getItem('AllTrackItData'));
    return obj[obj.current_index].data;
}
function getItemName() {
    let obj = JSON.parse(localStorage.getItem('AllTrackItData'));
    return obj[obj.current_index].title;
}
function setItem(Data) {
    let obj = JSON.parse(localStorage.getItem('AllTrackItData'));
    obj[obj.current_index].data = Data;
    console.log(obj);
    localStorage.setItem('AllTrackItData', JSON.stringify(obj));
}
async function openFile(index){
    await setIndex(index);
    popupfiles();
    displayList();
}
async function deleteItem(index){
    let obj = JSON.parse(localStorage.getItem('AllTrackItData'));
    let copy_of_obj = {};
    let idx = 0, count=0;;
    while (obj[idx] != null) {
        if(index!=idx)
        copy_of_obj[count++] = obj[idx];
        idx++;
    } 
    localStorage.setItem('AllTrackItData', JSON.stringify(copy_of_obj));
    setIndex(0);
    displayList();
}

function SwitchDisplay() {
    if(currTimeShow){
        displayList();
        document.querySelectorAll('.currentShow')[0].innerText="Show Dates";
        document.querySelectorAll('.currentShow')[1].innerText="Show Dates";
        currTimeShow=false;
    }
    else{
        displayListWithTime();
        document.querySelectorAll('.currentShow')[0].innerText="Hide Dates";
        document.querySelectorAll('.currentShow')[1].innerText="Hide Dates";
        currTimeShow=true;
    }
}

function displayListWithTime() {
    let str=`
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
    </tr>`;
    if(getItem() != null){
        let masterDb = getItem();
        console.log(masterDb);
        let j=1;
        while(masterDb[j]!=null){
            j++;
        }

        for(let k=1; k<j; k++){
            if(masterDb[k].timeNow!=null)
                str += `<tr> <td colspan="3" style="font-style: italic;color:var(--date-color);text-align:center;">${masterDb[k].timeNow}</td> </tr>`;
            else
                str += `<tr> <td colspan="3" style="font-style: italic;color:var(--date-color);text-align:center;">-- NA --</td> </tr>`;
            str += `<tr id="${k}"> <td style="text-align: left">${masterDb[k].name}</td>
            <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td></tr>`;
        }
        let names = [];
        let quants = [];
        let prices = [];
        j=1, i=0;
        while(masterDb[j]!=null){
            names[i] = masterDb[j].name;
            quants[i] = masterDb[j].quant;
            prices[i++] = masterDb[j].price;
            j++;
        }
        celldata.innerHTML = totalcalc(str, names, quants, prices);
        resetval();
    }
}

function resetval(){
	document.getElementById("nameOfItem").value="";
	document.getElementById("quant").value="";
	document.getElementById("price").value="";
}

function totalcalc(str, names, quants, prices){
	let total=0;
	let j;
	for(j=0; j<names.length; j++){

        if((prices[j]=="" || isNaN(parseInt(prices[j]))) && (quants[j]=="" || isNaN(parseInt(quants[j])))){
            total+=0;
        }
		else if(quants[j]=="" || isNaN(parseInt(quants[j]))){
			total += parseInt(prices[j]) ;
		}	
		else if(prices[j]=="" || isNaN(parseInt(prices[j])))
			total += parseInt(quants[j]);

		else
		total += quants[j]*prices[j];
	}
	str += `<tr> <td style="color: var(--dust-bin);">Total</td> <td style="color: var(--dust-bin);text-align:right;">${total}</td> <td></td> </tr>`;

	return str;
}

function totalcalcReturn(str, names, quants, prices){
	let total=0;
	let j;
	for(j=0; j<names.length; j++){

        if(prices[j]=="" && quants[j]==""){
            total+=0;
        }
		else if(quants[j]==""){
			total += parseInt(prices[j]) ;
		}	
		else if(prices[j]=="")
			total += parseInt(quants[j]);   
		else
		total += quants[j]*prices[j];
	}
	

	return total;
}

function handler(id){
	
    let masterDb = JSON.parse(localStorage.getItem("AllTrackItData"));
    let j =1;
    let i=0;
    let cp = 1;

    let copyDb = {
        items : {
            
        }
    }
    let names = [];
    let quants = [];
    let prices = [];

    while(masterDb.items[j]!=null){
        if(j == id){
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

let distanceToTop=0;
window.addEventListener('scroll', function(ev) {

    var someDiv = document.getElementById('nameOfItem');
    distanceToTop = someDiv.getBoundingClientRect().top;
 
    //console.log(distanceToTop);
    if(distanceToTop<30)
        document.querySelector('.optionNav').classList.add('show');
    else
        document.querySelector('.optionNav').classList.remove('show');
 });

function deleteList() {
    let itr=1;
    let arr = new Array();
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox=>{
        console.log("row "+(itr++)+" : "+checkbox.checked);
        arr.push(checkbox.checked);
    });

    let masterDb = getItem();
    let copyDb = {}
    let j=1, cp = 1;
    console.log(masterDb);
    while(masterDb[j]!=null){
        if(!arr[j-1])
            copyDb[cp++] = masterDb[j];
        j++;
        console.log(arr[j-1]);
    }

    setItem(copyDb);
    displayList();
    closeSlect();
}

let arr = new Array();
let count = 0;
function backupCellPush(sampleDb) {
    if(count<10){
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
}


//Handling long presses.
let isheld = false;
let activeHold = null;
let transition_touch = 0;
function longpress() {
    if(document.querySelector("td")!=null){
        document.querySelectorAll('tr').forEach(row => {
            row.addEventListener('touchstart', (event)=> {
                isheld = true;
                transition_touch = getPositionX(event);
                console.log(transition_touch);
                activeHold = setTimeout(() => {
                    if(isheld){
                        render_with_check(row.id);
                    }
                }, 1000);
            });
            row.addEventListener('touchmove', touchMove);
            row.addEventListener('touchend', ()=> {
                isheld = false;
                clearTimeout(activeHold);
            });
        });
    }
}
longpress();

function closeSlect() {
    document.querySelector('.selectall').classList.remove('show');
    evenItr=true;
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox=>{
        checkbox.checked = false;
    });
    displayList();
}

function touchMove(event) {
    if(isheld){
        if((getPositionX(event) - transition_touch) > 2)
            isheld = false;
    }
        console.log(getPositionX(event));
}

let evenItr = true;
function selectAllOpt() {
    if(evenItr){
        evenItr=false;
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox=>{
            checkbox.checked = true;
        });
    }
    else{
        evenItr=true;
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox=>{
            checkbox.checked = false;
        });
    }
}

function render_with_check(Id) {
    transition_touch = 0;
    document.querySelector('.selectall').classList.add('show');
    let str=`
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
        <th></th>
    </tr>`;
    if(localStorage.getItem("AllTrackItData") != null){
        let masterDb = getItem();
        let j=1;
        while(masterDb[j]!=null){
            j++;
        }

        for(let k=1; k<j; k++){
            if(k==Id){
                str += `<tr id="${k}"> 
                <td style="text-align: left">${masterDb[k].name}</td>
                <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td>
                <td style='display:flex; align-items:center; justify-content:center;'><input type='checkbox' checked class='checkbx'></td> </tr>`;
            }
            else{
                str += `<tr id="${k}">
                <td style="text-align: left">${masterDb[k].name}</td>
                <td style="text-align: right">${masterDb[k].price}</td> <td style="text-align: right">${masterDb[k].quant}</td>
                <td style='display:flex; align-items:center; justify-content:center;'><input type='checkbox' class='checkbx'></td> </tr>`;
            }
        }
        let names = [];
        let quants = [];
        let prices = [];
        j=1, i=0;
        while(masterDb[j]!=null){
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