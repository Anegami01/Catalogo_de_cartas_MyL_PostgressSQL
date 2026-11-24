////////////////////////////// variables //////////////////////////////////////////////////////
const urlAPI = "http://localhost:3000/api/productos";
const contenedor = document.querySelector("#tablaProductos");
const producto_a_buscar = document.querySelector("#buscarNombre");
const mensaje = document.querySelector("#mensaje");
const filtro_tipo = document.querySelector("#filtroTipo");
const filtro_categoria = document.querySelector("#filtroCategoria");
const filtro_edicion = document.querySelector("#filtroEdicion");
const boton_limpiar = document.querySelector("#limpiarFiltros");
const paginacion = document.querySelector("#paginacion");

let lista_productos = [];          // Todas las cartas de la base de datos
let cartas_filtradas = [];         // Cartas que pasaron el filtro actual
let pagina_actual = 1;             // Página en la que nos encontramos
const cartas_por_pagina = 15;      // Cantidad fija de cartas a mostrar por página

///////////////////// Funcion de verificacion para el uso de la api /////////////////////////
async function cargar_lista() {
    try {
        const respuesta = await fetch(urlAPI);

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: Código ${respuesta.status}`);
        }

        const cartas = await respuesta.json();
        return cartas;
    } catch (e) {
        console.error("No se pudieron cargar los productos:", e);
        mensaje.textContent = "No fue posible cargar los datos. Revisa que el backend esté encendido.";
        return [];
    }
}

/////////////////// Llenar los filtros desplegables dinamicamente ///////////////////////
function poblar_filtros() {
    const tipos = [];
    const razas = [];
    const ediciones = [];

    lista_productos.forEach((p) => {
        if (p.tipo_carta && !tipos.includes(p.tipo_carta)) tipos.push(p.tipo_carta);
        if (p.categoria && !razas.includes(p.categoria)) razas.push(p.categoria);
        if (p.edicion && !ediciones.includes(p.edicion)) ediciones.push(p.edicion);
    });

    tipos.sort();
    razas.sort();
    ediciones.sort();

    filtro_tipo.innerHTML = '<option value="">Todos los tipos</option>';
    tipos.forEach(t => filtro_tipo.innerHTML += `<option value="${t}">${t}</option>`);

    filtro_categoria.innerHTML = '<option value="">Todas las razas</option>';
    razas.forEach(r => filtro_categoria.innerHTML += `<option value="${r}">${r}</option>`);

    filtro_edicion.innerHTML = '<option value="">Todas las ediciones</option>';
    ediciones.forEach(ed => filtro_edicion.innerHTML += `<option value="${ed}">${ed}</option>`);
}

//////////// 1. Funcion para cortar el arreglo en bloques de 15 cartas //////////////////////////////
function obtener_cartas_pagina(cartas, pagina) {
    const inicio = (pagina - 1) * cartas_por_pagina;
    const fin = inicio + cartas_por_pagina;
    return cartas.slice(inicio, fin);
}

//////////// 2. Funcion sencilla que dibuja los botones de Bootstrap //////////////////////////////
function render_paginacion(totalCartas) {
    const totalPaginas = Math.ceil(totalCartas / cartas_por_pagina);

    // Si solo hay 1 página o ninguna, no se muestran botones
    if (totalPaginas <= 1) {
        paginacion.innerHTML = "";
        return;
    }

    paginacion.innerHTML = `
        <li class="page-item ${pagina_actual === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="cambiar_pagina(${pagina_actual - 1})">Anterior</button>
        </li>
        <li class="page-item disabled">
            <span class="page-link text-dark fw-bold">Página ${pagina_actual} de ${totalPaginas}</span>
        </li>
        <li class="page-item ${pagina_actual === totalPaginas ? 'disabled' : ''}">
            <button class="page-link" onclick="cambiar_pagina(${pagina_actual + 1})">Próximo</button>
        </li>
    `;
}

//////////// 3. Funcion para cambiar de pagina al presionar los botones //////////////////////////////
window.cambiar_pagina = function(nuevaPagina) {
    pagina_actual = nuevaPagina;
    renderproducto(obtener_cartas_pagina(cartas_filtradas, pagina_actual));
    render_paginacion(cartas_filtradas.length);
    window.scrollTo({ top: 0, behavior: "smooth" });
};

//////////// funcion para inicializar la aplicacion //////////////////////////////
async function iniciar() {
    mensaje.textContent = "Cargando cartas desde PostgreSQL...";
    lista_productos = await cargar_lista();
    cartas_filtradas = lista_productos;
    pagina_actual = 1;

    if (lista_productos.length > 0) {
        poblar_filtros();
        renderproducto(obtener_cartas_pagina(cartas_filtradas, pagina_actual));
        render_paginacion(cartas_filtradas.length);
        mensaje.textContent = `Se encontraron ${lista_productos.length} cartas en la base de datos.`;
    }
}

/////////////////// Funcion encargada de convertir la info en objetos HTML ///////////////////////
function renderproducto(productosAMostrar) {
    let template = "";

    if (productosAMostrar.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="8">No se encontraron cartas coincidentes.</td></tr>';
        return;
    }

    productosAMostrar.forEach((producto) => {
        const urlImagen = producto.imagen_url || "";
        const matchId = urlImagen.match(/id=([a-zA-Z0-9_-]+)/);
        const fallbackUrl = matchId ? `https://lh3.googleusercontent.com/d/${matchId[1]}` : "";

        const celdaImagen = urlImagen
            ? `<a href="${urlImagen}" target="_blank" rel="noopener noreferrer">
                 <img src="${urlImagen}" alt="${producto.nombre}" class="carta-img" loading="lazy"
                      onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.removeAttribute('data-fallback');}"
                      data-fallback="${fallbackUrl}">
               </a>`
            : "Sin imagen";

        template += `
            <tr>
                <td><strong>#${producto.producto_id}</strong></td>
                <td>${celdaImagen}</td>
                <td>
                    <strong>${producto.nombre}</strong>
                    <span class="desc-sub">${producto.descripcion ?? ""}</span>
                </td>
                <td><span class="badge-tipo">${producto.tipo_carta ?? "Aliado"}</span></td>
                <td><span class="badge-raza">${producto.categoria}</span></td>
                <td><span class="badge-stat stat-ataque">⚔️ ${producto.ataque ?? 0}</span></td>
                <td><span class="badge-stat stat-costo">🪙 ${producto.costo ?? 0}</span></td>
                <td>${producto.edicion ?? "Primer Bloque"}</td>
            </tr>
        `;
    });

    contenedor.innerHTML = template;
}

////////// Funcion para filtrar las cartas y reiniciar a la pagina 1 ///////////////////
function aplicar_filtros() {
    const textoBusqueda = producto_a_buscar.value.toLowerCase().trim();
    const tipoSeleccionado = filtro_tipo.value;
    const razaSeleccionada = filtro_categoria.value;
    const edicionSeleccionada = filtro_edicion.value;

    const productosFiltrados = lista_productos.filter((producto) => {
        const coincideTexto = producto.nombre.toLowerCase().includes(textoBusqueda) ||
                              (producto.descripcion && producto.descripcion.toLowerCase().includes(textoBusqueda));
        const coincideTipo = tipoSeleccionado === "" || producto.tipo_carta === tipoSeleccionado;
        const coincideRaza = razaSeleccionada === "" || producto.categoria === razaSeleccionada;
        const coincideEdicion = edicionSeleccionada === "" || producto.edicion === edicionSeleccionada;

        return coincideTexto && coincideTipo && coincideRaza && coincideEdicion;
    });

    cartas_filtradas = productosFiltrados;
    pagina_actual = 1;

    renderproducto(obtener_cartas_pagina(cartas_filtradas, pagina_actual));
    render_paginacion(cartas_filtradas.length);
    mensaje.textContent = `Resultados: ${cartas_filtradas.length} cartas encontradas.`;
}

// Escuchadores de eventos para filtrar en tiempo real
producto_a_buscar.addEventListener("input", aplicar_filtros);
filtro_tipo.addEventListener("change", aplicar_filtros);
filtro_categoria.addEventListener("change", aplicar_filtros);
filtro_edicion.addEventListener("change", aplicar_filtros);

// Boton para limpiar todos los filtros de una sola vez
boton_limpiar.addEventListener("click", () => {
    producto_a_buscar.value = "";
    filtro_tipo.value = "";
    filtro_categoria.value = "";
    filtro_edicion.value = "";
    
    cartas_filtradas = lista_productos;
    pagina_actual = 1;
    renderproducto(obtener_cartas_pagina(cartas_filtradas, pagina_actual));
    render_paginacion(cartas_filtradas.length);
    mensaje.textContent = `Se muestran ${lista_productos.length} cartas.`;
});

// Arranque automatico al cargar la pagina
iniciar();