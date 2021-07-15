let celldata = document.getElementById("allcell");
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
            str += `<tr onclick="handler(this.id)" id="${k}"> <td style="text-align: left">${masterDb.items[k].name}</td>
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
    }
}

displayList();

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

celldata.contentEditable = true;


function handler(id) {
    
    
}

async function submitChnage() {
    let masterDb = JSON.parse(localStorage.getItem("TrackItData"));
    let tempDb = {
        items:{

        }
    }
    for(let i=1; i<celldata.rows.length-1; i++){
        tempDb.items[i] = {
            name: celldata.rows[i].cells[0].innerText,
            price: celldata.rows[i].cells[1].innerText,
            quant: celldata.rows[i].cells[2].innerText,
            timeNow: masterDb.items[i].timeNow
        }
    }
    console.log(tempDb);
    localStorage.setItem("TrackItData", JSON.stringify(tempDb));

    window.history.go(-1);
}

