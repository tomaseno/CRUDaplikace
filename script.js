//GitHub: 1. vyhledat cmd 2. vložit s vlastnímy údaji na GitHub: git config --global user.name "Bob Bobicek" ; git config --global user.email bob.bobicek@gmail.com  (vic na navody.damto.cz)3.



async function registerPOST(){
  let regFN = document.getElementById("regFullname").value;
  let regNN = document.getElementById("regNickname").value;
  let regPW = document.getElementById("regPassword").value;
  let regEM = document.getElementById("regEmail").value;

  let url = "https://nodejs-3260.rostiapp.cz/users/registry"; 
  let body = {};
  body.fullname = regFN;
  body.username = regNN;
  body.password = regPW;
  body.email = regEM;
  let response = await fetch(url, {"method": "POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  document.getElementById("itemInput").value = "";
  document.getElementById("itemInput").focus();
}

let userToken;

async function loginPOST(){
  let logNN = document.getElementById("logNickname").value;
  let logPW = document.getElementById("logPassword").value;
  
  let url = "https://nodejs-3260.rostiapp.cz/users/login"; 
  let body = {};
  body.username = logNN;
  body.password = logPW;
  let response = await fetch(url, {"method": "POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if(data.status == "OK"){
    userToken = data.token;
  }
}


function onKeyDown(event){
 if (event.key == "Enter"){
   sendItem();
 }
}

function onLoad(){
  updateItems();

}


// přes metodu POST, rozdíl GET a POST je ten, že odeslaná data jsou jinak "zabalená", POST je bezpečnější
async function sendItemPOST(){
  let inputJmeno = document.getElementById("jmenoInput").value;
  let inputPrijmeni = document.getElementById("prijmeniInput").value;
  let inputRokNar = document.getElementById("rokNarInput").value;
  let inputPocBod = document.getElementById("pocBodInput").value;

  let url = "https://nodejs-3260.rostiapp.cz/crud/create"; 
  let body = {};
  body.obj = {};
  body.obj.jmeno = inputJmeno;
  body.obj.prijmeni = inputPrijmeni;
  body.obj.rokNar = inputRokNar;
  body.obj.pocBod = inputPocBod;
  body.obj.obrazek = picUrl;
  body.appId = "a823f81994871736795dd11151a5796b";

  if(idEdit){
  url = "https://nodejs-3260.rostiapp.cz/crud/update";
  body.id = idEdit;
  }

  body.token = userToken;
  let response = await fetch(url, {"method": "POST", "body": JSON.stringify(body)});
  let data = await response.json();
  
  updateItems();

}

let idEdit = undefined;

async function editItem(id) {
  idEdit= id;

  let url = "https://nodejs-3260.rostiapp.cz/crud/read"; //s parametry
  let body = {};
  body.appId = "a823f81994871736795dd11151a5796b";
  body.id = id;
  let response = await fetch(url, {"method": "POST", "body": JSON.stringify(body)});
  let data = await response.json();

   document.getElementById("jmenoInput").value = data.items[0].obj.jmeno;
   document.getElementById("prijmeniInput").value=  data.items[0].obj.prijmeni;
   document.getElementById("rokNarInput").value = data.items[0].obj.rokNar;
   document.getElementById("pocBodInput").value = data.items[0].obj.pocBod;
  document.getElementById("sendButton").value = "edit";

  if(data.items[0].obj.obrazek){
    document.getElementById("picture").src = data.items[0].obj.obrazek;
  }else{
    document.getElementById("picture").src = "obrazky/mark.jpg";
  }
}


async function deleteItem(id) {
  if(!confirm("Are you sure?")){
  return;
}
  let url = "https://nodejs-3260.rostiapp.cz/crud/delete"; //s parametry
  let body = {};
  body.appId = "a823f81994871736795dd11151a5796b";
  body.id = id;
  let response = await fetch(url, {"method": "POST", "body": JSON.stringify(body)});
  let data = await response.json();

  updateItems();
}
async function updateItems() {
idEdit = undefined;
document.getElementById("sendButton").value = "send";

  let url = "https://nodejs-3260.rostiapp.cz/crud/read"; //s parametry
  let body = {};
  body.appId = "a823f81994871736795dd11151a5796b";
  body.token = userToken;
  let response = await fetch(url, {"method": "POST", "body": JSON.stringify(body)});
  let data = await response.json();
  //TODO zpracování datového objektu

  let itemObject ="<table class='table'>";

  itemObject = itemObject + "<tr><th> </th><th><h4>jméno/příjmení</h4></th><th>rok narození</th><th>počet bodů</th><th></th></tr>";
  document.getElementById("itemList").innerHTML = itemObject;

  for (let m of data.items){
        itemObject = itemObject + "<tr><td>"; 
          if(m.obj.obrazek){
            itemObject = itemObject + "<img src=" + m.obj.obrazek + " height='200px'>";
          }
        itemObject = itemObject + "</td><td>" + "<h4>" + m.obj.jmeno  + " " + m.obj.prijmeni + "</h4> </td><td>" + m.obj.rokNar + "</td><td>" + m.obj.pocBod + "</td>";
        itemObject = itemObject + "<td>";
        itemObject = itemObject + "<input type='button' onclick='editItem(" + m.id + ")' value='upravit'></input>";
        itemObject = itemObject + "<input type='button' onclick='deleteItem(" + m.id + ")' value='smazat'></input>";
        itemObject = itemObject + "</td>";
        itemObject = itemObject + "</tr>";
        document.getElementById("itemList").innerHTML = itemObject;

       //  document.getElementById("sound").play();
  }
  itemObject = itemObject + "</table>";
}  


function getBase64Image(img, resize = false) {
  let cnv = document.createElement("canvas");
  if (resize) {
      cnv.width = img.width;
      cnv.height = img.height;
  } else {
      cnv.width = img.naturalWidth;
      cnv.height = img.naturalHeight;
  }

  let ctx = cnv.getContext("2d");
  ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

  return cnv.toDataURL();
}
let picUrl;
function savePicture() {
const file = document.getElementById('file_pic').files[0];
if (!file) return; //stisknuto Storno
let tmppath = URL.createObjectURL(file); //create temporary file
let img = document.getElementById("picture");
img.src = tmppath;
img.onload = function(){
    let url = 'https://nodejs-3260.rostiapp.cz/crud/upload';
    let body = {};
    body.appId = "a823f81994871736795dd11151a5796b";
    body.fileName = file.name;
    body.contentType = file.type;
    body.data = getBase64Image(img, true); //convert to Base64
    fetch(url, {method: "POST", body: JSON.stringify(body)})
      .then(response => response.json())
      .then(data => {
          console.log(data);
          picUrl = 'https://nodejs-3260.rostiapp.cz/' + data.savedToFile;
          img.onload = null;
      })
      .catch(err => {
          console.log(err);
      });
};
}

