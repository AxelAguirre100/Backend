const hrefHome = document.getElementById('Back')
hrefHome.href = `${url}/handlebars`;

const hrefNavLogin = document.getElementById('IniciarSesion')
hrefNavLogin.href = `${url}/handlebars/login`;

const hrefNavRegister = document.getElementById('Registro')
hrefNavRegister.href = `${url}/handlebars/register`;

const hrefNavProducts = document.getElementById('Productos')
hrefNavProducts.href = `${url}/handlebars/products`;

const hrefNavCart = document.getElementById('Carrito')
hrefNavCart.href = `${url}/handlebars/cart`;


const cerrarSesion = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      });
  
      if (response.ok) {
        const message = await response.text();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${message}`,
            showConfirmButton: false,
            timer: 1500
        })
      } else {
        const errorMessage = await response.text();
        return Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error: ${errorMessage}`,
            showConfirmButton: false,
            timer: 1500
        })
      }
    } catch (error) {
        return Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error: ${error}`,
            showConfirmButton: false,
            timer: 1500
        })
    }
  };

const hrefProfile = document.getElementById('CerrarSesion')

hrefProfile.addEventListener('click', cerrarSesion)