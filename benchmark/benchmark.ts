// Parte 1: Estructura de los datos de medición
interface ResultadoMedicion {
    url: string;
    tiempoPromedioMs: number;
    tiempoMinimoMs: number;
    tiempoMaximoMs: number;
    exitosas: number;
    fallidas: number;
}

// Parte 2 y 3: Medir una sola URL múltiples veces y calcular estadísticas
async function medirUrl(url: string, cantidad: number): Promise<ResultadoMedicion> {
    const tiempos: number[] = [];
    let exitosas = 0, fallidas = 0;

    for (let i = 0; i < cantidad; i++) {
        const inicio = performance.now();
        try {
            const respuesta = await fetch(url);
            await respuesta.text();
            if (respuesta.ok) exitosas++; else fallidas++;
        } catch { 
            fallidas++; 
        }
        tiempos.push(performance.now() - inicio);
    }

    return {
        url,
        tiempoPromedioMs: tiempos.reduce((a, b) => a + b, 0) / tiempos.length,
        tiempoMinimoMs: Math.min(...tiempos),
        tiempoMaximoMs: Math.max(...tiempos),
        exitosas,
        fallidas,
    };
}

// Parte 4: Comparar rendimiento entre Express directo y Apache Proxy
async function compararServidores() {
    const candidatos: string[] = [
        "http://localhost:9000/api/saludo?nombre=Bench",      // Express DIRECTO
        "http://172.30.79.59:8080/api/saludo?nombre=Bench",     // Express VIA APACHE (Puerto 8080)
    ];

    for (const url of candidatos) {
        console.log(`\nEjecutando pruebas para: ${url} ...`);
        const resultado = await medirUrl(url, 50);
        console.log(`\nResultados para: ${resultado.url}`);
        console.log(` Promedio: ${resultado.tiempoPromedioMs.toFixed(2)} ms`);
        console.log(` Mínimo: ${resultado.tiempoMinimoMs.toFixed(2)} ms`);
        console.log(` Máximo: ${resultado.tiempoMaximoMs.toFixed(2)} ms`);
        console.log(` Éxitos: ${resultado.exitosas} / Fallos: ${resultado.fallidas}`);
    }
}

compararServidores();