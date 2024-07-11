import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCAZPZFJ3UZ2NY9J6O3OhEh_RDedKTkVco",
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

const googleBtn = document.querySelector('#googleBtn');
const loginContainer = document.querySelector('.login-container');
const container = document.querySelector('#container');
const inputField = document.querySelector('#input-field');
const inputForm = document.querySelector('#add-btn-field');
const shoppingItemList = document.querySelector('#shopping-item-list');
const namebox = document.querySelector('#namebox');
const imgbox = document.querySelector('#imgbox');
const logoutBtn = document.querySelector('#logoutBtn');

googleBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
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

function login(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username !== '' && password.length >= 5) {
    localStorage.setItem('username', username);
    window.location.href = './todlist.html';
  } else {
    alert('Your password should be at least 5 characters');
  }
}

document.querySelector('#login').addEventListener('click', login);

const addToCart = (e) => {
  e.preventDefault();
  const name = prompt('Enter your name');
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
    namebox.textContent = email;
    const user = JSON.parse(localStorage.getItem('userStore'));
    const pic = user.photoURL;
    imgbox.setAttribute('src', pic);
  }
};

const logout = () => {
  localStorage.removeItem('email');
  localStorage.removeItem('username');
  localStorage.removeItem('userStore');
  window.location.href = './index.html';
};

logoutBtn.addEventListener('click', logout);
onGoogleLogin();

const onLogin = () => {
  const username = localStorage.getItem('username');
  if (username) {
    console.log('login', username);
  }
};

onLogin();

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
    shoppingItemList.innerHTML = 'No items on the list yet';
  }
});


  