
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

window.env = {
    New_api_key: "AIzaSyCAZPZFJ3UZ2NY9J6O3OhEh_RDedKTkVco"
};

const firebaseConfig = {
    apiKey: window.env.New_api_key,
    authDomain: "fresh-todolist.firebaseapp.com",
    projectId: "fresh-todolist",
    storageBucket: "fresh-todolist.appspot.com",
    messagingSenderId: "961687776701",
    appId: "1:961687776701:web:4b7edef4f97b0c3638b6d4",
    databaseURL: "https://fresh-todolist-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dataBase = getDatabase(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const user = auth.currentUser;

const googleBtn = document.querySelector('#googleBtn');
const loginContainer = document.querySelector('.login-container');
const container = document.querySelector('#container');
const dropdown = document.querySelector('.dropdown');
const dropbtn = document.querySelector('.dropbtn');
const dropDownContent = document.querySelector('.dropdown-content');
const inputField = document.querySelector('#input-field');
const inputForm = document.querySelector('#add-btn-field');
const shoppingItemList = document.querySelector('#shopping-item-list');
const namebox = document.querySelector('#namebox');
const imgbox = document.querySelector('#imgbox');
const picturebox = document.querySelector('#picturebox');
const logoutBtn = document.querySelector('#logoutBtn');
const signupBtn = document.querySelector('#signup-btn');
const titleh2 = document.querySelector('#titleh2');
const signUpform = document.querySelector('#signUp');
const firstname = document.querySelector('#firstname');
const email = document.querySelector('#email');
const form = document.querySelector('#form');
const signUpSubmit = document.querySelector('#signUpSubmit');
const confirmpassword = document.querySelector('#confirmpassword');
const signUpassword = document.querySelector('#signUpassword');
const password = document.querySelector('#password');


googleBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user)
            localStorage.setItem('email', user.email);
            localStorage.setItem('userStore', JSON.stringify(user));
            localStorage.setItem('pic', user.photoURL);
            loginContainer.style.display = 'none';
            container.style.display = 'flex';
            onGoogleLogin();
        })
        .catch((error) => {
            console.error(error.code, error.message);
        });
});

const signUpFunc =(e) =>{
    e.preventDefault();
    console.log('signup');
    form.style.display = 'none'
    signUpform.style.display = 'flex';
    titleh2.textContent = 'Sign UP'
}


signupBtn.addEventListener('click',signUpFunc);

const getUserDetails =(e)=>{
    e.preventDefault();
    console.log('submitsignup');
    if(email.value === '' || firstname.value === ''){
     alert('Fill up the form')   
    }else{
        form.style.display = 'flex'
        signUpform.style.display = 'none';
        titleh2.textContent = 'Log In';
        console.log(firstname.value);
        console.log(email.value);
        console.log(signUpassword.value);
        console.log(confirmpassword.value);   

    }
    if (confirmpassword.value !== signUpassword.value ){
        alert('Passwords are not the same');
        confirmpassword.value ='';
        signUpassword.value = '';
    } else {
        form.style.display = 'flex'
        signUpform.style.display = 'none';
        titleh2.textContent = 'Log In';
        console.log(firstname.value);
        console.log(email.value);
        console.log(signUpassword.value);
        console.log(confirmpassword.value);   
    }
}
signUpSubmit.addEventListener('click', getUserDetails);


function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    localStorage.setItem('username', username);

    if (username !== '' && password.length >= 5) {
        const usernamestore = (localStorage.getItem('username'));
        loginContainer.style.display = 'none';
        container.style.display = 'flex';
        dropbtn.removeChild(picturebox);
        dropbtn.appendChild(namebox);
        namebox.textContent = usernamestore;
        namebox.style.display = 'flex';
        imgbox.style.display = 'none';
    } else {
        alert('Your password should be at least 5 characters');
    }
}

document.querySelector('#login').addEventListener('click', login);

const addToCart = (e) => {
    e.preventDefault();
    let name;
    const user = JSON.parse(localStorage.getItem('userStore'));

    if (user && user.displayName) {
        name = user.displayName;
    } else {
        const usernamestore = localStorage.getItem('username');
        name = usernamestore;
    }

    const item = inputField.value;
    const d = new Date();
    const date = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (name !== null && item.trim() !== '') {
        push(ref(dataBase, "shoppingList"), { item, user: name, date, completed: false });
        inputField.value = '';
    }
};
inputForm.addEventListener('submit', addToCart);

const onGoogleLogin = () => {
    const email = localStorage.getItem('email');
    
    if (email) {
        namebox.style.display = 'flex';
        imgbox.style.display = 'flex';
        const user = JSON.parse(localStorage.getItem('userStore'));
        const pic = user.photoURL;
        const name = user.displayName;
        namebox.textContent = name;
        imgbox.setAttribute('src', pic);
    }
};


const logout = () => {
        signOut(auth).then(() => {
          localStorage.removeItem('email');
          localStorage.removeItem('username');
          localStorage.removeItem('userStore');
          window.location.href = './index.html';
        }).catch((error) => {
          console.error('Sign out error', error);
        });
      };

logoutBtn.addEventListener('click', logout);

onValue(ref(dataBase, "shoppingList"), (snapshot) => {
    if (snapshot.exists()) {
        const items = snapshot.val();
        shoppingItemList.innerHTML = '';
        const table = document.createElement('table');
        table.setAttribute('border', '1');
        table.setAttribute('id', 'table');
        shoppingItemList.appendChild(table);
        const headerRow = document.createElement('tr');
        headerRow.setAttribute('id', 'headerRow');
        const headers = ['Item', 'User', 'Date'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.setAttribute('id', 'th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        Object.keys(items).forEach(key => {
            const { item, user, date, completed } = items[key];
            const row = document.createElement('tr');
            row.setAttribute('id', 'row');
            table.appendChild(row);

            [item, user, date].forEach(text => {
                const td = document.createElement('td');
                td.setAttribute('id', 'td');
                td.textContent = text;
                row.appendChild(td);
            });

            if (completed) {
                row.style.textDecoration = 'line-through';
            }

            row.addEventListener('click', () => {
                const exactLocation = ref(dataBase, `shoppingList/${key}`);
                update(exactLocation, { completed: !completed });
            });

            row.addEventListener('dblclick', () => {
                const exactLocation = ref(dataBase, `shoppingList/${key}`);
                remove(exactLocation);
            });
        });
    } else {
        shoppingItemList.innerHTML = 'No items here... add an item';
    }
});

// Add event listener to dropbtn
dropbtn.addEventListener('click', () => {
    dropDownContent.style.display = dropDownContent.style.display === 'block' ? 'none' : 'block';
});