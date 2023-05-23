/* PARA LA REALIZACION EN PRIMER LUGAR SE REALIZO UNA MATRIZ GENERANDO LOS VERTICES
PERO AL APLICAR EL MATERIAL LA FIGURA SE PERDIA YA QUE QUEDABAN ZONAS ABIERTAS
SIENDO ASI RECURRI A CHATGPT PARA ENCONTRAR UNA SOLUCION, SIENDO LA CREACION
DE LA TAPA Y LA BASE POSTERIORMENTE CREAR LAS UNIONES ENTRE LA BASE Y LA TAPA DE
LA PIRAMIDE TRUNCADA, LOS PARAMETRSO UTLIZADOS QUEDARON LIBRES PARA SER MODIFICADOS
Y ASI MISMO MODIFICAR LA FIGURA. */

/*
NOTA: INTENTE HACERLO CON LA FUNCION DAD POR EL PROFESOR PERO AL MOMENTO DE APLICAR 
EL MATERIAL NO FUNCIONABA, LA FIGURA DESAPARECIA AL CANBIAR LA POSICION DESDE LAS QUE
SE VEIA.
*/

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

var size = 100;
var arrowSize = 30;
var divisions = 100;
var origin = new THREE.Vector3( 0, 0, 0 );
var x = new THREE.Vector3( 1, 0, 0 );
var y = new THREE.Vector3( 0, 1, 0 );
var z = new THREE.Vector3( 0, 0, 1 );
var color2 = new THREE.Color( 0x333333 );
var colorR = new THREE.Color( 0xAA0000 );
var colorG = new THREE.Color( 0x00AA00 );
var colorB = new THREE.Color( 0x0000AA );

//--------------------------------------------------------------------------------------

//Creacion de la guia (guilla)
var gridHelperXZ = new THREE.GridHelper( size, divisions, color2, color2);

//Creacion de los  ejes
var arrowX = new THREE.ArrowHelper( x, origin, arrowSize, colorR );
var arrowY = new THREE.ArrowHelper( y, origin, arrowSize, colorG );
var arrowZ = new THREE.ArrowHelper( z, origin, arrowSize, colorB );

//-----------------------------------------------------------------------------------------

//Creacion de la camara
const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
const light = new THREE.AmbientLight(0x404040, 5);
camera.position.z = 15;
camera.position.y = 15;
camera.position.x = 15;

//-----------------------------------------------------------------------------------------

//Escena
scene.add(arrowX, arrowY, arrowZ, gridHelperXZ, camera, light);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

//---------------------------------------------------------
//PARAMETROS                                              -
const lB = 5; // LONGITUD LADO (POLIGONO)                 -
const H = 2; // ALTURA                                    -
const rB = 2; // RADIO (POLIGONO)                         -
const nP = 4; // NUMERO DE PIRAMIDES                      -
//---------------------------------------------------------

//FUNCION PARA QUE EL COLOR SEA ALEATORIO
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//----------------------------------------------------------
const pir = []; //PIRAMIDES

// FUNCION PARA CREAR LA PIRAMIDE
function troncoPiramide(l, r, alt) {
  const GeometryB = new THREE.CircleBufferGeometry(r, l);// GEOMETRIA DEL POLIGONO
GeometryB.rotateX(Math.PI / 2); 
GeometryB.rotateY(Math.PI / 3.3);

const rS = r * 0.5; //RADIO SUPERIOR
const rI = r; // INFERIOR

// CREACION DE LA PIRAMIDE
const GeometryT = new THREE.CylinderBufferGeometry(rS, rI, alt, l, 1, false);
      GeometryT.translate(0, alt / 2, 0);

//SE CREA LA TAPA
const GeometryTA = new THREE.CircleBufferGeometry(rS, lB);
//SE ROTA
  GeometryTA.rotateX(-Math.PI / 2);
  GeometryTA.rotateY(-Math.PI / 2);

//SE TRASLADA LA TAPA "alt" HACIA ARRIBA
  GeometryTA.translate(0, alt, 0);

//SE CREAN LOS MESH PARO LA BASE, LA TAPA Y EL TRONCO
const MeshT = new THREE.Mesh(GeometryT, new THREE.MeshBasicMaterial({ color: getRandomColor() }));
const MeshB = new THREE.Mesh(GeometryB, new THREE.MeshBasicMaterial({ color: getRandomColor() }));
const MeshTA= new THREE.Mesh(GeometryTA, new THREE.MeshBasicMaterial({ color: getRandomColor()}));

//SE COLOCA TODO LO CREADO EN UN GRUPO
const agrupacion = new THREE.Group();
agrupacion.add(MeshT, MeshB, MeshTA);
return agrupacion;
}


//SE ACOMODAN LAS PRIRAMIDES (4 PIRAMIDES SOBRE 4 PIRAMIDES)
for (var m = 0; m < nP; m++) { const p = troncoPiramide(lB, rB, H); p.position.set(m * 5, 0, 0);
pir.push(p); scene.add(p);
}

for (var m = 0; m < nP; m++) { const p = troncoPiramide(lB, rB, H); p.position.set(m * 5, 5, 0);
pir.push(p); scene.add(p);
}

//FUNCION RENDER
function render() {requestAnimationFrame(render); renderer.render(scene, camera);}
render();