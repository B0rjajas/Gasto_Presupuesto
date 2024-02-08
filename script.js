// Trabajamos CON CLASES

// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
formulario.addEventListener('submit', agregarGasto);

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, resto) => total + resto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    };

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class MostrarPresupuesto {
    // Métodos dentro de la clase
    insertarPresupuesto(cantidad) {
        // Extraer los valores;
        const { presupuesto, restante } = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de ERROR
        divMensaje.textContent = mensaje;

        // Insertar en HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    agregarGastoListado(gastos) {
        this.limpiarHTML(); // Elimina el HTML previo

        // Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.setAttribute('data-id', id);

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-success badge-pill">${cantidad}</span>`;

            // Boton del gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id); // Llamar a la función eliminarGasto con el ID del gasto
            };
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    };

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    };

    comprobarPresupuesto(presupuestoOBJ) {
        const { presupuesto, restante } = presupuestoOBJ;
        const restanteDiv = document.querySelector('#restante');

        // Comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor
        if (restante <= 0) {
            this.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// Instancia GLOBAL
const ui = new MostrarPresupuesto();

// Variable para parámetro del constructor
let presupuesto;

// Funciones

function preguntarPresupuesto() {
    const preguntarUsuario = prompt('¿Cuál es tu presupuesto?');
    console.log(preguntarUsuario);

    const respuestaVacia = preguntarUsuario === '';
    const respuestaCancel = preguntarUsuario === null;
    if (respuestaVacia || respuestaCancel || isNaN(preguntarUsuario) || preguntarUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(preguntarUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

// Agregar mensaje de validación

function agregarGasto(e) {
    e.preventDefault(); // Prevenir acción por default

    // Lee datos del input
    const nombre = document.querySelector('#gasto').value; // Forma directa de acceder al input
    const cantidad = Number(document.querySelector('#cantidad').value); // Forma directa de acceder al input

    const nombreVacio = nombre === '';
    const cantidadVacia = cantidad;

    if (nombreVacio && cantidadVacia) {
        ui.imprimirAlerta('Estan vacios');
        return;
    } else if (isNaN(cantidadVacia) || cantidadVacia <= 0) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);
    console.log(gasto);

    // Imprimir mensaje
    ui.imprimirAlerta('Gasto agregado correctamente');

    // Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    // Reiniciar el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);

    // Eliminar los gastos HTML
    const { gastos, restante } = presupuesto;
    ui.limpiarHTML(); // Limpiar la lista de gastos antes de volver a agregarlos
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
