let celldata = document.getElementById("allcell");
const DB_NAME = "AllTrackItData"

console.log(JSON.parse(localStorage.getItem(DB_NAME)));

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

    // handles showing table content
    let str = `
    <tr>
	    <th>Name</th>
	    <th>Prices</th>
    </tr>`;
    if (getItem() != null) {
        let masterDb = getItem();
        let j = 1;
        while (masterDb[j] != null) {
            j++;
        }

        for (let k = 1; k < j; k++) {
            str += `<tr id="${k}"> <td style="text-align: left">${masterDb[k].name}</td>
            <td style="text-align: right">${masterDb[k].price}</td> </tr>`;
        }

        let names = [];
        let quants = [];
        let prices = [];
        j = 1, i = 0;
        while (masterDb[j] != null) {
            names[i] = masterDb[j].name;
            quants[i] = null;
            prices[i++] = masterDb[j].price;
            j++;
        }
        celldata.innerHTML = totalcalc(str, names, quants, prices);

    }
}

function submitChange() {
    let masterDb = JSON.parse(localStorage.getItem(DB_NAME));
    let newData = {}
    for (let i = 1; i <= celldata.rows.length - 1; i++) {
        console.log(celldata.rows[i].cells[1].innerText+" --> "+!isNaN(celldata.rows[i].cells[1].innerText));
        if (!isNaN(celldata.rows[i].cells[1].innerText)) {
            newData[i] = {
                name: celldata.rows[i].cells[0].innerText,
                price: celldata.rows[i].cells[1].innerText,
                quant: null,
                timeNow: masterDb[masterDb.current_index].data[i].timeNow
            }
        }
        else {
            alert("price or quantity should be Numeric")
            return
        }
    }
    masterDb[masterDb.current_index].data = newData
    localStorage.setItem(DB_NAME, JSON.stringify(masterDb));
    window.history.go(-1);
}


displayList();

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
    //str += `<tr> <td style="color: var(--dust-bin);">Total</td> <td style="color: var(--dust-bin);text-align:right;">${total}</td> <td></td> </tr>`;

    return str;
}

celldata.contentEditable = true;

function getItem() {
    let obj = JSON.parse(localStorage.getItem(DB_NAME));
    return obj[obj.current_index].data;
}