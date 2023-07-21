import { url } from "./config.js";

const hrefRegister = document.getElementById('hrefRegister')
hrefRegister.href = `${url}/handlebars/register`;

const loginForm = document.getElementById("loginFormId");

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let responseMessage = '';
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const credentials = { email, password };
        const response = await fetch(`${url}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        const responseBody = await response.json();
        responseMessage = responseBody.message;
        if (response.ok) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${responseMessage}`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = `${url}/handlebars/products`;
            });
        } else {
            return Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `Error: ${responseMessage}`,
                showConfirmButton: false,
                timer: 1500
            })
        }
    } catch (error) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error: ${error}`,
            showConfirmButton: false,
            timer: 1500
        })
    }
});