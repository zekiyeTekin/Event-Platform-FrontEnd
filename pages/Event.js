function getToken() {
    return localStorage.getItem('token');
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
}

function getEmailFromToken() {
    const token = getToken();
    if (!token) {
        console.error('Token not found');
        return null;
    }

    const decodedToken = parseJwt(token);
    console.log('Email from token:', decodedToken.sub);
    return decodedToken.sub;
}


function getUserIdByEmail(email) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${getToken()}`);
   

    return fetch(`http://localhost:8086/user/byMail?mail=${email}`, {
        mode: 'cors',
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('User data received:', data.data.id);
        return data.data.id;
    });
}

function loadEventByUser() {

    const email = getEmailFromToken();
    
    
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${getToken()}`);
    headers.append('Content-Type', 'application/json');
    
    console.log('Headers:', headers);
    


    if (!email) {
        console.error('Email not found in token');
        return;
    }

    getUserIdByEmail(email)
    .then(userId => {
        if (!userId) {
            console.error('User ID not found');
            
            return;
        }
        console.log('User ID:', userId);

        
            let previewContainer = document.querySelector('.event-preview');
            let previewBox = document.querySelector('#preview');
            let eventContainer = document.querySelector('.event-container');

            fetch(`http://localhost:8086/eventUser/byId?userId=${userId}`, {
                mode: 'cors',
                method: 'GET',
                headers: headers,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
               
                return response.json();
            })
            .then(data => {
                console.log('Event data received:', data);

                if (data && data.data && data.data.length > 0) {
                    data.data.forEach(event => {
                        console.log('Event:', event);

                        let eventDiv = document.createElement('div');
                        eventDiv.classList.add('event');
                        eventDiv.setAttribute('data-id', event.id);
                        eventDiv.setAttribute('data-name', event.title);
                        eventDiv.setAttribute('data-address', event.address);
                        eventDiv.setAttribute('data-category', event.category.typeName);

                        eventDiv.innerHTML = `
                            <img src="images/pngegg (1).png" alt="">
                            <h3>${event.title}</h3>
                            <div class="event-detail">Etkinlik tarihi: ${event.date}</div>
                        `;

                        eventContainer.appendChild(eventDiv);

                        eventDiv.onclick = () => {
                            let eventId = eventDiv.getAttribute('data-id');
                            let name = eventDiv.getAttribute('data-name');
                            let address = eventDiv.getAttribute('data-address');
                            let category = eventDiv.getAttribute('data-category');

                            previewBox.querySelector('.preview-name').textContent = name;
                            previewBox.querySelector('.preview-address').innerHTML = '<i class="fas fa-location-arrow"></i> ' + address;
                            previewBox.querySelector('.preview-category').textContent = `Kategori: ${category}`;
                            previewBox.querySelector('.preview-explation').textContent = `Detay: ${event.details}`;

                            fetch(`http://localhost:8086/eventUser/list/by/event?id=${eventId}`, {
                                mode: 'cors',
                                method: 'GET',
                                headers: headers,
                            })
                            .then(response => response.json())
                            .then(userData => {
                                console.log('Event user data received:', userData);

                                let memberCount = userData.data.length;
                                previewBox.querySelector('.preview-details').textContent = `Üye: ${memberCount}`;
                                previewContainer.style.display = 'flex';
                                previewBox.classList.add('active');
                            })
                            .catch(error => {
                                console.error('Error fetching event user data:', error);
                            });
                        };
                    });
                } else {
                    console.error('Error: Received data is not an array or is empty', data);
                }
            })
            .catch(error => {
                console.error('Error fetching event data:', error);
            });

            previewBox.querySelector('.fa-times').onclick = () => {
                previewBox.classList.remove('active');
                previewContainer.style.display = 'none';
            };
        
    })
    .catch(error => {
        console.error('Error fetching user ID by email:', error);
    });
}
loadEventByUser();
