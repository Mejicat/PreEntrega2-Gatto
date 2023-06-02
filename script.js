//Calculadora de rendimiento CDI (Brasil) para Montos de Inversión de 1.000 en 1.000 (ciclo) con tope 10.000
let taxaCDI = 0.1365
let diasUtilesAnio = 252
let porcentajeCDI = 1.02
let monto = 1000

function rendimientoDiario(monto, factorDiario) {
  let valor = monto * factorDiario
  return valor
}

if (isNaN(monto)) {
  alert("Refresca la página y escribe un número")
} else {
  let montoInicial = 1000
  let incremento = 1000
  let numero1, numero2

  for (let monto = montoInicial; monto <= 10000; monto += incremento) {
    let factorDiario = parseFloat((((1 + taxaCDI) ** (1 / diasUtilesAnio)) - 1) * porcentajeCDI)
    numero1 = rendimientoDiario(monto, factorDiario)
    numero2 = numero1 + monto
    console.log("Para un monto de " + monto + "R$")
    console.log("El rendimiento diario es " + numero1 + "R$")
    console.log("Su capital más intereses será" + numero2 + "R$")
  }
}