const colors = require('colors');
const fs = require('fs').promises;
//Crea la interfaz que permite interactuar con la consola en NodeJs
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdou, });
class Producto {
    //Definir atributos
    #codigoproducto;
    #nombreproducto;
    #inventarioproducto;
    #precioproducto;
    constructor() {
        this.#codigoproducto = '';
        this.#nombreproducto = '';
        this.#inventarioproducto = 0;
        this.#precioproducto = 0;
    }

    //Metodos setter y getter
    get codigoproducto() {
        return this.#codigoproducto;
    }

    set codigoproducto(codigo) {
        this.#codigoproducto = codigo;
    }

    get nombreproducto() {
        return this.#nombreproducto;
    }

    set nombreproducto(nombre) {
        this.#nombreproducto = nombre;
    }

    get inventarioproducto() {
        return this.#inventarioproducto;
    }

    set inventarioproducto(inventario) {
        this.#inventarioproducto = inventario;
    }

    get precioproducto() {
        return this.#precioproducto;
    }

    set precioproducto(precio) {
        this.#precioproducto = precio;
    }
}
class ProductosTienda {
    #listaproductos;
    constructor() {
        this.#listaproductos = [];
    }

    get listaproductos() {
        return this.#listaproductos;
    }

    set listaproductos(lista) {
        this.#listaproductos = lista;
    }

    mostrarproductos() {
        //for each recorre el array y realiza operaciones en cada uno de sus elementos
        this.#listaproductos.forEach((producto) => {
            console.log(
                `|    ` +
                producto.codigoproducto +
                `    |` +
                `    |` +
                producto.nombreproducto +
                `    |` +
                `     ` +
                producto.inventarioproducto +
                `    |` +
                `     ` +
                producto.precioproducto +
                `    |`
            );
        });
    }
}

//Agrega productos 
const agregarProducto = async (productosTienda, nuevoProducto) => {
    //.push permite agregar elementos al final del array
    productosTienda.listaproductos.push(nuevoProducto);
    console.log(`Producto agregado:`.bgCyan);
    console.log(nuevoProducto);
    //await espera a que se complete una operación asincrónica antes de continuar con el código
    await grabararchivosproductos(productosTienda.listaproductos.map(producto => ({
        codigoproducto: producto.codigoproducto,
        nombreproducto: producto.nombreproducto,
        inventarioproducto: producto.inventarioproducto,
        precioproducto: producto.precioproducto,
    })));
};

const grabararchivosproductos = async (listaproductos) => {
    // envuelve  código que podría generar excepciones
    try {
        //convierte en cadena JSON
        const cadenaJson = JSON.stringify(listaproductos, null, 2);
        const nombrearchivo = './datos.json';
        //wiritefile escribe datos en un archivo en el sistema de archivos
        await fs.writeFile(nombrearchivo, cadenaJson, 'utf-8');
        console.log(`DATOS GUARDADOS EN ${nombrearchivo}`.bgCyan);
    } catch (error) {
        console.log(`Error al guardar el archivo: ${error.message}`.bgRed);
    }
};

const mostrarMenu = () => {
    return new Promise((resolve) => {
        console.log(`********************************`.bgBlue);
        console.log(`**    Seleccione una opción   **`.bgBlue);
        console.log(`********************************\n`.bgBlue);
        console.log(`${'1.'.red} Crear nuevo producto`);
        console.log(`${'2.'.red} Listar productos`);
        console.log(`${'3.'.red} Salir\n`);

        //pregunta que se muestra en consola
        readline.question('Seleccione una opción: ', (opt) => {
            resolve(opt);
        });
    });
};

const pausa = () => {
    return new Promise((resolve) => {
        readline.question(`\nPresione ${'ENTER'.blue} para continuar\n`, (opt) => {
            resolve(opt);
        });
    });
};


const obtenerDetallesProducto = async () => {
    return new Promise((resolve) => {
        const nuevoProducto = new Producto();
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Digite el código del producto: ', (codigo) => {
            nuevoProducto.codigoproducto = codigo;
            readline.question('Digite el nombre del producto: ', (nombre) => {
                nuevoProducto.nombreproducto = nombre;
                readline.question('Digite la cantidad existente del producto: ', (inventario) => {
                    // ParseInt convierte cadenas en números enteros
                    nuevoProducto.inventarioproducto = parseInt(inventario);
                    readline.question('Digite el precio del producto: ', (precio) => {
                        // parseFloat realiza operaciones matemáticas con valores contenidos en cadenas que tienen decimales
                        nuevoProducto.precioproducto = parseFloat(precio);
                        resolve(nuevoProducto);
                    });
                });
            });
        });
    });
};

const main = async () => {
    console.clear();
    console.log('*********************'.green);
    console.log('**  Reto Guia 10   **'.green);
    console.log('*********************\n'.green);

    let productostienda = new ProductosTienda();


    let salir = false;
    while (!salir) {
        const opcion = await mostrarMenu();

        switch (opcion) {
            case '1':

                console.log(`Ingrese los detalles del nuevo producto:`.bgBlue);
                const nuevoProducto = await obtenerDetallesProducto();
                await agregarProducto(productostienda, nuevoProducto);
                await pausa();
                break;

            case '2':
                console.log(`Listado de productos:`.bgBlue);
                productostienda.mostrarproductos();
                await pausa();
                break;
            case '3':

                salir = true;
                break;
            default:
                console.log(`opcion no valida por favor selecione una opcion valida`.bgRed);
                await pausa();
                break;
        }
    }
    //Cierra la interfaz creada
    readline.close();
    console.log('¡Gracias, hasta pronto!'.bgGreen);
};

main();