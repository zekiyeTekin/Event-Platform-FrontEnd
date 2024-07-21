const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnNavbarLogin = document.querySelector('.btnLogin');
const iconClose = document.querySelector('.icon-close');



registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnNavbarLogin.addEventListener('click', ()=> {
    wrapper.classList.add('active-btnLogin');
});


iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-btnLogin');
});


function saveToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeToken('token');
}








function register() {
const email = document.getElementById('email').value ; 
const password = document.getElementById('password').value ;   
const username = document.getElementById('username').value ;   



    fetch('http://localhost:8086/auth/register', {
      mode:'cors'  ,
      method: 'POST',
      headers: {

        'Content-Type': 'application/json'
      },
      body: 
        JSON.stringify({
            name: username,
            mail: email,
            password: password,
            
        })
      
    })
    .then(response =>{
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
        })
    .then(data => {
        console.log('Success:', data);
        if (data.token) {
            console.log('Token:', data.token);
        } else {
            console.log('No token received');
        }
     
    })
    .catch ((error) => {
        console.error('Connection not registered:', error);
    }
    )};

    document.getElementById('register-btn').addEventListener('click', ()=> {
        register();
    });







   
 function login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        console.log(email, password);


         fetch('http://localhost:8086/auth/login', {
            mode:'cors'  ,
            method: 'POST',
            headers: {
      
              'Content-Type': 'application/json'
            },
            body: 
              JSON.stringify({
                  mail: email,
                  password: password
              })
            
          })
          .then(response =>{
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();

          })
          .then(data => {
            console.log('Success:', data);
            if (data.token) {
                console.log('Token:', data.token);
                
                localStorage.setItem('authToken', data.token);
                saveToken(data.token);

                window.location.href = "index.html";
            } else {
                console.log('No token received');
            }
           
          })
          .catch ((error) => {
            console.error('There was a problem with the fetch operation:', error);
          }
        );
}
    
    document.getElementById('login-btn').addEventListener('click', ()=> {
        login();
    });




    document.addEventListener("DOMContentLoaded", function() {
        fetchAndDisplayCommunities();
        fetchAndDisplayEvents();
        
    });
    
    async function fetchAndDisplayCommunities() {
        try {
            const response = await fetch('http://localhost:8086/community/getAll', {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            
            if (data && data.data && data.data.length > 0) {
                const rowBoxes = document.querySelectorAll('#allMember .rowBox');
    
                for (const [index, community] of data.data.entries()) {
                    const isActive = community.isActive;
                    const rowBox = rowBoxes[index];
                    const boxDetailsSpan = rowBox.querySelector(`#boxDetailsSpan${index + 1}`);
                    const imgElement = rowBox.querySelector(`img`);
                    const memberCountP = rowBox.querySelector(`#memberCountForCommunity${index + 1}`); // Güncel id'yi kullanın
    
                    if (isActive && index < rowBoxes.length) {
                        //console.log("Active Community: ", community);
                        
                        if (boxDetailsSpan) {
                            boxDetailsSpan.innerText = community.title;
                        }
                        if (imgElement) {
                            imgElement.src = `images/bb (${index + 2}).jpg`;  
                            imgElement.alt = community.title;
                        }
                                              
                        const memberCount = await memberCountForCommunity(community.id);
                        if (memberCountP) {
                            //console.log("Üyeler:", memberCount); 
                            memberCountP.innerText = `Üyeler:${memberCount}`;
                        }
                    } else {
                        console.log("Community is not active or index out of bounds");
                    }
                }
            }
        } catch (error) {
            console.error('Topluluk verileri alınırken bir hata oluştu!', error);
        }
    }


    async function memberCountForCommunity(communityId) {
        try {
            const response = await fetch(`http://localhost:8086/communityUser/list/by/community?id=${communityId}`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            //console.log(`Topluluk ${communityId} Üyeler:`, data.data.length);
            return data.data.length;
        } catch (error) {
            throw new Error(`Topluluk ${communityId} üye sayısı alınırken bir hata oluştu! ${error}`);
        }
    }
    





  
    async function fetchAndDisplayEvents() {
        try {
            const response = await fetch('http://localhost:8086/event/getAll', {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            
            if (data && data.data && data.data.length > 0) {
                const rowBoxes = document.querySelectorAll('#allMemberEvent .rowBox');
               
    
                for (const [index, event] of data.data.entries()) {

                    const isActive = event.isActive;
                    const rowBox = rowBoxes[index];
                    const boxDetailsSpanForEvent= rowBox.querySelector(`#boxDetailsSpanForEvent${index + 1}`);
                    const imgElement = rowBox.querySelector('img');
                    const memberCountP = rowBox.querySelector(`#memberCountForEvent${index + 1}`); // Güncel id'yi kullanın

                    if (isActive && index < rowBoxes.length) {
                       
                        console.log("Active Eventler: ", event);
                        
                        if (boxDetailsSpanForEvent) {
                            console.log("Event başlığı", event.title);
                            boxDetailsSpanForEvent.innerText = event.title;
                        }else {
                            console.warn(`Element not found: #boxDetailsSpanForEvent${index + 1}`);
                        }
                        if (imgElement) {
                            imgElement.src = `images/bb (${index + 1}).jpg`;  
                            imgElement.alt = event.title;
                        }
                                              
                        const memberCount = await memberCountForEvent(event.id);
                        if (memberCountP) {
                            memberCountP.innerText = `Üyeler: ${memberCount}`;
                        }else {
                            console.warn(`Element not found: #memberCountForEvent${index + 1}`);
                        }

                    } else {
                        console.log("Event is not active or index out of bounds");
                    }
                }
            }
        } catch (error) {
            console.error('Etkinlik verileri alınırken bir hata oluştu!', error);
        }
    }


    async function memberCountForEvent(eventId) {
        try {
            const response = await fetch(`http://localhost:8086/eventUser/list/by/event?id=${eventId}`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(`Etkinlik ${eventId} Katılımcı:`, data.data.length);
            return data.data.length;
        } catch (error) {
            throw new Error(`Topluluk ${eventId} üye sayısı alınırken bir hata oluştu! ${error}`);
        }
    }
    