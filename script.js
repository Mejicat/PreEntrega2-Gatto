//Defino a las opciones de inversión, para que el usuario escoja cuál desea ver y conozca su CDI
const opcionesInversion = [
  {
    title: 'Recargapay',
    porcentajeCDI: 1.02,
    rutaImagen: "Recargapay.png",
    id: 1010
  },
  {
    title: 'Picpay',
    porcentajeCDI: 1.00,
    rutaImagen: "Picpay.png",
    id: 1020
  },
  {
    title: 'Mercado pago',
    porcentajeCDI: 1.00,
    rutaImagen: "Mercadopago.png",
    id: 1030
  }
]

const contenedor = document.getElementById("oferentes") // Contenedor donde se mostrarán las opciones de Inversión

// Variables para almacenar la opción de inversión elegida y su status
let oferenteSeleccionado = null
let oferenteSeleccionadoFlag = false

let consulta = { resultados: [] } // Almaceno los resultados de la consulta

crearTarjetas(opcionesInversion)

function crearTarjetas(opciones) { // Creo las tarjetas con las opciones de inversión
  contenedor.innerHTML = "" // Limpio el contenido del contenedor
  opciones.forEach(opcion => {
    const opcionInversion = document.createElement("div")
    opcionInversion.className = "tarjetaOpcionInversion"
    opcionInversion.innerHTML = `
      <h4>${opcion.title}</h4>
      <img class="imagen" src="multimedia/${opcion.rutaImagen}">
      <h4>Multiplicador CDI: ${opcion.porcentajeCDI}</h4>
      <button id="${opcion.id}" class="botones">Calculá tu rendimiento</button>
    `
    contenedor.appendChild(opcionInversion) // Agrego la tarjeta al contenedor
    const botonCalculaTuRendimiento = document.getElementById(opcion.id)
    botonCalculaTuRendimiento.addEventListener("click", () => {
      oferenteSeleccionado = opcion
      oferenteSeleccionadoFlag = true
      mostrarFormulario()
    })
  })
}

const buscador = document.getElementById("buscador") // Obtengo el elemento del buscador
buscador.addEventListener("input", filtrar)

function filtrar() { // Filtro según el texto buscado (por nombre o %CDI), normalizando los caracteres
  const textoBuscado = buscador.value.toLowerCase()
  const arrayFiltrado = opcionesInversion.filter(opcion =>
    opcion.title.toLowerCase().includes(textoBuscado) || opcion.porcentajeCDI.toString().includes(textoBuscado)
  )
  crearTarjetas(arrayFiltrado)
}

function mostrarFormulario() { // Función para generar el input donde el usuario colocará el monto a invertir
  contenedor.innerHTML = "" // Limpio el contenido
  const formulario = document.createElement("div")
  formulario.innerHTML = `
    <h3>Ingrese el monto de inversión:</h3>
    <input type="number" id="montoInversion">
    <button id="btnInvertir">Invertir</button>
  `
  contenedor.appendChild(formulario)
  const btnInvertir = document.getElementById("btnInvertir")
  btnInvertir.classList.add("botones") // Agrego la clase "botones" para darle estilos en el CSS
  btnInvertir.addEventListener("click", invertir)
}

function invertir() {
  const montoInversion = parseFloat(document.getElementById("montoInversion").value) // Convierto a número el monto ingresado
  if (oferenteSeleccionadoFlag) {
    if (!isNaN(montoInversion) && montoInversion > 0) { // Verifico que es un número y mayor que 0
      
      const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1"
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const taxaCDI = data[0].valor
      
      const diasUtilesAnio = 252
      const incremento = 10000
      let capitalConFactor, capitalConIntereses

      function rendimientoDiario(monto, factorDiario) {
        return monto * factorDiario
      }

      const resultadoRentabilidad = document.getElementById("resultadoRentabilidad")
      resultadoRentabilidad.innerHTML = ""

      const listaResultados = document.createElement("ol") // Creo una lista para guardar los resultados
      const consulta = {
        montoInversion,
        resultados: []
      }

      for (let monto = montoInversion; monto <= 30000; monto += incremento) { // Realizo el cálculo para diferentes montos de inversión, de a 10.000 con tope 30.000
        const factorDiario = (((1 + taxaCDI) ** (1 / diasUtilesAnio)) - 1) * oferenteSeleccionado.porcentajeCDI
        capitalConFactor = rendimientoDiario(monto, factorDiario)
        capitalConIntereses = capitalConFactor + monto

        const resultado = document.createElement("li")
        resultado.innerHTML = `<strong>Para un monto de ${monto.toFixed(2)} R$:</strong>
          <ul>
            <li>El rendimiento diario es ${capitalConFactor.toFixed(2)} R$</li>
            <li>Su capital más intereses será ${capitalConIntereses.toFixed(2)} R$</li>
          </ul>`

        listaResultados.appendChild(resultado)

        consulta.resultados.push({ // Agrego el resultado a la consulta actual
          montoInversion: monto,
          rendimientoDiario: capitalConFactor,
          capitalConIntereses
        })
      }

      localStorage.setItem("consulta", JSON.stringify(consulta)) // Guardo la consulta en el Local Storage
      resultadoRentabilidad.appendChild(listaResultados)
      mostrarBotonGuardar()
    })

    .catch(error => {
    console.error("Error al obtener la tasa CDI:", error)
    })
    }
  } else { // Este ELSE quedó vacío porque antes agregué un Alert si el usuario ingreso un valor no numérico, pero ya subí validaciones para ello
  }
}

function mostrarBotonGuardar() { // Genero y muestro el botón de Guardar resultado
  const resultadoRentabilidad = document.getElementById("resultadoRentabilidad")
  const botonGuardar = document.createElement("button")
  botonGuardar.textContent = "Guardar resultado"
  botonGuardar.classList.add("botones") // Agrego la clase "botones" para darle estilos en el CSS
  botonGuardar.addEventListener("click", guardarYMostrarAlerta)
  resultadoRentabilidad.appendChild(botonGuardar)
}

function guardarYMostrarAlerta() {
  guardarResultado()
  mostrarAlerta()
}

function guardarResultado() {
  let consultaGuardada = localStorage.getItem("consulta") // Obtengo la consulta guardada en el local storage

  if (consultaGuardada) {
    consultaGuardada = JSON.parse(consultaGuardada)
    consultaGuardada.resultados.push(...consulta.resultados) // Agrego los resultados de la consulta actual a los resultados guardados
  } else {
    consultaGuardada = consulta // Si no hay una consulta guardada, la asigno como la consulta actual
  }

  localStorage.setItem("consulta", JSON.stringify(consultaGuardada)) // Guardo la consulta actualizada en el Local Storage
}

function mostrarAlerta() { // Usando SweatAlert muestro un mensaje de Guardado exitoso
  Swal.fire({ // Lanza alerta pasando todas sus propiedades
    title: 'Hecho!',
    text: 'Hemos guardado tu consulta',
    icon: 'success',
    customClass: {
      confirmButton: 'swal-button--confirm'
    },
    timer: 2000
  })
}



