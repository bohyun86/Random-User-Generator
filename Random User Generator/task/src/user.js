document.addEventListener('DOMContentLoaded', () => {
    const getUser = () => {
        fetch('https://randomuser.me/api/')
            .then(response => response.json())
            .then(data => {
                const user = data.results[0];
                const userContainer = document.getElementById('user-container');
                addUser(user, userContainer);

                window.user = {
                    name: user.name,
                    email: user.email,
                    password: user.login.password,
                    gender: user.gender,
                    phone: user.phone,
                    location: `${user.location.city}, ${user.location.country}`,
                    birthday: user.dob.date,
                    picture: user.picture.large
                };
            })
            .catch(error => console.log(error));
    };

    const saveUsers = () => {
        const userDivs = document.querySelectorAll('#user-container .user');
        const users = [];

        userDivs.forEach(userDiv => {
            let dob = userDiv.querySelector('.birthday').textContent.replace('Birthday: ', '')
            let birthday = dob.split("/")[2] + "-" + dob.split("/")[1] + "-" + dob.split("/")[0]
            const user = {
                name: {
                    first: userDiv.querySelector('.name').textContent.split(' ')[0],
                    last: userDiv.querySelector('.name').textContent.split(' ')[1],
                },
                email: userDiv.querySelector('.email').textContent.replace('Email: ', ''),
                login: {
                    password: userDiv.querySelector('.password').textContent.replace('Password: ', '')
                },
                gender: userDiv.querySelector('.gender').textContent.replace('Gender: ', ''),
                phone: userDiv.querySelector('.phone').textContent.replace('Phone: ', ''),
                location: {
                    city: userDiv.querySelector('.location').textContent.split(', ')[0].replace('Location: ', ''),
                    country: userDiv.querySelector('.location').textContent.split(', ')[1]
                },
                dob: {
                    date: birthday
                },
                picture: {
                    large: userDiv.querySelector('.photo').src
                }
            };
            users.push(user);
        });

        localStorage.setItem('savedUsers', JSON.stringify(users));
        displaySavedUsers(users);
    };

    const displaySavedUsers = (users) => {
        const savedUserContainer = document.getElementById('saved-user-container');
        savedUserContainer.innerHTML = '';
        const savedUsersMSG = document.createElement('h3');
        savedUsersMSG.textContent = "Saved Users";
        savedUserContainer.prepend(savedUsersMSG);

        users.forEach(user => {
            addUser(user, savedUserContainer, 'saved');
        });
    };

    const addUser = (user, container, className = '') => {
        const userDiv = document.createElement('div');
        userDiv.className = `user ${className}`;

        const userImage = document.createElement('img');
        userImage.src = user.picture.large;
        userImage.alt = `${user.name.first} ${user.name.last}`;
        userImage.className = 'photo';

        const userName = document.createElement('h2');
        userName.className = 'name';
        userName.textContent = `${user.name.first} ${user.name.last}`;

        const userEmail = document.createElement('p');
        userEmail.className = 'email';
        userEmail.textContent = `Email: ${user.email}`;

        const userPassword = document.createElement('p');
        userPassword.className = 'password';
        userPassword.textContent = `Password: ${user.login.password}`;

        const userGender = document.createElement('p');
        userGender.className = 'gender';
        userGender.textContent = `Gender: ${user.gender}`;

        const userPhone = document.createElement('p');
        userPhone.className = 'phone';
        userPhone.textContent = `Phone: ${user.phone}`;

        const userLocation = document.createElement('p');
        userLocation.className = 'location';
        userLocation.textContent = `Location: ${user.location.city}, ${user.location.country}`;

        const dob = new Date(user.dob.date);
        const formattedDob = `${dob.getDate().toString().padStart(2, '0')}/${(dob.getMonth() + 1).toString().padStart(2, '0')}/${dob.getFullYear()}`;
        const userBirthDate = document.createElement('p');
        userBirthDate.className = 'birthday';
        userBirthDate.textContent = `Birthday: ${formattedDob}`;

        userDiv.appendChild(userImage);
        userDiv.appendChild(userName);
        userDiv.appendChild(userEmail);
        userDiv.appendChild(userPassword);
        userDiv.appendChild(userGender);
        userDiv.appendChild(userPhone);
        userDiv.appendChild(userLocation);
        userDiv.appendChild(userBirthDate);

        container.appendChild(userDiv);
    };

    const loadSavedUsers = () => {
        const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
        if (savedUsers.length > 0) {
            displaySavedUsers(savedUsers);
        }
    };

    const getUserButton = document.getElementById('get-user-button');
    getUserButton.addEventListener('click', getUser);

    const saveUsersButton = document.getElementById('save-users-button');
    saveUsersButton.addEventListener('click', saveUsers);

    if (localStorage.getItem('savedUsers')) {
        loadSavedUsers();
    } else {
        getUser();
    }
});
