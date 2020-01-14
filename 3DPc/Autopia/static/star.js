import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {TWEEN} from 'three/examples/jsm/libs/tween.module.min.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

var THREEx = THREEx || {};
var vertexShader = [
  'varying vec3	vVertexWorldPosition;',
  'varying vec3	vVertexNormal;',
  'varying vec4	vFragColor;',
  'void main(){',
  '	vVertexNormal	= normalize(normalMatrix * normal);',//将法线转换到视图坐标系中
  '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',//将顶点转换到世界坐标系中
  '	// set gl_Position',
  '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}'

].join('\n');
var fragmentShader1 = [
  'uniform vec3	glowColor;',
  'uniform float	coeficient;',
  'uniform float	power;',

  'varying vec3	vVertexNormal;',
  'varying vec3	vVertexWorldPosition;',

  'varying vec4	vFragColor;',

  'void main(){',
  '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	//世界坐标系中从相机位置到顶点位置的距离
  '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',//视图坐标系中从相机位置到顶点位置的距离
  '	viewCameraToVertex	= normalize(viewCameraToVertex);',//规一化
  '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
  '	gl_FragColor		= vec4(glowColor, intensity);',
  '}'//vVertexNormal视图坐标系中点的法向量
  //viewCameraToVertex视图坐标系中点到摄像机的距离向量
  //dot点乘得到它们的夹角的cos值
  //从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
].join('\n');
var fragmentShader2 = [
  'uniform vec3	glowColor;',
  'uniform float	coeficient;',
  'uniform float	power;',

  'varying vec3	vVertexNormal;',
  'varying vec3	vVertexWorldPosition;',

  'varying vec4	vFragColor;',

  'void main(){',
  '	vec3 worldVertexToCamera= cameraPosition - vVertexWorldPosition;',	//世界坐标系中顶点位置到相机位置到的距离
  '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;',//视图坐标系中从相机位置到顶点位置的距离
  '	viewCameraToVertex	= normalize(viewCameraToVertex);',//规一化
  '	float intensity		= coeficient + dot(vVertexNormal, viewCameraToVertex);',
  '	if(intensity > 0.52){ intensity = 0.0;}',
  '	gl_FragColor		= vec4(glowColor, intensity);',
  '}'//vVertexNormal视图坐标系中点的法向量
  //viewCameraToVertex视图坐标系中点到摄像机的距离向量
  //dot点乘得到它们的夹角的cos值
  //从中心向外面角度越来越大（从锐角到钝角）从cos函数也可以知道这个值由负变正，不透明度最终从高到低

].join('\n');


THREEx.AeroSphere = {


  // create custom material from the shader code above
  //   that is within specially labeled script tags
  uniforms: {
    coeficient: {
      type: "f",
      value: 1
    },
    power: {
      type: "f",
      value: 7
    },
    glowColor: {
      type: "c",
      value: new THREE.Color('cyan')
    },
    cameraWorldPosition: {
      type: "v3",
      value: new THREE.Vector3(0, 0, 1)
    },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader1,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
}
//辉光效果Grow
THREEx.GlowSphere = {
  uniforms: {
    coeficient: {
      type: "f",
      value: 0.2
    },
    power: {
      type: "f",
      value: 1
    },
    glowColor: {
      type: "c",
      value: new THREE.Color('cyan')
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader2,
}


var stats,timeMs=1000;
var raycaster, scene, camera, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var theta = 0;
var sphere;
var selectedObjects = [];
var composer, effectFXAA, outlinePass;
var star0,star1,star2,star3,star4,star5,star6;
var hemiLight, hemiLightHelper;//半球光
var object;
var ObjList = [];//star
var DivList = [];//startdiv
var tween;// star move tween
var defaultCamPos =new THREE.Vector3(0,0,35);//default cam pos
var offsetCamPos=  {
  offsetx : 8.0,
  offsety : 4.0,
  offsetz : 12.0,
  //......
};
//gui

var params = {
  roughness: 0.0,
  metalness: 0.0,
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0
};
// var imgs1 = require("../src/assets/img/chetuobangEN.png"),
//   imgs2 = require("../src/assets/img/touzirenEN.png");

var imgs1 = require("../src/assets/img/star_0_en.png"),
    imgs2 = require("../src/assets/img/star_1_en.png"),
    imgs3 = require("../src/assets/img/star_2_en.png"),
    imgs4 = require("../src/assets/img/star_3_en.png"),
    imgs5 = require("../src/assets/img/star_4_en.png"),
    imgs6 = require("../src/assets/img/star_5_en.png"),
    imgs7 = require("../src/assets/img/star_6_en.png");

var currentpos;
var container;
var LightParams = {
  DirlightIntensity: 20,
  HemilightIntensity: 10,
  AmbientIntensity: 10,

};

function init() {
  container = document.getElementById("starTeamBox1");
  /*stats = new Stats();
  container.appendChild(stats.dom);*/
  raycaster = new THREE.Raycaster();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(scene.background, 1, 5000);
  var bg = new THREE.TextureLoader().load(require("../src/assets/img/xingkong01.jpg"));
  scene.background = bg;

  var light = new THREE.DirectionalLight( 0xffffff);
  light.position.set(-25, 20,10).normalize();
  light.intensity = 7;
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add( light );
  var ambient= new THREE.AmbientLight( 0x000000);
  ambient.intensity=5;
  scene.add(ambient);
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 30, 20 );
  hemiLight.visible=false;
  hemiLight.intensity=LightParams.HemilightIntensity;
  scene.add( hemiLight );

  // lensflares
  var textureLoader = new THREE.TextureLoader();
  var textureFlare0 = textureLoader.load( 'static/lensflare/lensflare0.png' );
  var textureFlare3 = textureLoader.load( 'static/lensflare/lensflare3.png' );
  //addLight( 0.55, 0.9, 0.5,  -35, 15,-20 );
  addLight( 0.08, 0.8, 0.5,-30, 15,-20);
  addLight( 0.995, 0.5, 0.9,  -30, 15,-20);
  function addLight( h, s, l, x, y, z ) {
    var light = new THREE.PointLight( 0x222222, 1.5, 2000 );
    light.color.setHSL( h, s, l );
    light.position.set( x, y, z );
    scene.add( light );
    var lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
    light.add( lensflare );
  }

  var aspect = window.innerWidth / window.innerHeight;
  //camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight,0.1, 3000 );
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  //renderer.shadowMap.enabled = true;
  renderer.setPixelRatio( window.devicePixelRatio );
  //
  renderer.gammaInput = true;
  renderer.gammaOutput = true;


  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
  /*var camera1 = new THREE.OrthographicCamera(window.innerWidth / 2, 0, window.innerHeight / 2, 0, 1, 1000);
  scene.add(camera1);*/
  /*renderer = new THREE.WebGLRenderer();*/
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  /*var sphereGeometry= new THREE.SphereGeometry(3,64,32);
   var texture = new THREE.TextureLoader().load( 'textures/disturb.jpg' );
   var material = new THREE.MeshLambertMaterial( { map: texture } );
   var material2 = new THREE.MeshStandardMaterial( {
   			color: 0xf6666,
   			metalness: params.metalness,
   			roughness: params.roughness,
   			map: texture,
   			emissive:0xf6666,
   			envMap: cubeTexture,
   			envMapIntensity: API.envMapIntensity,
   		} );
   sphere=new THREE.Mesh(sphereGeometry,material2);
   sphere.name="s";
   sphere.scale.set(6,6,6);
   sphere.position.set(18,0,-10);
   scene.add(sphere);*/
  var angle = 0;
  var radius = 40;
  var centerPos;

  CreateStars();
  glowSphere();
  function CreateStars(){
    centerPos=new THREE.Vector3(30,0,0);
    var x=centerPos.x+radius*Math.cos(angle*3.14/180)-10;
    var z=centerPos.y+radius*Math.sin(angle*3.14/180);
    var mtlLoader = new MTLLoader();
    ObjList = [];
    mtlLoader.load('static/models/star/xingqiu_07.mtl',function(materials){
      materials.preload();
      var loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load( 'static/models/star/xingqiu_07.obj', function ( obj ) {
        star0= obj;
        //console.log(star0);
        //var starp=CreateEarth();
        star0.position.set(3,-4,10);
        star0.scale.set(1,1,1);
        //var glow= CreateEarthGlow();
        var earchs=new THREE.Group();
        //scene.add(glow);
        //earchs.add(glow);
        earchs.add(star0);
        //earchs.name="s0";
        star0.name="s0"
        //earchs.position.set(-10,0,30);
        //object.material.map=texture;
        //scene.add(earchs);
        scene.add(star0);
        if(ObjList.length <= 7){
          addDom("车托帮星球","img",star0);
          ObjList.push(star0);
          addSelectedObject(star0);
        }
      });
    });
    // var sphereGeometry= new THREE.SphereGeometry(3,128,128);
    // var texture = new THREE.TextureLoader().load( 'static/models/star/xingqiu_01.jpg' );
    // var material = new THREE.MeshStandardMaterial( {
    // 			//color: 0xf6666,
    // 			metalness: 0.5,
    // 			roughness: 0.5,
    // 			map: texture,
    // 			side : THREE.FrontSide,
    // 		} );
    // var sphereMaterial=new THREE.MeshStandardMaterial( { color: 0x8888ff } );
    // //seven sphere
    // star0=new THREE.Mesh(sphereGeometry,material);
    // star0.position.set(3,-2.5,8);
    // star0.scale.set(2,2,2);

    // star0.name="s0"
    // scene.add(star0);
    // addDom("车托帮星球","img",star0);
    // console.log(star0);
    // ObjList.push(star0);
    // addSelectedObject(star0);


    var mtlLoader = new MTLLoader();
    mtlLoader.load('static/models/star/xingqiu_02.mtl',function(materials){
      materials.preload();
      var loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load( 'static/models/star/xingqiu_02.obj', function ( obj ) {
        star1= obj;
        //	console.log(star1);

        //var starp=CreateEarth();
        star1.position.set(-20,-12,-20);
        star1.scale.set(1,1,1);

        //var glow= CreateEarthGlow();
        var earchs=new THREE.Group();
        //scene.add(glow);
        //earchs.add(glow);
        earchs.add(star1);
        //earchs.name="s0";
        star1.name="s1"
        //earchs.position.set(-10,0,30);
        //object.material.map=texture;
        //scene.add(earchs);
        scene.add(star1);
        if(ObjList.length <= 7){
          addDom("车托帮星球","img",star1);
          ObjList.push(star1);
          addSelectedObject(star1);
        }
      });
    });
    var mtlLoader = new MTLLoader();
    mtlLoader.load('static/models/star/xingqiu_03.mtl',function(materials){
      materials.preload();
      var loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load( 'static/models/star/xingqiu_03.obj', function ( obj ) {
        star2= obj;
        ///console.log(star2);

        //var starp=CreateEarth();
        star2.position.set(-50,5,-60);
        star2.scale.set(1,1,1);

        //var glow= CreateEarthGlow();
        var earchs=new THREE.Group();
        //scene.add(glow);
        //earchs.add(glow);
        earchs.add(star2);
        //earchs.name="s0";
        star2.name="s2"
        //earchs.position.set(-10,0,30);
        //object.material.map=texture;
        //scene.add(earchs);
        scene.add(star2);
        if(ObjList.length <= 7){
          addDom("车托帮星球","img",star2);
          ObjList.push(star2);
          addSelectedObject(star2);
        }
      });
    });

    var mtlLoader = new MTLLoader();
    mtlLoader.load('static/models/star/xingqiu_04.mtl',function(materials){
      materials.preload();
      var loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load( 'static/models/star/xingqiu_04.obj', function ( obj ) {
        star3= obj;
        //console.log(star3);

        //var starp=CreateEarth();
        star3.position.set(-40,16,-80);
        star3.scale.set(1,1,1);

        //var glow= CreateEarthGlow();
        var earchs=new THREE.Group();
        //scene.add(glow);
        //earchs.add(glow);
        earchs.add(star3);
        //earchs.name="s0";
        star3.name="s3"
        //earchs.position.set(-10,0,30);
        //object.material.map=texture;
        //scene.add(earchs);
        scene.add(star3);
        if(ObjList.length <= 7){
          addDom("车托帮星球","img",star3);
          ObjList.push(star3);
          addSelectedObject(star3);
        }
      });
    });
    var mtlLoader = new MTLLoader();
    mtlLoader.load('static/models/star/xingqiu_05.mtl',function(materials){
      materials.preload();
      var loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load( 'static/models/star/xingqiu_05.obj', function ( obj ) {
        star4= obj;
        //console.log(star4);

        //var starp=CreateEarth();
        star4.position.set(-15,25,-100);
        star4.scale.set(1,1,1);

        //var glow= CreateEarthGlow();
        var earchs=new THREE.Group();
        //scene.add(glow);
        //earchs.add(glow);
        earchs.add(star4);
        //earchs.name="s0";
        star4.name="s4"
        //earchs.position.set(20,10,-50);
        //object.material.map=texture;
        //scene.add(earchs);
        scene.add(star4);
        if(ObjList.length <= 7){
          addDom("车托帮星球","img",star4);
          ObjList.push(star4);
          addSelectedObject(star4);
        }
      });
    });
    var mtlLoader = new MTLLoader();
    mtlLoader.load('static/models/star/xingqiu_06.mtl',function(materials){
      materials.preload();
      var loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load( 'static/models/star/xingqiu_06.obj', function ( obj ) {
        star5= obj;
        //console.log(star5);

        //var starp=CreateEarth();
        star5.position.set(8,33,-120);
        star5.scale.set(1,1,1);

        //var glow= CreateEarthGlow();
        var earchs=new THREE.Group();
        //scene.add(glow);
        //earchs.add(glow);
        earchs.add(star5);
        //earchs.name="s0";
        star5.name="s5";
        //earchs.position.set(-40,0,30);
        //object.material.map=texture;
        //scene.add(earchs);
        scene.add(star5);
        if(ObjList.length <= 7){
          addDom("车托帮星球","img",star5);
          ObjList.push(star5);
          addSelectedObject(star5);
        }
      });
    });
    var mtlLoader = new MTLLoader();
    mtlLoader.load('static/models/star/xingqiu_01.mtl',function(materials){
      materials.preload();
      var loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load( 'static/models/star/xingqiu_01.obj', function ( obj ) {
        star6= obj;
        //console.log(star6);

        //var starp=CreateEarth();
        star6.position.set(50,-20,-80);
        star6.scale.set(1,1,1);
        //star6.rotation.set(90,90,0);
        //var glow= CreateEarthGlow();
        var earchs=new THREE.Group();
        //scene.add(glow);
        //earchs.add(glow);
        earchs.add(star6);
        //earchs.name="s0";
        star6.name="s6"
        //earchs.position.set(-10,0,30);
        //object.material.map=texture;
        //scene.add(earchs);
        scene.add(star6);
        if(ObjList.length <= 7){
          addDom("车托帮星球","img",star6);
          ObjList.push(star6);
          addSelectedObject(star6);
        }
      });
    });
  }
  function glowSphere(){
    composer = new EffectComposer( renderer );
    var renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
    composer.addPass( outlinePass );
    var onLoad = function ( texture ) {
      outlinePass.patternTexture = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    };
    var loader = new THREE.TextureLoader();
    loader.load( 'textures/tri_pattern.jpg', onLoad );
    effectFXAA = new ShaderPass( FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    composer.addPass( effectFXAA );
    outlinePass.edgeStrength = 2.6;
    outlinePass.edgeGlow = 6;
    outlinePass.edgeThickness = 9.6;
    outlinePass.pulsePeriod = -1;
    outlinePass.visibleEdgeColor.set( '#07f5e7' );
    outlinePass.hiddenEdgeColor.set( '#ffffff' );
  }

  //txt1 为div中要显示的文本，具体样式可修改 innerHTML那一行

  /*for(var obj1 of selectedObjects){
    console.log(obj1);
  }
*/
  outlinePass.selectedObjects = selectedObjects;
  camera.position.set(defaultCamPos.x,defaultCamPos.y,defaultCamPos.z);
  document.addEventListener('click', onDocumentMouseClick, false);
  //
  window.addEventListener('resize', onWindowResize, false);
}
function removeClear(){
  document.removeEventListener('click', onDocumentMouseClick, false);
  clearRenderer();
  for (let obj in ObjList){
    clearCache(obj)
  }
}
function addDom(txt1, img, star) {
  let imgSrc,imgs;
  let addDivDom=document.getElementById(star.name+"_name");
  let bodyDom = document.body;
  if(addDivDom==null){
    addDivDom = document.createElement('div');
    addDivDom.id = star.name + "_name";
    //imgs = document.createElement("img");
    DivList.push(addDivDom);
  }else{
   let zzz= document.getElementsByClassName(star.name+"_name")[0];
    addDivDom.removeChild(zzz);
  }
  bodyDom.insertBefore(addDivDom, bodyDom.lastChild);
  addDivDom.classList = 'tap';
  addDivDom.className = "boxs";
  imgs = document.createElement("img");
  imgs.className = star.name+"_name";
  switch(star.name){
    case "s0":
      imgSrc = imgs1;
      imgs.style.width = "70%";
      break;
    case "s1":
      imgSrc = imgs2;
      imgs.style.width = "60%";
      break;
    case "s2":
      imgSrc = imgs3;
      imgs.style.width = "60%";
      break;
    case "s3":
      imgSrc = imgs4;
      imgs.style.width = "60%";
      break;
    case "s4":
      imgSrc = imgs5;
      imgs.style.width = "60%";
      break;
    case "s5":
      imgSrc = imgs6;
      imgs.style.width = "60%";
      break;
    case "s6":
      imgSrc = imgs7;
      imgs.style.width = "60%";
      break;
  }
  imgs.src= imgSrc;
  addDivDom.appendChild(imgs);
  container.appendChild(addDivDom);

  //console.log("生成div");
}
/**
 * 清空当前obj对象的缓存
 * @param object object3D对象或mesh对象
 * */
function clearCache(object) {
  let  mesh = object;
  //mesh.geometry.dispose();
  mesh.material.dispose();
}


function clearRenderer(){
  console.log(renderer);
  renderer.dispose();
  renderer.forceContextLoss();
  //renderer.context = null;
  renderer.domElement = null;
  renderer = null;
}

renderLabel();

function renderLabel() {

  for (var star of ObjList) {
    var id = star.name;
    //console.log(id);
    var div = document.getElementById(id + "_name");
    var vector = star.position;
    // console.log(vec3);
    /*if (isvisual(vector)) {
      //...
      div.style.visibility = "hidden";//隐藏
    } else {
      div.style.visibility = "visible";//显示
    }*/
    if (div != null) {
      div.style.left = transPosition(star.position).x + 'px';
      //console.log("left:"+transPosition(vector).x+"top:"+transPosition(vector).y);
      //console.log("width:"+ window.innerWidth +"height:"+window.innerHeight)
      div.style.position = "absolute";
      //let posi = new THREE.Vector3(star.position.x, (star.position.y) * 2, star.position.z);
      div.style.top = transPosition(star.position).y - 20 + 'px';

    }
  }

}

function SwitchLanguaga() {
  var langs = localStorage.getItem("lang");


  for (let star of ObjList) {
    var id = star.name;
    var div = document.getElementById(id + "_name");
    if(langs == "en"){
      // imgs1 = require("../src/assets/img/chetuobangEN.png");
      // imgs2 = require("../src/assets/img/touzirenEN.png");
      
        imgs1 = require("../src/assets/img/star_0_en.png");

        imgs2 = require("../src/assets/img/star_1_en.png");

        imgs3 = require("../src/assets/img/star_2_en.png");
 
        imgs4 = require("../src/assets/img/star_3_en.png");

        imgs5 = require("../src/assets/img/star_4_en.png");

        imgs6 = require("../src/assets/img/star_5_en.png");

        imgs7 = require("../src/assets/img/star_6_en.png");
      
    }else{
      // imgs1 = require("../src/assets/img/chetuobangbiaoqian.png");

        imgs1 = require("../src/assets/img/star_0_cn.png");

        imgs2 = require("../src/assets/img/star_1_cn.png");

        imgs3 = require("../src/assets/img/star_2_cn.png");
  
        imgs4 = require("../src/assets/img/star_3_cn.png");

        imgs5 = require("../src/assets/img/star_4_cn.png");

        imgs6 = require("../src/assets/img/star_5_cn.png");

        imgs7 = require("../src/assets/img/star_6_cn.png");
      
      // imgs2 = require("../src/assets/img/touzirenbiaoqian.png");
    }
    addDom("车托帮星球","img",star);
  }
}

//三维坐标转屏幕坐标
function transPosition(position) {
  let world_vector = new THREE.Vector3(position.x, position.y, position.z);
  let vector = world_vector.project(camera);
  //console.log("转哗为屏幕坐标后"+vector.x+":"+vector.y);
  let halfWidth = window.innerWidth / 2,
    halfHeight = window.innerHeight / 2;
  return {
    x: Math.round(vector.x * halfWidth + halfWidth),
    y: Math.round(-vector.y * halfHeight + halfHeight)
  };
}

//是否在子屏幕内
function isvisual(position) {
  var isvi = true;
  let world_vector = new THREE.Vector3(position.x, position.y, position.z);
  let vector = world_vector.project(camera);
  //console.log("转哗为屏幕坐标后" + vector.x + ":" + vector.y);
  if (vector.x > -1 && vector.x < 1 && vector.y > -1 && vector.y < 1) {
    //...
    isvi = false;
  } else {
    isvi = true;
  }
  return isvi;
}


function onWindowResize() {
  var aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //composer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseClick(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    /*for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object.parent.name);
      console.log(intersects[i].object.position);
    }*/
    if (INTERSECTED) {
      /*console.log(INTERSECTED.name);
      console.log(intersects[0].object.parent.name);
      if (INTERSECTED.name == intersects[0].object.parent.name) {
        console.log(camera.position);
        var tween2 = new TWEEN.Tween(camera.position)
          .to({
            x: defaultCamPos.x,
            y: defaultCamPos.y,
            z: defaultCamPos.z
          }, 1000).start().onComplete(function () {
            console.log("摄像机归位");
            console.log(camera.position);
            INTERSECTED = null;
          });

      }*/
      return;
    }


    INTERSECTED = intersects[0].object.parent;
    var name = intersects[0].object.parent.name;
    var cur_div = document.getElementById(name + "_name");
    //console.log(cur_div.id);
    for (var div of DivList) {
      if (div.id != cur_div.id){
        div.style.display = "none";
      }else{
        div.style.display = "block";
      }
    }
    for (var star of ObjList) {
      ////console.log(star);
      if (star.name != name) {
        star.visible = false;
      } else {
        star.visible = true;
      }
    }

    //console.log("selected sphere:" + name);
    switch (name) {
      case "s0":
        //console.log("selected sphere:" + INTERSECTED.position);
        localStorage.setItem("starNumber",0);
        tween = new TWEEN.Tween(camera.position)
          .to({
            x: INTERSECTED.position.x + offsetCamPos.offsetx,
            y: INTERSECTED.position.y + offsetCamPos.offsety,
            z: INTERSECTED.position.z + offsetCamPos.offsetz
          }, timeMs)
          .start().onComplete(function () {
            moveEnd(name,0);
          });
        break;
      case "s1":
        localStorage.setItem("starNumber",1);
        tween = new TWEEN.Tween(camera.position)
          .to({
            x: INTERSECTED.position.x + offsetCamPos.offsetx,
            y: INTERSECTED.position.y + offsetCamPos.offsety,
            z: INTERSECTED.position.z + offsetCamPos.offsetz
          }, timeMs)
          .start().onComplete(function () {
            moveEnd(name,1);
          });
        break;
      case "s2":
        localStorage.setItem("starNumber",2);
        tween = new TWEEN.Tween(camera.position)
          .to({
            x: INTERSECTED.position.x + offsetCamPos.offsetx,
            y: INTERSECTED.position.y + offsetCamPos.offsety,
            z: INTERSECTED.position.z + offsetCamPos.offsetz
          }, timeMs)
          .start().onComplete(function () {
            moveEnd(name,2);
          });

        //INTERSECTED.material.emissive.setHex( 0xff2222 );
        break;
      case "s3":
        localStorage.setItem("starNumber",3);
        tween = new TWEEN.Tween(camera.position)
          .to({
            x: INTERSECTED.position.x + offsetCamPos.offsetx,
            y: INTERSECTED.position.y + offsetCamPos.offsety,
            z: INTERSECTED.position.z + offsetCamPos.offsetz
          }, timeMs)
          .start().onComplete(function () {
            moveEnd(name,3);
          });
        break;
      case "s4":
        localStorage.setItem("starNumber",4);
        tween = new TWEEN.Tween(camera.position)
          .to({
            x: INTERSECTED.position.x + offsetCamPos.offsetx,
            y: INTERSECTED.position.y + offsetCamPos.offsety,
            z: INTERSECTED.position.z + offsetCamPos.offsetz
          }, timeMs)
          .start().onComplete(function () {
            moveEnd(name,4);
          });
        break;
      case "s5":
        localStorage.setItem("starNumber",5);
        tween = new TWEEN.Tween(camera.position)
          .to({
            x: INTERSECTED.position.x + offsetCamPos.offsetx,
            y: INTERSECTED.position.y + offsetCamPos.offsety,
            z: INTERSECTED.position.z + offsetCamPos.offsetz
          }, timeMs)
          .start().onComplete(function () {
            moveEnd(name,5);
          });
        break;
      case "s6":
        localStorage.setItem("starNumber",6);
        tween = new TWEEN.Tween(camera.position)
          .to({
            x: INTERSECTED.position.x + offsetCamPos.offsetx,
            y: INTERSECTED.position.y + offsetCamPos.offsety,
            z: INTERSECTED.position.z + offsetCamPos.offsetz
          }, timeMs)
          .start().onComplete(function () {
            moveEnd(name,6);
          });
        break;

    }
    //console.log(intersects[0].object.name);
    //document.getElementById("tips").style.display="none";

  } else {
    if (INTERSECTED) {
      var displayB = document.getElementById("container");
      displayB.style.display = "none";
      var tween2 = new TWEEN.Tween(camera.position)
        .to({x: defaultCamPos.x, y: defaultCamPos.y, z: defaultCamPos.z}, 1000).start().onComplete(function () {
          RestorePosEnd();
        });
    }
  }
}

function moveEnd(name,num) {
  /*console.log("移动结束");
  console.log(camera.position);*/
  var displayB = document.getElementById("container");
  displayB.style.display = "block";
  //console.log(displayB);
  localStorage.setItem("starNumber",num);

  var lookpos = new THREE.Vector3(INTERSECTED.position.x + 10, INTERSECTED.position.y + 4, INTERSECTED.position.z);
  //camera.lookAt(lookpos);
}

//还原位置
function RestorePosEnd() {
  /*console.log("摄像机归位");
  console.log(camera.position);*/

  INTERSECTED = null;
  for (var div of DivList) {
    //console.log(div.id);
    div.style.display = "block";
  }
  for (var star of ObjList) {
    star.visible = true;
  }
  //camera.lookAt(scene.position);
}

function animate() {
  requestAnimationFrame( animate );
  //sphere.rotation.y += 0.01;
  //stats.update();
  TWEEN.update();
  composer.render();
  render();

  //renderer.render( scene, camera );
}

function addSelectedObject( object ) {
  selectedObjects.push( object );

}
function render() {
  theta += 0.1;
  //sphere.material.roughness = params.roughness;
  //sphere.material.metalness = params.metalness;

  //camera.lookAt( scene.position );
  camera.updateMatrixWorld();
  // find intersections
  //sphere.rotation.y += 0.001;
  for(var obj of ObjList){

    switch (obj.name) {
      case "s0":
        obj.rotation.y += 0.0015;
        break;
      case "s1":
        obj.rotation.y -= 0.0025;
        break;
      case "s2":
        obj.rotation.y += 0.003;
        break;
      case "s3":
        obj.rotation.y -= 0.004;
        break;
      case "s4":
        obj.rotation.y += 0.006;
        break;
      case "s5":
        obj.rotation.y -= 0.008;
        break;
      case "s6":
        obj.rotation.y -= 0.01;
        break;

    }

  }
  renderLabel();
  //renderer.render( scene, camera );
}


export {init,animate,removeClear,SwitchLanguaga}

