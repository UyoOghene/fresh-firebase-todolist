import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
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


const googleBtn = document.querySelector('#googleBtn');
const loginContainer = document.querySelector('.login-container');
const loginRequirements = document.querySelector('#login-password-requirements');
const dropdownContainer = document.querySelector('.dropdown-container');
const container = document.querySelector('.container');
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
const loginpassword = document.querySelector('#password');
const notificationIcon = document.querySelector('.notification');
const messageIcon = document.querySelector('.messages');
const help = document.querySelector('#Help');
const profile = document.querySelector('#display');
const themeIcon = document.querySelector('.insights');
const card = document.querySelector('.card');
const mainContainer = document.querySelector('.main-container');
const themeImg = document.querySelector('#theme-img');
const priceInput = document.querySelector('#price-input');
const totalSpan = document.querySelector('#total-span');


themeIcon.addEventListener('click', () => {
    card.classList.toggle('dark-theme');
    dropdown.classList.toggle('dark-theme');
    container.classList.toggle('dark-theme');
    notificationIcon.classList.toggle('dark-theme');
    messageIcon.classList.toggle('dark-theme');
    themeIcon.classList.toggle('dark-theme');
    dropDownContent.classList.toggle('dark-theme');

    if(card.classList.contains ('dark-theme') ){
        themeImg.src= './images/dark theme bulb.png';
    }else{
        themeImg.src= '/images/insights icon.png';
    }
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const themePreference = card.classList.contains('dark-theme') ? 'dark' : 'light';
        update(ref(dataBase, `users/${userId}`), { theme: themePreference });
    }
});


const applyThemePreference = (userId) => {
    const themeRef = ref(dataBase, `users/${userId}/theme`);
    onValue(themeRef, (snapshot) => {
        if (snapshot.exists()) {
            const themePreference = snapshot.val();
            if (themePreference === 'dark') {
                card.classList.add('dark-theme');
            } else {
                card.classList.remove('dark-theme');
            }
        }
    });
};

signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    signUpform.style.display = 'flex';
    titleh2.textContent = 'Sign UP';
});

signUpSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    if (email.value === '' || firstname.value === '' || signUpassword.value === '' || confirmpassword.value === '') {
        alert('Please fill up all the fields');
    } else if (signUpassword.value !== confirmpassword.value) {
        alert('Passwords do not match');
        confirmpassword.value = '';
        signUpassword.value = '';
    } else {
        createUserWithEmailAndPassword(auth, email.value, signUpassword.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User signed up:', user);
                form.style.display = 'flex';
                signUpform.style.display = 'none';
                titleh2.textContent = 'Log In';
            })
            .catch((error) => {
                console.error('Sign up error', error.code, error.message);
            });
    }
});
const onGoogleLogin = () => {
    const user = auth.currentUser;
    if (user) {
        const email = user.email;
        const userId = user.uid;
        localStorage.setItem('email', email);
        localStorage.setItem('userStore', JSON.stringify(user));
        localStorage.setItem('pic', user.photoURL);
        namebox.style.display = 'flex';
        imgbox.style.display = 'flex';
        const pic = user.photoURL;
        const name = user.displayName;
        namebox.textContent = name;
        imgbox.setAttribute('src', pic);
        applyThemePreference(userId); 
    }
};

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



document.querySelector('#login').addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed in:', user);
            loginContainer.style.display = 'none';
            container.style.display = 'flex';
            dropbtn.removeChild(picturebox);
            dropbtn.appendChild(namebox);
            namebox.textContent = user.email;
            namebox.style.display = 'flex';
            imgbox.style.display = 'none';
            applyThemePreference(user.uid);
        })
        .catch((error) => {
            console.error('Sign in error', error.code, error.message);
        });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        localStorage.removeItem('userStore');
        window.location.href = './index.html';
    }).catch((error) => {
        console.error('Sign out error', error);
    });
});
const addToCart = (e) => {
    e.preventDefault();
    const newPrice = prompt("Add price:", 'price');

    let name;
    const user = JSON.parse(localStorage.getItem('userStore'));

    if (user && user.displayName) {
        name = user.displayName;
    } else {
        const usernamestore = localStorage.getItem('username');
        name = usernamestore;
    }

    const item = inputField.value;
    const price = newPrice;
    const d = new Date();
    const date = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (name !== null && item.trim() !== '' && price!== null) {
        push(ref(dataBase, "shoppingList"), { item, user: name, date,price, completed: false });
        inputField.value = '';
    }
};
inputForm.addEventListener('submit', addToCart);


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
        const headers = ['Item', 'User', 'Date', 'Price'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.setAttribute('id', 'th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        let totalPrice = 0;

        Object.keys(items).forEach(key => {
            const { item, user, date, price, completed } = items[key];
            const row = document.createElement('tr');
            row.setAttribute('id', 'row');
            table.appendChild(row);

            const itemTd = document.createElement('td');
            itemTd.setAttribute('id', 'td');
            itemTd.textContent = item;

            const editIcon = document.createElement('img');
            editIcon.setAttribute('id', 'editImg');
            editIcon.setAttribute('src', './images/pencil.png');
            editIcon.style.cursor = 'pointer';
            editIcon.style.marginLeft = '10px';
            itemTd.appendChild(editIcon);

            const userTd = document.createElement('td');
            userTd.setAttribute('id', 'td');
            userTd.textContent = user;

            const dateTd = document.createElement('td');
            dateTd.setAttribute('id', 'td');
            dateTd.textContent = date;

            const priceTd = document.createElement('td');
            priceTd.setAttribute('id', 'td');
            priceTd.textContent = price;

            row.appendChild(itemTd);
            row.appendChild(userTd);
            row.appendChild(dateTd);
            row.appendChild(priceTd);

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

            editIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const newInput = prompt("Edit item:", item);
                if (newInput !== null && newInput.trim() !== "") {
                    const exactLocation = ref(dataBase, `shoppingList/${key}`);
                    update(exactLocation, { item: newInput });
                }
            });

            totalPrice += parseInt(price);
            totalSpan.textContent = totalPrice;

        });
        

    } else {
        shoppingItemList.innerHTML = 'No items here... add an item';
    }
});

dropbtn.addEventListener('click', () => {
    dropDownContent.style.display = dropDownContent.style.display === 'block' ? 'none' : 'block';
});


document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('signUpassword');
    
    const passwordRequirements = document.getElementById('password-requirements');

    passwordInput.addEventListener('focus', () => {
        passwordRequirements.style.display = 'block';
    });

    passwordInput.addEventListener('blur', () => {
        passwordRequirements.style.display = 'none';
    });

    passwordInput.addEventListener('input', () => {
        const value = passwordInput.value;
        const requirements = [
            value.length >= 8,
            /[A-Z]/.test(value),
            /[a-z]/.test(value),
            /[0-9]/.test(value),
            /[^A-Za-z0-9]/.test(value)
        ];
        
        const listItems = passwordRequirements.querySelectorAll('li');
        listItems.forEach((item, index) => {
            item.style.color = requirements[index] ? 'green' : 'red';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loginpassword.addEventListener('focus', () => {
        loginRequirements.style.display = 'block';
    });

    loginpassword.addEventListener('blur', () => {
        loginRequirements.style.display = 'none';
    });

    loginpassword.addEventListener('input', () => {
        const value = loginpassword.value;
        const requirements = [
            value.length >= 8,
            /[A-Z]/.test(value),
            /[a-z]/.test(value),
            /[0-9]/.test(value),
            /[^A-Za-z0-9]/.test(value)
        ];
        
        const listItems2 = loginRequirements.querySelectorAll('li');
        listItems2.forEach((item2, index) => {
            item2.style.color = requirements[index] ? 'green' : 'red';
        });
    });
})
  






// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// import { getAuth, GoogleAuthProvider, signInWithPopup,signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// window.env = {
//     New_api_key: "AIzaSyCAZPZFJ3UZ2NY9J6O3OhEh_RDedKTkVco"
// };

// const firebaseConfig = {
//     apiKey: window.env.New_api_key,
//     authDomain: "fresh-todolist.firebaseapp.com",
//     projectId: "fresh-todolist",
//     storageBucket: "fresh-todolist.appspot.com",
//     messagingSenderId: "961687776701",
//     appId: "1:961687776701:web:4b7edef4f97b0c3638b6d4",
//     databaseURL: "https://fresh-todolist-default-rtdb.firebaseio.com/",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const dataBase = getDatabase(app);
// auth.languageCode = 'en';
// const provider = new GoogleAuthProvider();
// const user = auth.currentUser;

// const googleBtn = document.querySelector('#googleBtn');
// const loginContainer = document.querySelector('.login-container');
// const dropdownContainer = document.querySelector('.dropdown-container');
// const container = document.querySelector('.container');
// const dropdown = document.querySelector('.dropdown');
// const dropbtn = document.querySelector('.dropbtn');
// const dropDownContent = document.querySelector('.dropdown-content');
// const inputField = document.querySelector('#input-field');
// const inputForm = document.querySelector('#add-btn-field');
// const shoppingItemList = document.querySelector('#shopping-item-list');
// const namebox = document.querySelector('#namebox');
// const imgbox = document.querySelector('#imgbox');
// const picturebox = document.querySelector('#picturebox');
// const logoutBtn = document.querySelector('#logoutBtn');
// const signupBtn = document.querySelector('#signup-btn');
// const titleh2 = document.querySelector('#titleh2');
// const signUpform = document.querySelector('#signUp');
// const firstname = document.querySelector('#firstname');
// const email = document.querySelector('#email');
// const form = document.querySelector('#form');
// const signUpSubmit = document.querySelector('#signUpSubmit');
// const confirmpassword = document.querySelector('#confirmpassword');
// const signUpassword = document.querySelector('#signUpassword');
// const loginpassword = document.querySelector('#password');
// const notificationIcon = document.querySelector('.notification');
// const messageIcon = document.querySelector('.messages');
// const help = document.querySelector('#Help');
// const profile = document.querySelector('#display');
// const themeIcon = document.querySelector('.insights');
// const card = document.querySelector('.card');
// const mainContainer = document.querySelector('.main-container');
// const themeImg = document.querySelector('#theme-img');
// const priceInput = document.querySelector('#price-input');
// const totalSpan = document.querySelector('#total-span');



// themeIcon.addEventListener('click', () => {
//     card.classList.toggle('dark-theme');
//     dropdown.classList.toggle('dark-theme');
//     container.classList.toggle('dark-theme');
//     notificationIcon.classList.toggle('dark-theme');
//     messageIcon.classList.toggle('dark-theme');
//     themeIcon.classList.toggle('dark-theme');
//     dropDownContent.classList.toggle('dark-theme');

//     if(card.classList.contains ('dark-theme') ){
//         themeImg.src= './images/dark theme bulb.png';
//     }else{
//         themeImg.src= '/images/insights icon.png';
//     }
//     const user = auth.currentUser;
//     if (user) {
//         const userId = user.uid;
//         const themePreference = card.classList.contains('dark-theme') ? 'dark' : 'light';
//         update(ref(dataBase, `users/${userId}`), { theme: themePreference });
//     }
// });

// const applyThemePreference = (userId) => {
//     const themeRef = ref(dataBase, `users/${userId}/theme`);
//     onValue(themeRef, (snapshot) => {
//         if (snapshot.exists()) {
//             const themePreference = snapshot.val();
//             if (themePreference === 'dark') {
//                 card.classList.add('dark-theme');
//             } else {
//                 card.classList.remove('dark-theme');
//             }
//         }
//     });
// };

// help.addEventListener('click',()=>{
//     window.location.href = "./help.html";
// })
// profile.addEventListener('click',()=>{
//     window.location.href = "./profile.html";
// })

// const onGoogleLogin = () => {
//     const user = auth.currentUser;
//     if (user) {
//         const email = user.email;
//         const userId = user.uid;
//         localStorage.setItem('email', email);
//         localStorage.setItem('userStore', JSON.stringify(user));
//         localStorage.setItem('pic', user.photoURL);
//         namebox.style.display = 'flex';
//         imgbox.style.display = 'flex';
//         const pic = user.photoURL;
//         const name = user.displayName;
//         namebox.textContent = name;
//         imgbox.setAttribute('src', pic);
//         applyThemePreference(userId); 
//     }
// };

// // const login = (e) => {
// //     e.preventDefault();
// //     const username = document.getElementById('username').value;
// //     const password = document.getElementById('password').value;
// //     localStorage.setItem('username', username);
    

// //     if (username !== '' && loginpassword.length >= 5) {
// //         const user = auth.currentUser;
// //         const usernamestore = localStorage.getItem('username');
// //         loginContainer.style.display = 'none';
// //         container.style.display = 'flex';
// //         dropbtn.removeChild(picturebox);
// //         dropbtn.appendChild(namebox);
// //         namebox.textContent = usernamestore;
// //         namebox.style.display = 'flex';
// //         imgbox.style.display = 'none';
// //         if (user) {
// //             applyThemePreference(user.uid);  // Apply theme preference
// //         }
// //     } else {
// //         alert('Your password should be at least 5 characters');
// //     }
// // };

// // const auth = getAuth();
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//             loginContainer.style.display = 'none';
//         container.style.display = 'flex';
//         dropbtn.removeChild(picturebox);
//         dropbtn.appendChild(namebox);
//         namebox.textContent = user;
//         namebox.style.display = 'flex';
//         imgbox.style.display = 'none';
//         if (user) {
//             applyThemePreference(user.uid);  // Apply theme preference
//         }

//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });



// document.addEventListener('DOMContentLoaded', () => {
//     const passwordInput = document.getElementById('signUpassword');
    
//     const passwordRequirements = document.getElementById('password-requirements');

//     passwordInput.addEventListener('focus', () => {
//         passwordRequirements.style.display = 'block';
//     });

//     passwordInput.addEventListener('blur', () => {
//         passwordRequirements.style.display = 'none';
//     });

//     passwordInput.addEventListener('input', () => {
//         const value = passwordInput.value;
//         const requirements = [
//             value.length >= 8,
//             /[A-Z]/.test(value),
//             /[a-z]/.test(value),
//             /[0-9]/.test(value),
//             /[^A-Za-z0-9]/.test(value)
//         ];
        
//         const listItems = passwordRequirements.querySelectorAll('li');
//         listItems.forEach((item, index) => {
//             item.style.color = requirements[index] ? 'green' : 'red';
//         });
//     });

//     // const loginRequirements = document.getElementById('login-password-requirements');
//     // loginpassword.addEventListener('focus', () => {
//     //     loginRequirements.style.display = 'block';
//     // });

//     // loginpassword.addEventListener('blur', () => {
//     //     loginRequirements.style.display = 'none';
//     // });

//     // loginpassword.addEventListener('input', () => {
//     //     const value = loginpassword.value;
//     //     const requirements = [
//     //         value.length >= 8,
//     //         /[A-Z]/.test(value),
//     //         /[a-z]/.test(value),
//     //         /[0-9]/.test(value),
//     //         /[^A-Za-z0-9]/.test(value)
//     //     ];
        
//     //     const listItems = loginRequirements.querySelectorAll('li');
//     //     listItems.forEach((item, index) => {
//     //         item.style.color = requirements[index] ? 'green' : 'red';
//     //     });
//     // });
  
// });


// googleBtn.addEventListener('click', () => {
//     signInWithPopup(auth, provider)
//         .then((result) => {
//             const user = result.user;
//             console.log(user)
//             localStorage.setItem('email', user.email);
//             localStorage.setItem('userStore', JSON.stringify(user));
//             localStorage.setItem('pic', user.photoURL);
//             loginContainer.style.display = 'none';
//             container.style.display = 'flex';
//             onGoogleLogin();
//         })
//         .catch((error) => {
//             console.error(error.code, error.message);
//         });
// });


// const signUpFunc =(e) =>{
//     e.preventDefault();
//     console.log('signup');
//     form.style.display = 'none'
//     signUpform.style.display = 'flex';
//     titleh2.textContent = 'Sign UP'
// }


// signupBtn.addEventListener('click',signUpFunc);

// const getUserDetails =(e)=>{
//     e.preventDefault();
//     console.log('submitsignup');
//     if(email.value === '' || firstname.value === ''){
//      alert('Fill up the form')   
//     }else{
//         form.style.display = 'flex'
//         signUpform.style.display = 'none';
//         titleh2.textContent = 'Log In';
//         console.log(firstname.value);
//         console.log(email.value);
//         console.log(signUpassword.value);
//         console.log(confirmpassword.value);   

//     }
//     if (confirmpassword.value !== signUpassword.value ){
//         alert('Passwords are not the same');
//         confirmpassword.value ='';
//         signUpassword.value = '';
//     } else {
//         form.style.display = 'flex'
//         signUpform.style.display = 'none';
//         titleh2.textContent = 'Log In';
//         console.log(firstname.value);
//         console.log(email.value);
//         console.log(signUpassword.value);
//         console.log(confirmpassword.value);   
//     }
// }
// signUpSubmit.addEventListener('click', getUserDetails);


// document.querySelector('#login').addEventListener('click', login);

// const addToCart = (e) => {
//     e.preventDefault();
//     const newPrice = prompt("Add price:", 'price');

//     let name;
//     const user = JSON.parse(localStorage.getItem('userStore'));

//     if (user && user.displayName) {
//         name = user.displayName;
//     } else {
//         const usernamestore = localStorage.getItem('username');
//         name = usernamestore;
//     }

//     const item = inputField.value;
//     const price = newPrice;
//     const d = new Date();
//     const date = d.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit'
//     });

//     if (name !== null && item.trim() !== '' && price!== null) {
//         push(ref(dataBase, "shoppingList"), { item, user: name, date,price, completed: false });
//         inputField.value = '';
//     }
// };
// inputForm.addEventListener('submit', addToCart);


// const logout = () => {
//         signOut(auth).then(() => {
//           localStorage.removeItem('email');
//           localStorage.removeItem('username');
//           localStorage.removeItem('userStore');
//           window.location.href = './index.html';
//         }).catch((error) => {
//           console.error('Sign out error', error);
//         });
//       };

// logoutBtn.addEventListener('click', logout);


// onValue(ref(dataBase, "shoppingList"), (snapshot) => {
//     if (snapshot.exists()) {
//         const items = snapshot.val();
//         shoppingItemList.innerHTML = '';
//         const table = document.createElement('table');
//         table.setAttribute('border', '1');
//         table.setAttribute('id', 'table');
//         shoppingItemList.appendChild(table);
//         const headerRow = document.createElement('tr');
//         headerRow.setAttribute('id', 'headerRow');
//         const headers = ['Item', 'User', 'Date', 'Price'];
//         headers.forEach(headerText => {
//             const th = document.createElement('th');
//             th.setAttribute('id', 'th');
//             th.textContent = headerText;
//             headerRow.appendChild(th);
//         });
//         table.appendChild(headerRow);

//         let totalPrice = 0;

//         Object.keys(items).forEach(key => {
//             const { item, user, date, price, completed } = items[key];
//             const row = document.createElement('tr');
//             row.setAttribute('id', 'row');
//             table.appendChild(row);

//             const itemTd = document.createElement('td');
//             itemTd.setAttribute('id', 'td');
//             itemTd.textContent = item;

//             const editIcon = document.createElement('img');
//             editIcon.setAttribute('id', 'editImg');
//             editIcon.setAttribute('src', './images/pencil.png');
//             editIcon.style.cursor = 'pointer';
//             editIcon.style.marginLeft = '10px';
//             itemTd.appendChild(editIcon);

//             const userTd = document.createElement('td');
//             userTd.setAttribute('id', 'td');
//             userTd.textContent = user;

//             const dateTd = document.createElement('td');
//             dateTd.setAttribute('id', 'td');
//             dateTd.textContent = date;

//             const priceTd = document.createElement('td');
//             priceTd.setAttribute('id', 'td');
//             priceTd.textContent = price;

//             row.appendChild(itemTd);
//             row.appendChild(userTd);
//             row.appendChild(dateTd);
//             row.appendChild(priceTd);

//             if (completed) {
//                 row.style.textDecoration = 'line-through';
//             }

//             row.addEventListener('click', () => {
//                 const exactLocation = ref(dataBase, `shoppingList/${key}`);
//                 update(exactLocation, { completed: !completed });
//             });

//             row.addEventListener('dblclick', () => {
//                 const exactLocation = ref(dataBase, `shoppingList/${key}`);
//                 remove(exactLocation);
//             });

//             editIcon.addEventListener('click', (e) => {
//                 e.stopPropagation();
                
//                 const newInput = prompt("Edit item:", item);
//                 if (newInput !== null && newInput.trim() !== "") {
//                     const exactLocation = ref(dataBase, `shoppingList/${key}`);
//                     update(exactLocation, { item: newInput });
//                 }
//             });

//             totalPrice += parseInt(price);
//             totalSpan.textContent = totalPrice;

//         });
        

//     } else {
//         shoppingItemList.innerHTML = 'No items here... add an item';
//     }
// });

// // Add event listener to dropbtn
// dropbtn.addEventListener('click', () => {
//     dropDownContent.style.display = dropDownContent.style.display === 'block' ? 'none' : 'block';
// })