//ÇIKIŞ YAPMA FONKSİYONU START

document.addEventListener('DOMContentLoaded', () => {
  // Token kontrol fonksiyonu
  function getToken() {
      return localStorage.getItem('token');
  }

  // Token silme fonksiyonu
  function removeToken() {
      localStorage.removeItem('token');
  }

  // Login sayfasına yönlendirme fonksiyonu
  function redirectToLogin() {
      window.location.href = 'login.html';
  }

  // Çıkış fonksiyonu
  function logout() {
      removeToken();
      redirectToLogin();
  }

  // Eğer token yoksa login sayfasına yönlendir
  if (!getToken()) {
      redirectToLogin();
  }

  // Çıkış bağlantısına tıklama olayını dinleyiciye ekle
  document.getElementById('logoutLink').addEventListener('click', (event) => {
      event.preventDefault();
      logout();
  });

  // Sayfa geri gidildiğinde login sayfasına yönlendir
  window.addEventListener('popstate', () => {
      if (!getToken()) {
          redirectToLogin();
      }
  });
});

//ÇIKIŞ YAPMA FONKSİYONU END







// TASARIM İLE İLGİLİ START

let navbar = document.querySelector('#navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    serachForm.classList.remove('active');
    cartItem.classList.remove('active');
}

let serachForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    serachForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}


let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#connection-btn').onclick = () => {
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    serachForm.classList.remove('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
    serachForm.classList.remove('active');
    cartItem.classList.remove('active');
}
const sidebarMenu = document.getElementById('sidebar_btn');
let sidebar = document.querySelector('.sidebar');
let searchBtn = document.querySelector('.fa-magnifying-glass');

sidebarMenu.onclick = function() {
    sidebar.classList.toggle('active');
}
searchBtn.onclick = function() {
    sidebar.classList.toggle('active');
}

// TASARIM İLE İLGİLİ END


// BAĞLANTI TABLOSU VERİLERİ EKLEME-SİLME İLE İLGİLİ START


function getToken() {
  return localStorage.getItem('token');
}




function loadConnectionTableData() {

  
const token = getToken();

const headers = new Headers();

headers.append('Authorization', `Bearer ${token}`);
headers.append('Content-Type', 'application/json');
  

fetch('http://localhost:8086/connection/by/receiver/statusFalse?receiverId=1102', {
  mode:'cors' ,
  method: 'GET',
  headers: headers,
})
.then((response) => response.json())
.then((data) => {

  if (data && data.data && data.data.length > 0) {

    console.log(data.data);

  
    const tableBody = document.getElementById('fakeDataTable');   
    const firstThreeConnections = data.data.slice(0, 3);
  

    firstThreeConnections.forEach(connection => {
      const row = document.createElement('tr');
      row.dataset.id = connection.id;
      row.innerHTML = `
        <td>${connection.sender.name}</td>
        <td><button class="accept-btn">✓</button></td>
        <td><button class="reject-btn">X</button></td>
      `;
      tableBody.appendChild(row);
    });
  }
})
.catch(error => console.error('Veri alinamadi:', error));
}
loadConnectionTableData();


function clearTable() {
    const tableRequestBody = document.getElementById('fakeDataTable');
    const tableConnectionBody = document.getElementById('allconnectiontable');
    tableRequestBody.innerHTML = ''; 
    tableConnectionBody.innerHTML = '';
}


// bağlantı isteği REDDETME
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('reject-btn')) {
        const connectionRejected = event.target.closest('tr').dataset.id;
        console.log('Connection ID:', connectionRejected)
        if (connectionRejected) {
            rejectUser(connectionRejected);
       } else {
         console.error('Connection ID not found');
       }
       // acceptConnection(connectionRejected);
    }
});


async function rejectUser(connectionRejected) {

    
const token = getToken();

const headers = new Headers();

headers.append('Authorization', `Bearer ${token}`);
headers.append('Content-Type', 'application/json');
  
   try {
       const response = await fetch("http://localhost:8086/connection/rejected", {
           method: 'PUT',
           headers: headers,
           body: JSON.stringify({ id: connectionRejected })
       });
       const responseData = await response.json();
       console.log(responseData);
       clearTable();
       loadConnectionTableData();
       clearTable();
       loadAllConnectionData();
       
      // alert("İstek başarıyla reddedildi edildi.");
   } catch (error) {
       console.error('Connection not deleted:', error);
   }
}


// bağlantı isteği KABUL ETME
 document.addEventListener('click', function(event) {
     if (event.target.classList.contains('accept-btn')) {
         const connectionAccepted = event.target.closest('tr').dataset.id;
         console.log('Connection ID:', connectionAccepted)
         if (connectionAccepted) {
            acceptConnection(connectionAccepted);
        } else {
          console.error('Connection ID not found');
        }
        // acceptConnection(connectionAccepted);
     }
 });


async function acceptConnection(connectionAccepted) {
  
const token = getToken();

const headers = new Headers();

headers.append('Authorization', `Bearer ${token}`);
headers.append('Content-Type', 'application/json');


    try {
        const response = await fetch("http://localhost:8086/connection/accepted", {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ id: connectionAccepted })
        });
        const responseData = await response.json();
        console.log(responseData);
        clearTable();
        loadConnectionTableData();
        clearTable();
        loadAllConnectionData();
       // alert("İstek başarıyla kabul edildi.");
    } catch (error) {
        console.error('Connection not accepted:', error);
    }
}

// BAĞLANTI TABLOSU VERİLERİ EKLEME-SİLME İLE İLGİLİ END





// Tüm BAĞLANTILARI LİSTELEME İLE İLGİLİ START


function loadAllConnectionData() {

const token = getToken();
if(!token)
{
  console.error("token not found");
  return;
}
const headers = new Headers();

headers.append('Authorization', `Bearer ${token}`);



    fetch('http://localhost:8086/connection/all', {
      method: 'GET',
      headers: headers,
    })
    .then((response) => response.json())
    .then((data) => {
    
      if (data && data.data && data.data.length > 0) {

        console.log(data.data);

        const tableBody = document.getElementById('allConnectionDataTable');   
        
        // Tüm verileri al
        const allConnections = data.data;


        const connectionRequestsCount = allConnections.filter(connection => !connection.status).length;

        const badge = document.querySelector('#connection-btn .badge');
        badge.textContent = connectionRequestsCount;
    
        allConnections.forEach(connection => {
          const row = document.createElement('tr');
          row.dataset.id = connection.id;
          const statusText = connection.status ? 'ile bağlantın var.' : 'bağlantı kurmak istiyor.';
          row.innerHTML = `
            <td><span class="sender-name">${connection.sender.name}</span> ${statusText}</td>
            <td>${connection.status ? '' : '<button class="accept-btn">Onayla</button>'}</td>
            <td>${connection.status ? '' : '<button class="reject-btn">Sil</button>'}</td>
          `;
          tableBody.appendChild(row);
        });
      }
    })
    .catch((error) => 
      {
        console.error('Veri alinmadi:', error);
   
      });
     
};

loadAllConnectionData();


// Tüm BAĞLANTILARI LİSTELEME İLE İLGİLİ END