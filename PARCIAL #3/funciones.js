/* PARA LA REALIZACION EN PRIMER LUGAR SE REALIZO UNA MATRIZ GENERANDO LOS VERTICES
PERO AL APLICAR EL MATERIAL LA FIGURA SE PERDIA YA QUE QUEDABAN ZONAS ABIERTAS
SIENDO ASI RECURRI A CHATGPT PARA ENCONTRAR UNA SOLUCION, SIENDO LA CREACION
DE VERTICES PARA POSTERIORMENTE CREAR TRIANGULOS QUE UNIERAN LA BASE Y LA TAPA DE
LA PIRAMIDE TRUNCADA, LOS PARAMETRSO UTLIZADOS QUEDARON LIBRES PARA SER MODIFICADOS
Y ASI MISMO MODIFICAR LA FIGURA. */

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

var size = 10;
var arrowSize = 4;
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
var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
camera.position.z = 4;
camera.position.y = 4;
camera.position.x = 4;
const light = new THREE.AmbientLight(0x404040, 5);

//-----------------------------------------------------------------------------------------

//Escena
scene.add(arrowX, arrowY, arrowZ, gridHelperXZ, camera, light);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//--------------------------------------------------------------------
//VALORES PARA PODER MODIFICAR EL TRONCO DE PIRAMIDE                 -
var nl = 5; // NUMERO DE LADOS                                       -
var a  = 1; // APOTEMA                                               -
var e  = -50 //ESCALADO                                              -
var h  = 2; // ALTURA DE LA PIRAMIDE                                 -
//--------------------------------------------------------------------

//SE CREA LA FUNCION troncoPiramide CON LOS SIGUIENTE PARAMETRO
function troncoPiramide(nl, a, e, h) 
{
    var v1 = []; // VERTICES #1
    var v2 = []; // VERTICES #2
    //SE GENRA EL FACTOR DE ESCALADO PARA LA TAPA DE LA FIGURA 
    var fe = 1 + (e / 60);
    var ang = (2 * Math.PI) / nl;

    for (let m = 0; m < nl; m++) 
    {
      let x1 = a * Math.cos(m * ang);
      let z1 = a * Math.sin(m * ang);
      v1.push(x1, 0, z1);

      let x2 = a * fe * Math.cos(m * ang);
      let z2 = a * fe * Math.sin(m * ang);
      v2.push(x2, h, z2);
    }

  //SE UTILIZA LA FUNCION "length" PARA LA LONGITUD. 
  var nV1 = v1.length / 3; // NUMERO VECTICES EN V1
  var nV2 = v2.length / 3; // NUMERO VECTICES EN V2

  //SE AGRUPAN LOS VECTICES PARA SER UTILIZADOS EN LA GEOMETRIA
  var ver = v1.concat(v2); 
  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(ver, 3));

  // SE CREAN LOS INDICAROS PARA GENERAR LAS CARAS
    var indicador = [];

  for (let m = 0; m < nV1 - 1; m++) 
  {
    var cAVx1 = m;
    var cAVx2 = m + nV1;
    var nextVx1 = (m + 1) % nV1;
    var nextVx2 = (m + 1) % nV2;

    for (let n = 0; n < nl; n++) 
    {
      var ltVx1 = cAVx1 + n * nV1;
      var ltVx2 = cAVx2 + n * nV1;
      var ltNVx1 = nextVx1 + n * nV1;
      var ltNVx2 = nextVx2 + n * nV1;

      //TRIANGULO #1 (C.LATERAL)
      indicador.push(ltVx1, ltVx2, ltNVx1);

      //TRIANGULO #2 (C.LATERAL)
      indicador.push(ltVx2, ltNVx2, ltNVx1);
    }
  }

  //CARA FINAL (UNION CON EL VERTICE INICIAL Y FINAL)
  var cAVx1 = nV1 - 1;
  var cAVx2 = nV1 + nV2 - 1;
  var nextVx1 = 0;
  var nextVx2 = nV1;

  for (let n = 0; n < nl; n++)
  {
    var ltVx1 = cAVx1 + n * nV1;
    var ltVx2 = cAVx2 + n * nV1;
    var ltNVx1 = nextVx1 + n * nV1;
    var ltNVx2 = nextVx2 + n * nV1;

    //TRIANGULO #1 (C.LATERAL)
    indicador.push(ltVx1, ltVx2, ltNVx1);

    //TRIANGULO #2 (C.LATERAL)
    indicador.push(ltVx2, ltNVx2, ltNVx1);
  }

  //UNION DE LOS VERTICES (BASE - TAPA)
  for (let m = 0; m < nl; m++) 
  {
    var bVx1 = m;
    var bVx2 = (m + 1) % nl;
    var tVx1 = bVx1 + nV1;
    var tVx2 = bVx2 + nV1;

  //UNION BASE CON LA TAPA, SE REALIZA POR MEDIO DE TRIANGULOS.
    indicador.push(bVx1, tVx1, bVx2);
    indicador.push(bVx2, tVx1, tVx2);
  }

  //CARAS - BASE
    for (let m = 0; m < nl; m++) 
    {
      var bVx1 = m;
      var bVx2 = (m + 1) % nl;
      //VERTICE FINAL - BASE
      var bVx3 = nV1 - 1;

      indicador.push(bVx1, bVx2, bVx3);
    }

  //CARAS - TAPA
    for (let m = 0; m < nl; m++) 
    {
      var tVx1 = m + nV1;
      var tVx2 = (m + 1) % nl + nV1;
      //VERTICE FINAL - TAPA
      var tVx3 = nV2 - 1;

      indicador.push(tVx1, tVx2, tVx3);
    }

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }


    geometry.setIndex(indicador);
    var material = new THREE.MeshBasicMaterial({ color: getRandomColor()});
  // var material = new THREE.MeshBasicMaterial({ color: 0xfff5a02 ,wireframe: false});
    var mesh = new THREE.Mesh(geometry, material);

  //SE AGRAGA A LA ESCENA
    scene.add(mesh);
}

//SE LE APLICAN LOS PARAMETROS INDICADOS POR EL USUARIO  
  troncoPiramide(nl,a,e,h); 

  
 
/*
  for (let i = 0; i < 5; i++) {
    var geometry = new THREE.BufferGeometry();
    //geometry.setIndex(indicador);
    var material = new THREE.MeshBasicMaterial({ color: getRandomColor()});
    var mesh = new THREE.Mesh(geometry, material);
    troncoPiramide.position.x = (i - 5) * 5;
    scene.add(troncoPiramide);
  }
  */

//FUNCION RENDER
function render() {
requestAnimationFrame(render);
renderer.render(scene, camera);}
render();