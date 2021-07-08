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

function addval(){

	let name = document.getElementById("nameOfItem").value;
	let quant = document.getElementById("quant").value;
	let price = document.getElementById("price").value;
	
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
        price:price
    }
    localStorage.setItem("TrackItData", JSON.stringify(masterDb));

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
        console.log(masterDb);
        let j=1;
        while(masterDb.items[j]!=null){
            j++;
        }

        for(let k=1; k<j; k++){
            str += `<tr onclick="handler(this.id)" id="${k}"> <td>${masterDb.items[k].name}</td>
            <td>${masterDb.items[k].price}</td> <td>${masterDb.items[k].quant}</td></tr>`;
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

displayList();

function resetval(){
	document.getElementById("nameOfItem").value="";
	document.getElementById("quant").value="";
	document.getElementById("price").value="";
}

function totalcalc(str, names, quants, prices){
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
	str += `<tr> <td style="color: var(--dust-bin);">Total</td> <td style="color: var(--dust-bin);">${total}</td> <td></td> </tr>`;

	return str;
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
    
    displayList();
}

function deleteList() {
    if(confirm("Are you sure you want to delete list?")){
        localStorage.removeItem('TrackItData');
        celldata.innerHTML ="";
    }

}
