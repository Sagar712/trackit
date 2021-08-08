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

function shareList() {
    let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
    const files = new File([localStorage.getItem("TrackItData")], "Track-it.json", {type: "application/json"});
    let j=1;
    if (navigator.share) {
        navigator.share({
            files: files,
            title: 'Pictures',
            text: 'Photos from Mexico',

        })
        .then(() => {
           console.log("Shared"); 
        })
        .catch(console.error);
    }
    else {
        let tempStr = "Name  |  Price  |  Quantity%0a";
        while(masterDb.items[j]!=null){
            tempStr  = tempStr.concat(`${masterDb.items[j].name}  |  ${masterDb.items[j].price}  |  ${masterDb.items[j].quant}%0a`);
            j++;
        }
        let names = [];
        let quants = [];
        let prices = [];
        j=1, i=0;
        while(masterDb.items[j]!=null){
            names[i] = masterDb.items[j].name;
            quants[i] = masterDb.items[j].quant;
            prices[i++] = masterDb.items[j].price;
            j++;
        }
        tempStr += "-----------------------------------%0a";
        tempStr = tempStr.concat(`Total : ${totalcalcReturn(tempStr, names, quants, prices)}%0a`);
        tempStr += "-----------------------------------%0a";
        location.href = `whatsapp://send?text=${tempStr}`;
    }
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
    if(localStorage.getItem("TrackItData") == null){
        const masterdb = {
            items : {
                
            }
        }
        localStorage.setItem("TrackItData", JSON.stringify(masterdb));
    }
    
    let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
    let j =1;
    let i=0;
    
    
    while(masterDb.items[j]!=null){
        j++;
    }

    masterDb.items[j] = {
        name:name,
        quant:quant,
        price:price,
        timeNow:`${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}`
    }
    console.log(masterDb)
    localStorage.setItem("TrackItData", JSON.stringify(masterDb));
    if(currTimeShow)
        SwitchDisplay();
    else
        displayList();
}

function displayList() {
    let str=`
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
    </tr>`;
    if(localStorage.getItem("TrackItData") != null){
        let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
        let j=1;
        while(masterDb.items[j]!=null){
            j++;
        }

        for(let k=1; k<j; k++){
            str += `<tr id="${k}"> <td style="text-align: left">${masterDb.items[k].name}</td>
            <td style="text-align: right">${masterDb.items[k].price}</td> <td style="text-align: right">${masterDb.items[k].quant}</td></tr>`;
        }

        let names = [];
        let quants = [];
        let prices = [];
        j=1, i=0;
        while(masterDb.items[j]!=null){
            names[i] = masterDb.items[j].name;
            quants[i] = masterDb.items[j].quant;
            prices[i++] = masterDb.items[j].price;
            j++;
        }
        celldata.innerHTML = totalcalc(str, names, quants, prices);
        resetval();
        longpress();
    }
}

displayList();


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
    if(localStorage.getItem("TrackItData") != null){
        let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
        console.log(masterDb);
        let j=1;
        while(masterDb.items[j]!=null){
            j++;
        }

        for(let k=1; k<j; k++){
            if(masterDb.items[k].timeNow!=null)
                str += `<tr> <td colspan="3" style="font-style: italic;color:var(--date-color);text-align:center;">${masterDb.items[k].timeNow}</td> </tr>`;
            else
                str += `<tr> <td colspan="3" style="font-style: italic;color:var(--date-color);text-align:center;">-- NA --</td> </tr>`;
            str += `<tr id="${k}"> <td style="text-align: left">${masterDb.items[k].name}</td>
            <td style="text-align: right">${masterDb.items[k].price}</td> <td style="text-align: right">${masterDb.items[k].quant}</td></tr>`;
        }
        let names = [];
        let quants = [];
        let prices = [];
        j=1, i=0;
        while(masterDb.items[j]!=null){
            names[i] = masterDb.items[j].name;
            quants[i] = masterDb.items[j].quant;
            prices[i++] = masterDb.items[j].price;
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
	
    let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
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
    localStorage.setItem("TrackItData", JSON.stringify(copyDb));
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

    let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
    let copyDb = {
        items : {
            
        }
    }
    let j=1, cp = 1;
    console.log(masterDb);
    while(masterDb.items[j]!=null){
        if(!arr[j-1])
            copyDb.items[cp++] = masterDb.items[j];
        j++;
        console.log(arr[j-1]);
    }
    console.log(copyDb);
    localStorage.setItem("TrackItData", JSON.stringify(copyDb));
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

function backupCellPop() {
    if(arr.length>0){
        localStorage.setItem('TrackItData', JSON.stringify(arr.pop()));
        count--;
        displayList();
    }
    printLevels();
}
function printLevels() {
    document.getElementById('levelsPresent').innerText=count;
}
printLevels();


//Handling log presses.
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
        <th></th>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
    </tr>`;
    if(localStorage.getItem("TrackItData") != null){
        let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
        let j=1;
        while(masterDb.items[j]!=null){
            j++;
        }

        for(let k=1; k<j; k++){
            if(k==Id){
                str += `<tr id="${k}"> <td style='display:flex; align-items:center; justify-content:center;'><input type='checkbox' checked class='checkbx'></td> 
                <td style="text-align: left">${masterDb.items[k].name}</td>
                <td style="text-align: right">${masterDb.items[k].price}</td> <td style="text-align: right">${masterDb.items[k].quant}</td></tr>`;
            }
            else{
                str += `<tr id="${k}"> <td style='display:flex; align-items:center; justify-content:center;'><input type='checkbox' class='checkbx'></td> 
                <td style="text-align: left">${masterDb.items[k].name}</td>
                <td style="text-align: right">${masterDb.items[k].price}</td> <td style="text-align: right">${masterDb.items[k].quant}</td></tr>`;
            }
        }
        let names = [];
        let quants = [];
        let prices = [];
        j=1, i=0;
        while(masterDb.items[j]!=null){
            names[i] = masterDb.items[j].name;
            quants[i] = masterDb.items[j].quant;
            prices[i++] = masterDb.items[j].price;
            j++;
        }
        celldata.innerHTML = totalcalc(str, names, quants, prices);
        resetval();
    }
}

function getPositionX(event) {
    return event.touches[0].clientX
}