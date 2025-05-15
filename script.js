const apiKey = '6618c185b6194c39be9e97d2544cc48c';  // Reemplaza con tu clave de API RAWG
const baseUrl = 'https://api.rawg.io/api/games';

// Función para obtener los videojuegos usando el proxy
function obtenerVideojuegos(pagina = 1, busqueda = '') {
    const url = `https://corsproxy.io/?${baseUrl}?key=${apiKey}&page=${pagina}&page_size=5&search=${busqueda}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No autorizado o error en la API.');
            }
            return response.json();
        })
        .then(data => {
            if (!data.results) {
                renderizarCards([]);
                alert('No se pudieron obtener los videojuegos. Verifica tu API key o el límite de uso.');
                return;
            }
            juegos = data.results;
            renderizarCards(juegos);
            actualizarPaginacion(data);
        })
        .catch(error => {
            console.error('Error al cargar los videojuegos:', error);
            renderizarCards([]);
            alert('Error al cargar los videojuegos: ' + error.message);
        });
}

// Función para mostrar las cards de los videojuegos
function renderizarCards(juegos) {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Limpiar el contenedor

    if (!Array.isArray(juegos) || juegos.length === 0) {
        container.innerHTML = '<p>No hay videojuegos para mostrar.</p>';
        return;
    }

    juegos.forEach(juego => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        card.innerHTML = `
            <img src="${juego.background_image}" alt="${juego.name}">
            <h3>${juego.name}</h3>
            <p>${juego.released ? 'Lanzado: ' + juego.released : 'Sin fecha de lanzamiento.'}</p>
            <button onclick="mostrarMasInfo(${juego.id})">Más Info</button>
        `;
        
        container.appendChild(card);
    });
}

// Función para mostrar más información sobre el juego
function mostrarMasInfo(id) {
    const apiKey = '6618c185b6194c39be9e97d2544cc48c'; // Reemplaza con tu clave de API
    const url = `https://api.rawg.io/api/games/${id}?key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Mostrar la información del juego en el modal
            document.getElementById('modal-title').textContent = data.name;
            document.getElementById('modal-image').src = data.background_image;
            document.getElementById('modal-description').textContent = data.description_raw || 'No disponible.';
            document.getElementById('modal-release-date').textContent = `Fecha de lanzamiento: ${data.released}`;
            document.getElementById('modal-developers').textContent = `Desarrollador(es): ${data.developers.map(dev => dev.name).join(', ')}`;

            // Mostrar el modal
            document.getElementById('game-modal').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar los detalles del juego:', error));
}

// Función para cerrar el modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('game-modal').style.display = 'none';
});

// Función para realizar la búsqueda de videojuegos
function buscarVideojuegos() {
    const busqueda = document.getElementById('search-input').value;
    obtenerVideojuegos(1, busqueda); // Volver a la primera página
}
function actualizarPaginacion(data) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    prevButton.disabled = data.page === 1;
    nextButton.disabled = data.page === data.pages;

    paginaActual = data.page;
}

// Función para cambiar de página
function cambiarPagina(incremento) {
    obtenerVideojuegos(paginaActual + incremento);
}

// Ejecutar la carga inicial de videojuegos
document.addEventListener('DOMContentLoaded', () => {
    obtenerVideojuegos();
});
