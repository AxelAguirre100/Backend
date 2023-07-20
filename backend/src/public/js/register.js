const url = "http://localhost:4000"

const hrefLogin = document.getElementById('hrefLogin')
hrefLogin.href = `${url}/handlebars/login`;


const registerForm = document.getElementById("registerFormId");
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const first_name = document.getElementById("first_name").value;
        const last_name = document.getElementById("last_name").value;
        const age = document.getElementById("birth_date").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const cliente = { first_name, last_name, age, email, password,rol:"Usuario" };
        const response = await fetch(`${url}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        const responseBody = await response.json();
        const responseMessage = responseBody.message;
        if (!response.ok) {
            return Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `Error: ${responseMessage}`,
                showConfirmButton: false,
                timer: 1500
            })     
              
        }
        if (responseBody) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: responseMessage,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = `${url}/handlebars/login`;
            });
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