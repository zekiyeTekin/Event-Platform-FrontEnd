// document.addEventListener('DOMContentLoaded', () => {
//     let previewContainer = document.querySelector('.community-preview');
//     let previewBox = document.querySelector('#preview');
//     let communityContainer = document.querySelector('.community-container');

//     // Verileri endpointten al
//     fetch('http://localhost:8086/community/getAll')
//         .then(response => response.json())
//         .then(data => {
//             console.log(data); // Gelen veriyi konsola yazdır

//             if (data && data.data && data.data.length > 0) {
//                 // Topluluk kartlarını oluştur
//                 data.data.forEach(community => {
//                     let communityDiv = document.createElement('div');
//                     communityDiv.classList.add('community');
//                     communityDiv.setAttribute('data-id', community.id);
//                     communityDiv.setAttribute('data-name', community.title);
//                     communityDiv.setAttribute('data-address', community.address);
//                     communityDiv.setAttribute('data-category', community.category.typeName);

//                     communityDiv.innerHTML = `
//                         <img src="images/pngegg.png" alt="">
//                         <h3>${community.title}</h3>
//                         <div class="community-detail">! Detay</div>
//                     `;

//                     communityContainer.appendChild(communityDiv);

//                     // Click event handler for each community
//                     communityDiv.onclick = () => {
//                         // Karttan bilgileri al
//                         let communityId = communityDiv.getAttribute('data-id');
//                         let name = communityDiv.getAttribute('data-name');
//                         let address = communityDiv.getAttribute('data-address');
//                         let category = communityDiv.getAttribute('data-category');

//                         // Preview kutusuna bilgileri yerleştir
//                         previewBox.querySelector('.preview-name').textContent = name;
//                         previewBox.querySelector('.preview-address').innerHTML = '<i class="fas fa-location-arrow"></i> ' + address;
//                         previewBox.querySelector('.preview-category').textContent = `Kategori: ${category}`;

//                         fetch(`http://localhost:8086/communityUser/list/by/community?id=${communityId}`)
//                         .then(response => response.json())
//                         .then(userData => {
//                             console.log(userData); // Gelen veriyi konsola yazdır
//                             let memberCount = userData.data.length; // Üye sayısını al
//                             // Üye detaylarını ve sayısını yerleştir
//                             previewBox.querySelector('.preview-details').textContent = `Üye: ${memberCount}`;
//                             previewContainer.style.display = 'flex';
//                             previewBox.classList.add('active');
//                         })
//                         .catch(error => {
//                             console.error('Error fetching community user data:', error);
//                         });
//                     };
//                 });
//             } else {
//                 console.error('Error: Received data is not an array', data);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching community data:', error);
//         });

//     // Kapatma düğmesine tıklama olayını dinleyin
//     previewBox.querySelector('.fa-times').onclick = () => {
//         previewBox.classList.remove('active');
//         previewContainer.style.display = 'none';
//     }
// });






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

function getEmailFromTokenForCommunity() {
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

function loadCommunityByUser() {

    const email = getEmailFromTokenForCommunity();    
    
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

        
            
            let previewContainer = document.querySelector('.community-preview');
            let previewBox = document.querySelector('#preview');
            let communityContainer = document.querySelector('.community-container');

            fetch(`http://localhost:8086/communityUser/byId?userId=${userId}`, {
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
                console.log('Community data received:', data);

                if (data && data.data && data.data.length > 0) {
                    data.data.forEach(community => {
                        console.log('Communitylerimiz:',community);


                        let communityDiv = document.createElement('div');
                        communityDiv.classList.add('community');
                        communityDiv.setAttribute('data-id', community.community.id);
                        communityDiv.setAttribute('data-name', community.community.title);
                        communityDiv.setAttribute('data-address', community.community.address);

                        if (community.community.category && community.community.category.typeName) {
                            communityDiv.setAttribute('data-category', community.community.category.typeName);
                        } else {
                            console.error('Category or title is undefined:', community.community.title);
                        }
                        

                        communityDiv.innerHTML = `
                            <img src="images/pngegg.png" alt="">
                            <h3>${community.community.title}</h3>
                            <div class="event-detail">! Yorumlar buraya gelebilir</div>
                        `;

                        communityContainer.appendChild(communityDiv);

                        communityDiv.onclick = () => {
                            let communityId = communityDiv.getAttribute('data-id');
                            let name = communityDiv.getAttribute('data-name');
                            let address = communityDiv.getAttribute('data-address');
                            let category = communityDiv.getAttribute('data-category');
   
                            // Preview kutusuna bilgileri yerleştir
                            previewBox.querySelector('.preview-name').textContent = name;
                            previewBox.querySelector('.preview-address').innerHTML = '<i class="fas fa-location-arrow"></i> ' + address;
                            previewBox.querySelector('.preview-category').textContent = `Kategori: ${category}`;
                            
                            fetch(`http://localhost:8086/communityUser/list/by/community?id=${communityId}`,{
                                mode: 'cors',
                                method: 'GET',
                                headers: headers,
                            })
                            .then(response => response.json())
                            .then(userData => {
                                console.log(userData); 

                                let memberCount = userData.data.length;
                                previewBox.querySelector('.preview-details').textContent = `Üye: ${memberCount}`;
                                previewContainer.style.display = 'flex';
                                previewBox.classList.add('active');

                        }).catch(error => {
                                console.error('Error fetching community user data:', error);
                            });
                        };
                    });
                } else {
                    console.error('Error: Received data is not an array or is empty', data);
                }
            })
            .catch(error => {
                console.error('Error fetching community data:', error);
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
loadCommunityByUser();
