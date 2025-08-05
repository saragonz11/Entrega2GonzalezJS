// Variables globales
let usuario = "";
let mesActual = "";
let gastos = [];
let categorias = [
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Vivienda",
  "Servicios",
  "Ropa",
  "Otros",
];

// Elementos del DOM
const configForm = document.getElementById("configForm");
const nombreUsuario = document.getElementById("nombreUsuario");
const mesSeleccionado = document.getElementById("mesSeleccionado");
const formGastos = document.getElementById("formGastos");
const gastoForm = document.getElementById("gastoForm");
const infoUsuario = document.getElementById("infoUsuario");
const saludoUsuario = document.getElementById("saludoUsuario");
const mesActualElement = document.getElementById("mesActual");
const resumenGastos = document.getElementById("resumenGastos");
const totalGastos = document.getElementById("totalGastos");
const cantidadGastos = document.getElementById("cantidadGastos");
const promedioGastos = document.getElementById("promedioGastos");
const listaGastos = document.getElementById("listaGastos");
const gastosContainer = document.getElementById("gastosContainer");
const graficoCategorias = document.getElementById("graficoCategorias");
const categoriasContainer = document.getElementById("categoriasContainer");
const btnLimpiarGastos = document.getElementById("btnLimpiarGastos");
const btnVolverConfig = document.getElementById("btnVolverConfig");
const descripcionGasto = document.getElementById("descripcionGasto");
const montoGasto = document.getElementById("montoGasto");
const categoriaGasto = document.getElementById("categoriaGasto");

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  inicializarAplicacion();
  configurarEventListeners();
});

// Función de inicialización
function inicializarAplicacion() {
  // Llenar el selector de meses
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  meses.forEach((mes, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = mes;
    mesSeleccionado.appendChild(option);
  });

  // Llenar el selector de categorías
  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    categoriaGasto.appendChild(option);
  });

  // Cargar datos guardados
  cargarDatosGuardados();
}

// Configurar event listeners
function configurarEventListeners() {
  // Formulario de configuración
  configForm.addEventListener("submit", function (e) {
    e.preventDefault();
    iniciarSimulador();
  });

  // Formulario de gastos
  gastoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    agregarGasto();
  });

  // Botón limpiar gastos
  btnLimpiarGastos.addEventListener("click", limpiarGastos);

  // Botón volver a configuración
  btnVolverConfig.addEventListener("click", volverAConfiguracion);
}

// Función para iniciar el simulador
function iniciarSimulador() {
  usuario = nombreUsuario.value.trim();
  mesActual = parseInt(mesSeleccionado.value);

  if (!usuario || mesActual === "") {
    mostrarNotificacion("Por favor, completa todos los campos", "warning");
    return;
  }

  // Ocultar formulario de configuración
  configForm.parentElement.parentElement.parentElement.style.display = "none";

  // Mostrar información del usuario
  mostrarInformacionUsuario();

  // Mostrar formulario de gastos
  formGastos.style.display = "block";

  // Mostrar paneles de resultados
  infoUsuario.style.display = "block";
  resumenGastos.style.display = "block";
  listaGastos.style.display = "block";
  graficoCategorias.style.display = "block";

  // Guardar datos
  guardarDatos();

  mostrarNotificacion(
    `¡Bienvenido ${usuario}! Simulador iniciado para ${obtenerNombreMes(
      mesActual
    )}`,
    "success"
  );
}

// Función para mostrar información del usuario
function mostrarInformacionUsuario() {
  saludoUsuario.textContent = `¡Hola, ${usuario}!`;
  mesActualElement.textContent = `Mes: ${obtenerNombreMes(mesActual)}`;
}

// Función para agregar gasto
function agregarGasto() {
  const descripcion = descripcionGasto.value.trim();
  const monto = parseFloat(montoGasto.value);
  const categoria = categoriaGasto.value;

  if (!descripcion || !monto || !categoria) {
    mostrarNotificacion(
      "Por favor, completa todos los campos del gasto",
      "warning"
    );
    return;
  }

  if (monto <= 0) {
    mostrarNotificacion("El monto debe ser mayor a 0", "warning");
    return;
  }

  const nuevoGasto = {
    id: Date.now(),
    descripcion: descripcion,
    monto: monto,
    categoria: categoria,
    fecha: new Date().toLocaleDateString(),
  };

  gastos.push(nuevoGasto);

  // Limpiar formulario
  gastoForm.reset();

  // Actualizar interfaz
  actualizarResumen();
  mostrarGastos();
  mostrarCategorias();

  // Guardar datos
  guardarDatos();

  mostrarNotificacion("Gasto agregado exitosamente", "success");
}

// Función para actualizar resumen
function actualizarResumen() {
  const total = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  const cantidad = gastos.length;
  const promedio = cantidad > 0 ? total / cantidad : 0;

  totalGastos.textContent = `$${total.toFixed(2)}`;
  cantidadGastos.textContent = cantidad;
  promedioGastos.textContent = `$${promedio.toFixed(2)}`;
}

// Función para mostrar gastos
function mostrarGastos() {
  gastosContainer.innerHTML = "";

  if (gastos.length === 0) {
    gastosContainer.innerHTML =
      '<p class="text-muted text-center">No hay gastos registrados</p>';
    return;
  }

  gastos.forEach((gasto) => {
    const gastoElement = document.createElement("div");
    gastoElement.className =
      "gasto-item d-flex justify-content-between align-items-center";
    gastoElement.innerHTML = `
            <div>
                <strong>${gasto.descripcion}</strong>
                <br>
                <small class="text-muted">${gasto.categoria} • ${
      gasto.fecha
    }</small>
            </div>
            <div class="d-flex align-items-center">
                                                                <span class="badge me-2" style="background-color: #2C4A52; color: white;">$${gasto.monto.toFixed(
                                                                  2
                                                                )}</span>
                <button class="btn btn-outline-secondary btn-sm" onclick="eliminarGasto(${
                  gasto.id
                })" style="border-color: #8E9B97; color: #8E9B97;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    gastosContainer.appendChild(gastoElement);
  });
}

// Función para mostrar categorías
function mostrarCategorias() {
  categoriasContainer.innerHTML = "";

  const gastosPorCategoria = {};
  categorias.forEach((categoria) => {
    gastosPorCategoria[categoria] = 0;
  });

  gastos.forEach((gasto) => {
    gastosPorCategoria[gasto.categoria] += gasto.monto;
  });

  const total = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);

  categorias.forEach((categoria) => {
    const monto = gastosPorCategoria[categoria];
    if (monto > 0) {
      const porcentaje = total > 0 ? ((monto / total) * 100).toFixed(1) : 0;
      const categoriaElement = document.createElement("div");
      categoriaElement.className = "categoria-item";
      categoriaElement.innerHTML = `
                <div>
                    <strong>${categoria}</strong>
                    <br>
                    <small>$${monto.toFixed(2)} (${porcentaje}%)</small>
                </div>
                <div class="progress" style="width: 100px; height: 8px;">
                    <div class="progress-bar bg-light" style="width: ${porcentaje}%"></div>
                </div>
            `;
      categoriasContainer.appendChild(categoriaElement);
    }
  });
}

// Función para eliminar gasto
function eliminarGasto(id) {
  gastos = gastos.filter((gasto) => gasto.id !== id);
  actualizarResumen();
  mostrarGastos();
  mostrarCategorias();
  guardarDatos();
  mostrarNotificacion("Gasto eliminado", "info");
}

// Función para limpiar gastos
function limpiarGastos() {
  if (gastos.length === 0) {
    mostrarNotificacion("No hay gastos para limpiar", "info");
    return;
  }

  if (confirm("¿Estás seguro de que quieres eliminar todos los gastos?")) {
    gastos = [];
    actualizarResumen();
    mostrarGastos();
    mostrarCategorias();
    guardarDatos();
    mostrarNotificacion("Todos los gastos han sido eliminados", "success");
  }
}

// Función para volver a la configuración
function volverAConfiguracion() {
  // Mostrar formulario de configuración
  configForm.parentElement.parentElement.parentElement.style.display = "block";

  // Ocultar todos los paneles del simulador
  formGastos.style.display = "none";
  infoUsuario.style.display = "none";
  resumenGastos.style.display = "none";
  listaGastos.style.display = "none";
  graficoCategorias.style.display = "none";

  // Limpiar gastos al volver
  gastos = [];
  actualizarResumen();
  mostrarGastos();
  mostrarCategorias();

  // Limpiar localStorage
  localStorage.removeItem("simuladorGastos");

  mostrarNotificacion("Volviendo a la configuración inicial", "info");
}

// Función para obtener nombre del mes
function obtenerNombreMes(index) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[index];
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
  const notificaciones = document.getElementById("notificaciones");
  const toast = document.createElement("div");

  // Mapear tipos a colores de la paleta Grises Difusos
  const colores = {
    success: "#537072", // waterway
    warning: "#8E9B97", // haze
    info: "#2C4A52", // blue-green
    error: "#537072", // waterway para errores
  };

  toast.className = `toast align-items-center text-white border-0`;
  toast.style.backgroundColor = colores[tipo] || colores["info"];
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensaje}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

  notificaciones.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  // Remover el toast después de que se oculte
  toast.addEventListener("hidden.bs.toast", function () {
    notificaciones.removeChild(toast);
  });
}

// Función para guardar datos en localStorage
function guardarDatos() {
  const datos = {
    usuario: usuario,
    mesActual: mesActual,
    gastos: gastos,
  };
  localStorage.setItem("simuladorGastos", JSON.stringify(datos));
}

// Función para cargar datos del localStorage
function cargarDatosGuardados() {
  const datosGuardados = localStorage.getItem("simuladorGastos");
  if (datosGuardados) {
    const datos = JSON.parse(datosGuardados);
    usuario = datos.usuario || "";
    mesActual = datos.mesActual || "";
    gastos = datos.gastos || [];

    if (usuario && mesActual !== "") {
      // Restaurar interfaz
      nombreUsuario.value = usuario;
      mesSeleccionado.value = mesActual;

      configForm.parentElement.parentElement.parentElement.style.display =
        "none";
      formGastos.style.display = "block";
      infoUsuario.style.display = "block";
      resumenGastos.style.display = "block";
      listaGastos.style.display = "block";
      graficoCategorias.style.display = "block";

      mostrarInformacionUsuario();
      actualizarResumen();
      mostrarGastos();
      mostrarCategorias();
    }
  }
}
