let params = new URLSearchParams(location.search);
const My_URL = 'https://hishob-app.herokuapp.com/publish/'
let ID = params.get('id');
let celldata = document.getElementById("allcell");
let Toast = document.querySelector('.toastNotify')
Toast.classList.add('animate')
const DB_NAME = "AllTrackItData"

let Data = null

async function fethingData() {
    try {
        let response = await fetch(My_URL + ID)
        if (response.status == 200 && ID != null) {
            Toast.classList.remove('animate')
            let resp = await response.json()
            console.log(resp);
            displayList(resp)
            Data = resp
            if(resp.modifyTime != null)
                document.querySelector('.timeM').innerText = resp.modifyTime
        }
        else{
            handleToast('rgb(244, 140, 140)', "Invalid Link")
        }
    } catch (error) {
        console.log("Invalid data requested");
        handleToast('rgb(244, 140, 140)', "Invalid Link")
    }
}

function handleToast(color, msg) {
    Toast.innerText = msg
    Toast.style.backgroundColor = color
}

fethingData()

function displayList(masterDb) {

    let str=`
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quantity</th>
    </tr>`;
    if(masterDb != null){
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
    }
}

function displayListWithTime(masterDb) {
    let str = `
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
	    <th>Quatity</th>
    </tr>`;
    if (masterDb != null) {
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
    }
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
    if(total>0)
    str += `<tr> <td style="color: var(--green-variant);">Total</td> <td style="color: var(--green-variant);text-align:right;">${total}</td> <td>Will get</td> </tr>`;
    else
	str += `<tr> <td style="color: var(--dust-bin);">Total</td> <td style="color: var(--dust-bin);text-align:right;">${total}</td> <td>Will give</td> </tr>`;

	return str;
}
let dark = 1;
function toggleCirc() {
    document.querySelector('.circle').classList.toggle('move');
    document.querySelector('.toggleme').classList.toggle('move');
    if (dark == 1) {
        displayListWithTime(Data)
        dark = 0;
    }
    else {
        displayList(Data)
        dark = 1;
    }
}