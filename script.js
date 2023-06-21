//Calculadora de rendimiento CDI (Brasil) para Montos de Inversión ingresado por el usuario, mostrando en ciclo otros rendimientos dado ese monto incrementado cada 10.000 con tope 30.000

//Usuario ingresa el monto de inversión, validando que éste sea un número. En caso no lo sea, le doy oportunidad infinita hasta que ingrese un número
let montoInversion = prompt("Ingrese el monto que desea invertir")
let montoInversionNumerico = parseFloat(montoInversion)
while (isNaN(montoInversionNumerico)) {
  montoInversion = prompt("El valor ingresado no es un número válido. Ingrese nuevamente el monto:")
  montoInversionNumerico = parseFloat(montoInversion);
}

//Defino a las opciones de inversión, para que el usuario escoja cuál desea ver y conozca su CDI
let opcionesInversion = [
  {
    title: 'recargapay',
    porcentajeCDI: 1.02,
    id: 1010
  },
  {
    title: 'picpay',
    porcentajeCDI: 1.00,
    id: 1020
  },
  {
    title: 'mercado pago',
    porcentajeCDI: 1.00,
    id: 1030
  }
]

// Muestro las opciones de inversión ordenadas por porcentajeCDI
let listado = ""
opcionesInversion.sort((a, b) => b.porcentajeCDI - a.porcentajeCDI)
opcionesInversion.forEach(opcionInversion => {
listado += opcionInversion.title + " " + opcionInversion.porcentajeCDI + "\n"
})
alert ("Las oferentes y sus multiplicadores son: " + "\n" + listado)

// Pido al usuario elija entras las opciones de inversión
let inversionDeseada = prompt("Ingrese opción de inversión que desea \n * recargapay \n * picpay \n * mercado pago \n y conoce el multiplicador de tu rendimiento ")
let inversionElegida = opcionesInversion.find(opcionInversion => opcionInversion.title.toLowerCase() === inversionDeseada.toLowerCase())

if (inversionElegida) {
  alert("El multiplicador CDI de la opción elegida es: " + inversionElegida.porcentajeCDI)

//Defino parámetros generales y funciones para el cálculo de la rentabilidad
let taxaCDI = 0.1365
let diasUtilesAnio = 252
let monto = montoInversionNumerico
let incremento = 10000
let capitalConFactor, capitalConIntereses

function rendimientoDiario(monto, factorDiario) {
  let valor = monto * factorDiario
  return valor
}

//Calculo la rentabilidad dada la elección del usuario y presento en ciclo opciones hasta 30.000 R$, de a cada R$ 10.000
for (let monto = montoInversionNumerico; monto <= 30000; monto += incremento) {
  let factorDiario = parseFloat((((1 + taxaCDI) ** (1 / diasUtilesAnio)) - 1) * inversionElegida.porcentajeCDI)
  capitalConFactor = rendimientoDiario(monto, factorDiario)
  capitalConIntereses = capitalConFactor + monto
  alert ("Para un monto de " + monto.toFixed(2) + " R$" + "\n" + "El rendimiento diario es " + capitalConFactor.toFixed(2) + " R$" + "\n" + "Su capital más intereses será " + capitalConIntereses.toFixed(2) + " R$")
}

} else {
  alert("La opción de inversión ingresada no es válida. Refresque la pantalla y vuelva a comenzar por favor")
}




