const renderizarProductos = async () => {
    try {
        const response = await fetch(`${url}/api/products`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }

        const jsonParsedResponse = await response.json();
        const products = jsonParsedResponse.payload;
        const productContainer = document.getElementById('product-list');
        console.log(products)
        products.forEach((product) => {
            const card = document.createElement('div');
            card.classList.add('col-md-3', 'mb-3');

            let imageUrl = '';

            if (product.thumbnails.length > 0 && product.thumbnails[0].length > 0) {
                imageUrl = product.thumbnails[0];
            } else {
                imageUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDg0NDQ0NDQ0NDQ0NDQ0NDQ8NDQ0NFREWFhURFhUYHSggGCYxGxUVITIhJSkrLi4uFyszODMsNy0tLjABCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIALcBFAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQQFBgMCB//EADcQAQABAwAECwgBBAMAAAAAAAABAgMRBRRTcgQSITEyM1FxkZKxBhUiQVJhotETYnOB8SNCQ//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9ByZADJkADIAAAAAZMgBkyAGTIAZMgBkyAGTIAZMgBkyAGTIAZMgBkyAGTIAmJSiAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmAgBAAAAAAAIBIAAAAAAAAAAAAAAAAAAAAAAAAAJgIAQAAAACASAAAA9LVi5Xy0UVVR2xEzDzdbZoimmmmOSIiIgHM6le2VflNSvbKvyuoyZBy+pXtlX5TUr2yr8rqMmYBy+pXtlX4GpXtlX5XUZMg5fUr2yr8pqV7ZV+V1GTIOX1K9sq/Kale2VfldRkzAOXngd7ZV+WXg69hadtRTXTVEYmumc/eY+YM0AAAAAAAAAEwEAIAAAAAAAAAAdfTzR3OQdfTzR3QDmNIddd35V1jSHXXd+V/QXB4njXZjMxPFp+3JyyDP1G9jP8VeO7l8Od4OwZGneDRiLsRic8Wr79kgxgAAa1vRObMzPWz8VMdn9IMkJjxAdDoTqY3qvVT9oOlb3avWFzQnUxvVeqn7QdK3u1esAygAAAAAAAAATAQAgAAAAAAAAAB19PNHdDkHX080dwOY0h113flc0LwumjNuqcRVOaZnmz2KekOuu78qwOxYumuF01YtUznE5qmObPYy/5KsY41WOzM4fMRnERyzPJER85B9W7c11RTTGapnEQvcN0ZVapiuJ40RHx/ae2Ps0tGcB/ip41XWVRy/0x2QugxdDcBzi7XHJHQifnP1NtERjkjkiOaI5ohIMPTfBOLP8ALTHJVyVx2VdrLddcoiqJpqjMTGJhy/C+Dzarmifly0z20/KQbehOpjeq9VP2g6Vvdq9YXNCdTG9V6qftB0re7V6wDKAAAAAAAAABMBACAAAAAAAAAAHX080d0OQdfTzR3A5jSHXXd+XnYs1XKoop55n/ABEdr00h113flsaI4H/HTx6o+OuPLT2Az9I6Nm18VGaqPnnnpn7rmiOAcXF2uPinoxP/AFjt72oAAAAAKOluDRctzVzVW4mqJ+3zheePDOqu/wBuv0BW0J1Mb1Xqp+0HSt7tXrC5oTqY3qvVT9oOlb3avWAZQAAAAAAAAAJgIAQAAAAAAAAAA6+nmjucg6zg9yK6KaqZzExH+gYF25bp4TXVczNNNczxYxyz8s5X/fln6a/x/bUQDM9+Wfpr/H9nvyz9Nf4/tp4MAzPfln6a/wAf2e/LP01/j+2mAzPfln6a/wAf2e/LP01/j+2ngwDM9+Wfpr/H9vO/pm1VRXTEVZqpqpjPFxyx3tfBgFDQk/8ADG9V6qntB0re7V6w2mFp27FVdNMTmaYnP2mfkDNAAAAAAAAABMBACAAAAAQCUJAAAHpav10dCuqnul5gLGvXtrX4mvXtrX4q4Cxr17a1+Jr17a1+KuAsa9e2tfia9e2tfirgLGvXtrX4mvXtrX4q4Cxr17a1+Jr17a1+KuA954ben/1r8XgAAAAAAAAAAAJgIAQAAAAhIAAAAAAAAAAAAAAAAAAAAAAAAAAAACYCAEAAAAISAISAAAISAAAAAAAAAAAAAAAAAAAAAAAmAgBAAAAAACEgAAAAAAAAAAAAAAAAAAAAAAAAAAJgAH//2Q=="'; // Imagen por defecto
            }

            const cardContent = `
              <div class="card">
                <img src="${imageUrl}" class="card-img-top" alt="">
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">Stock: ${product.stock}</p>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text">Precio: ${product.price}</p>
                  <button class="btn btn-primary add-to-cart" id="btn${product._id}">Añadir al carrito</button>
                </div>
              </div>
            `;

            card.innerHTML = cardContent;
            productContainer.appendChild(card);

            document.getElementById(`btn${product._id}`).addEventListener('click', async (e) => {
                e.preventDefault();

                const addToCartResponse = await fetch(`${url}/api/cart/product/${product._id}`, {
                    method: 'POST'
                });

                const addToCartJsonParsedResponse = await addToCartResponse.json();

                if (!addToCartResponse.ok) {
                    if (addToCartResponse.status === 401) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: `Error: ${addToCartJsonParsedResponse.error}`
                        }).then(() => {
                            window.location.href = `${url}/handlebars/login`;
                        });
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: `Error: ${addToCartJsonParsedResponse.error}`
                        });
                    }
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `${addToCartJsonParsedResponse.message}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        });
    } catch (error) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error: ${error}`,
            showConfirmButton: false,
            timer: 1500
        })
    }
}

renderizarProductos();