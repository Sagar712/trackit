const DB_NAME = "AllTrackItData"
const My_URL = 'https://hishob-app.herokuapp.com/publish/'
const Publish_URL  = "https://sagar712.github.io/trackit/publish/publish.html?id="
let Data = JSON.parse(localStorage.getItem(DB_NAME))
let Toast = document.querySelector('.toastNotify')
let sharable = null

function PushishIt() {
    let uploadData = Data[Data.current_index].data
    uploadData.modifyTime = getDateTime()
    console.log(uploadData);
    handleToast('rgb(175, 255, 206)', 'Publishing...', 1)
    fetch(My_URL,{
        method: 'POST',
        headers: {
          accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      })
      .then(res => {
        return res.json()
      })
      .then(resp => {
        let response = JSON.parse(resp.obj.data)
        console.log(response);
        let lastIndex = Object.keys(response).length-1
        console.log(lastIndex);
        Data.shared_index[Data.current_index] = lastIndex
        localStorage.setItem(DB_NAME, JSON.stringify(Data))
        sharable = Publish_URL+lastIndex
        handleToast('rgb(175, 255, 206)', 'Publishing...', 0)
        document.querySelector('.btnn').disabled = false
      })
    console.log(Data);

}

function getDateTime() {
    let day = new Date();
    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    return `${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}, ${day.getHours()==0 || day.getHours()==12 ? 12 : day.getHours()%12}:${day.getMinutes()} ${day.getHours()>=12 ? 'PM' : 'AM'}`
}

function handleToast(color, msg, status = 1) {
    Toast.innerText = msg
    Toast.style.backgroundColor = color
    if(status == 1)
        Toast.classList.add('animate')
    else
        Toast.classList.remove('animate')
}

function Share() {
    if(sharable){
        window.location.href =  `whatsapp://send?text=${sharable}`
    }
}