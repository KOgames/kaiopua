/*
Game.js
Game module, handles sections of game.
*/

var KAIOPUA = (function (main) {
    
    var shared = main.shared = main.shared || {},
        utils = main.utils = main.utils || {},
        loader = utils.loader = utils.loader || {},
        uihelper = utils.uihelper = utils.uihelper || {},
        game = main.game = main.game || {},
		core = game.core = game.core || {},
        sections = game.sections = game.sections || {},
        workers = game.workers = game.workers || {},
        menus = game.menus = game.menus || {},
		effects = main.effects = main.effects || {},
        transitioner,
        domElement,
        menumaker,
        renderer, 
        renderTarget,
		renderComposer,
        renderPasses,
		scene,
		sceneBG,
		sceneDefault,
		sceneBGDefault,
		fog,
		camera,
		cameraBG,
		cameraDefault,
		cameraBGDefault,
		physics,
		bg,
		world,
		player,
		character,
        sectionNames = [],
        currentSection, 
        previousSection,
        paused = false,
        transitionOut = 1000, 
        transitionIn = 400,
        loadAssetsDelay = 500,
        assetsBasic = [
            "js/lib/three/Three.js",
            "js/lib/three/ThreeExtras.js",
			"js/lib/three/physics/Collisions.js",
			"js/lib/three/physics/CollisionUtils.js",
            "js/lib/three/postprocessing/ShaderExtras.js",
            "js/lib/three/postprocessing/EffectComposer.js",
            "js/lib/three/postprocessing/RenderPass.js",
            "js/lib/three/postprocessing/ShaderPass.js",
            "js/lib/three/postprocessing/MaskPass.js",
            "js/effects/LinearGradient.js",
            "js/effects/FocusVignette.js"
        ],
        assetsLauncher = [
            "js/game/sections/LauncherSection.js",
            "js/game/sections/launcher/Water.js",
            "js/game/sections/launcher/Sky.js",
            "assets/textures/cloud256.png",
            "assets/textures/light_ray.png",
			"assets/textures/skybox_launcher_xz.jpg",
			"assets/textures/skybox_launcher_posy.jpg",
            "assets/textures/skybox_launcher_negy.jpg"
        ],
        assetsGame = [
			/* JigLib Physics Library (2)
			 * TODO: Minify and Concat
			"js/lib/jiglibjs2/jiglib.js",
			"js/lib/jiglibjs2/geom/glMatrix.js",
			"js/lib/jiglibjs2/geom/Vector3D.js",
			"js/lib/jiglibjs2/geom/Matrix3D.js",
			"js/lib/jiglibjs2/math/JMatrix3D.js",
			"js/lib/jiglibjs2/math/JMath3D.js",
			"js/lib/jiglibjs2/math/JNumber3D.js",
			"js/lib/jiglibjs2/cof/JConfig.js",
			"js/lib/jiglibjs2/data/CollOutData.js",
			"js/lib/jiglibjs2/data/ContactData.js",
			"js/lib/jiglibjs2/data/PlaneData.js",
			"js/lib/jiglibjs2/data/EdgeData.js",
			"js/lib/jiglibjs2/data/TerrainData.js",
			"js/lib/jiglibjs2/geometry/JAABox.js",
			"js/lib/jiglibjs2/data/OctreeCell.js",
			"js/lib/jiglibjs2/data/CollOutBodyData.js",
			"js/lib/jiglibjs2/data/TriangleVertexIndices.js",
			"js/lib/jiglibjs2/data/SpanData.js",
			"js/lib/jiglibjs2/physics/constraint/JConstraint.js",
			"js/lib/jiglibjs2/physics/constraint/JConstraintMaxDistance.js",
			"js/lib/jiglibjs2/physics/constraint/JConstraintWorldPoint.js",
			"js/lib/jiglibjs2/physics/constraint/JConstraintPoint.js",
			"js/lib/jiglibjs2/physics/MaterialProperties.js",
			"js/lib/jiglibjs2/geometry/JTriangle.js",
			"js/lib/jiglibjs2/geometry/JSegment.js",
			"js/lib/jiglibjs2/collision/CollPointInfo.js",
			"js/lib/jiglibjs2/collision/CollisionInfo.js",
			"js/lib/jiglibjs2/collision/CollDetectInfo.js",
			"js/lib/jiglibjs2/collision/CollDetectFunctor.js",
			"js/lib/jiglibjs2/collision/CollDetectBoxTerrain.js",
			"js/lib/jiglibjs2/collision/CollDetectSphereMesh.js",
			"js/lib/jiglibjs2/collision/CollDetectCapsuleBox.js",
			"js/lib/jiglibjs2/collision/CollDetectSphereCapsule.js",
			"js/lib/jiglibjs2/collision/CollDetectCapsuleTerrain.js",
			"js/lib/jiglibjs2/collision/CollDetectSphereBox.js",
			"js/lib/jiglibjs2/collision/CollDetectSphereTerrain.js",
			"js/lib/jiglibjs2/collision/CollDetectBoxBox.js",
			"js/lib/jiglibjs2/collision/CollDetectBoxMesh.js",
			"js/lib/jiglibjs2/collision/CollDetectBoxPlane.js",
			"js/lib/jiglibjs2/collision/CollDetectCapsuleCapsule.js",
			"js/lib/jiglibjs2/collision/CollDetectSphereSphere.js",
			"js/lib/jiglibjs2/collision/CollDetectSpherePlane.js",
			"js/lib/jiglibjs2/collision/CollDetectCapsulePlane.js",
			"js/lib/jiglibjs2/collision/CollisionSystemAbstract.js",
			"js/lib/jiglibjs2/collision/CollisionSystemGridEntry.js",
			"js/lib/jiglibjs2/collision/CollisionSystemGrid.js",
			"js/lib/jiglibjs2/collision/CollisionSystemBrute.js",
			"js/lib/jiglibjs2/geometry/JIndexedTriangle.js",
			"js/lib/jiglibjs2/geometry/JOctree.js",
			"js/lib/jiglibjs2/geometry/JRay.js",
			"js/lib/jiglibjs2/events/JCollisionEvent.js",
			"js/lib/jiglibjs2/physics/PhysicsController.js",
			"js/lib/jiglibjs2/physics/CachedImpulse.js",
			"js/lib/jiglibjs2/physics/HingeJoint.js",
			"js/lib/jiglibjs2/physics/BodyPair.js",
			"js/lib/jiglibjs2/physics/PhysicsState.js",
			"js/lib/jiglibjs2/physics/PhysicsSystem.js",
			"js/lib/jiglibjs2/physics/RigidBody.js",
			"js/lib/jiglibjs2/geometry/JSphere.js",
			"js/lib/jiglibjs2/geometry/JTriangleMesh.js",
			"js/lib/jiglibjs2/geometry/JPlane.js",
			"js/lib/jiglibjs2/geometry/JTerrain.js",
			"js/lib/jiglibjs2/geometry/JBox.js",
			"js/lib/jiglibjs2/geometry/JCapsule.js",
			"js/lib/jiglibjs2/vehicles/JChassis.js",
			"js/lib/jiglibjs2/vehicles/JWheel.js",
			"js/lib/jiglibjs2/vehicles/JCar.js",
			end JigLib 2 library */
			"js/game/workers/MenuMaker.js",
			"js/game/workers/ObjectMaker.js",
			"js/game/core/Physics.js",
			"js/game/core/World.js",
			"js/game/core/Player.js",
			"js/game/core/Character.js",
			"js/game/characters/Hero.js",
            "js/game/sections/IntroSection.js",
            { path: "assets/models/World_Head.js", type: 'model' },
			{ path: "assets/models/World_Tail.js", type: 'model' },
			{ path: "assets/models/Hero.js", type: 'model' },
			{ path: "assets/models/Hut.js", type: 'model' },
			{ path: "assets/models/Hut_Hill.js", type: 'model' },
			{ path: "assets/models/Hut_Steps.js", type: 'model' },
			{ path: "assets/models/Bed.js", type: 'model' },
			{ path: "assets/models/Banana_Leaf_Door.js", type: 'model' },
			{ path: "assets/models/Surfboard.js", type: 'model' },
			{ path: "assets/models/Palm_Tree.js", type: 'model' },
			{ path: "assets/models/Kukui_Tree.js", type: 'model' },
			{ path: "assets/models/Taro_Plant.js", type: 'model' },
			"assets/textures/skybox_world_posx.jpg",
            "assets/textures/skybox_world_negx.jpg",
			"assets/textures/skybox_world_posy.jpg",
            "assets/textures/skybox_world_negy.jpg",
			"assets/textures/skybox_world_posz.jpg",
            "assets/textures/skybox_world_negz.jpg"
        ],
		loadingHeader = 'Hold on, we need some stuff from Hawaii...';
		loadingTips = [
            ///////////////////////////////////////////// = bad sentence size
            "Aloha kaua means may there be friendship or love between us.",
            "Mahalo nui loa means thanks very much.",
            "Kali iki means wait a moment.",
            "Ko'u hoaloha means my friend.",
            "Kane means male or man.",
            "Wahine means female or woman.",
            "Ali'i kane means king or chieftan.",
            "Ali'i wahine means queen or chiefess.",
            "He mea ho'opa'ani means to play a game.",
            "Kai means sea or ocean.",
            "'opua means puffy clouds.",
			"Kai 'opua means clouds over the ocean.",
            "Iki means small or little.",
            "Nui means large or huge."
        ];
    
    /*===================================================
    
    public properties
    
    =====================================================*/
    
	// functions
	
    game.init = init;
    game.resume = resume;
    game.pause = pause;
    game.update_section_list = update_section_list;
	game.get_mouse = get_mouse;
	game.add_to_scene = add_to_scene;
	game.remove_from_scene = remove_from_scene;
	
	// getters and setters
	
	Object.defineProperty(game, 'domElement', { 
		get : function () { return domElement; }
	});
	
	Object.defineProperty(game, 'paused', { 
		get : function () { return paused; }
	});
	
	Object.defineProperty(game, 'scene', { 
		get : function () { return scene; },  
		set : set_scene
	});
	
	Object.defineProperty(game, 'sceneBG', { 
		get : function () { return sceneBG; },  
		set : set_scene_bg
	});
	
	Object.defineProperty(game, 'camera', { 
		get : function () { return camera; },  
		set : set_camera
	});
	
	Object.defineProperty(game, 'cameraBG', { 
		get : function () { return cameraBG; },  
		set : set_camera_bg
	});
    
    /*===================================================
    
    external init and loading
    
    =====================================================*/
    
    function init() {
		
		// set loading messages
		
		loader.loadingHeader = loadingHeader;
		loader.loadingTips = loadingTips;
        
        // start loading
		
		load_basics();
        
    }
	
	function load_basics () {
		
		loader.load( assetsBasic , function () {
			
            init_basics();
			
			load_launcher();
			
        });
		
	}
	
	function load_launcher () {
		
		loader.load( assetsLauncher , function () {
			
			init_launcher();
			
			load_game();
			
		});
	}
	
	function load_game () {
		
		// pause for short delay
		
		window.requestTimeout( function () {
			
			// show loader ui
			
			loader.ui_hide( false, 0);
			
			loader.ui_show( domElement );
			
			// start loading all game assets
			
			loader.load( assetsGame , function () {
				
				loader.ui_hide( true, undefined, function () {
					
					// get game ready to be started
					
					init_game();
					
				});
				
			});
			
		}, loadAssetsDelay);
		
	}
	
	/*===================================================
    
    init with basic assets
    
    =====================================================*/
    
    function init_basics () {
        
		var shaderScreen = THREE.ShaderExtras[ "screen" ],
            shaderFocusVignette = effects.FocusVignette;
			/*bg = effects.LinearGradient.generate( {
				colors: [0x0F042E, 0x1D508F, 0x529AD1, 0x529AD1, 0x455AE0],
				stops: [0, 0.4, 0.6, 0.8, 1.0],
				startBottom: true
			} )*/
		
		// modify THREE classes
		
		add_three_modifications();
		
        // transitioner
        transitioner = uihelper.make_ui_element({
            classes: 'transitioner'
        });
        
        // game signals
        shared.signals = shared.signals || {};
        shared.signals.paused = new signals.Signal();
        shared.signals.resumed = new signals.Signal();
        shared.signals.update = new signals.Signal();
		
		// renderer
        renderer = new THREE.WebGLRenderer( { antialias: false, clearColor: 0x000000, clearAlpha: 0/*, maxLights: 10 */} );
        renderer.setSize( shared.screenWidth, shared.screenHeight );
        renderer.autoClear = false;
		
		// shadows
		/*
		renderer.shadowCameraNear = 3;
		renderer.shadowCameraFar = 20000;
		renderer.shadowCameraFov = 90;
		
		renderer.shadowMapBias = 0.0039;
		renderer.shadowMapDarkness = 0.5;
		renderer.shadowMapWidth = 2048;
		renderer.shadowMapHeight = 2048;
		
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		*/
        // render target
        renderTarget = new THREE.WebGLRenderTarget( shared.screenWidth, shared.screenHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } );
        
        // share renderer
        shared.renderer = renderer;
        shared.renderTarget = renderTarget;
		
		// scenes
		
		sceneDefault = new THREE.Scene();
		sceneBGDefault = new THREE.Scene();
        
        
        // fog
		
		fog = new THREE.Fog( 0xffffff, -100, 10000 );
		
        sceneDefault.fog = fog;
		
		// camera
		
		cameraDefault = new THREE.PerspectiveCamera(60, shared.screenWidth / shared.screenHeight, 1, 10000);
		cameraBGDefault = new THREE.PerspectiveCamera(60, shared.screenWidth / shared.screenHeight, 1, 10000);
		
		cameraDefault.useQuaternion = cameraBGDefault.useQuaternion = true;
		
		// passes
        
        renderPasses = {
			bg: new THREE.RenderPass( sceneBGDefault, cameraBGDefault ),
            env: new THREE.RenderPass( sceneDefault, cameraDefault ),
            screen: new THREE.ShaderPass( shaderScreen ),
            focusVignette: new THREE.ShaderPass ( shaderFocusVignette )
        };
        
		// settings
		
		renderPasses.env.clear = false;
		
        renderPasses.screen.renderToScreen = true;
		
        renderPasses.focusVignette.uniforms[ "screenWidth" ].value = shared.screenWidth;
        renderPasses.focusVignette.uniforms[ "screenHeight" ].value = shared.screenHeight;
        renderPasses.focusVignette.uniforms[ "vingenettingOffset" ].value = 0.6;
        renderPasses.focusVignette.uniforms[ "vingenettingDarkening" ].value = 0.5;
        renderPasses.focusVignette.uniforms[ "sampleDistance" ].value = 0.2;
        renderPasses.focusVignette.uniforms[ "waveFactor" ].value = 0.3;
		
		// set default scene and camera
		
		set_default_cameras_scenes();
		
        // composer
        
        set_render_processing();
		
		// add renderer to game dom element
		
		domElement = shared.html.gameContainer;
		
        domElement.append( renderer.domElement );
		
		// resize
		
        shared.signals.windowresized.add(resize);
		resize(shared.screenWidth, shared.screenHeight);
        
		// start drawing
        
        animate();
		
    }
	
	function add_three_modifications () {
		
		// quaternion normalized lerp
		
		THREE.Quaternion.nlerp = function ( qa, qb, qr, t ) {
			
			var tFrom = 1 - t;
			
			qr.x = qa.x * tFrom + qb.x * t;
			qr.y = qa.y * tFrom + qb.y * t;
			qr.z = qa.z * tFrom + qb.z * t;
			qr.w = qa.w * tFrom + qb.w * t;
			
			qr.normalize();
			
			return qr;
			
		}
		
		// vector3 normalized lerp
		
		THREE.Vector3.nlerp = function ( va, vb, vr, t ) {
			
			var tFrom = 1 - t;
			
			vr.x = va.x * tFrom + vb.x * t;
			vr.y = va.y * tFrom + vb.y * t;
			vr.z = va.z * tFrom + vb.z * t;
			
			vr.normalize();
			
			return vr;
			
		}
		
	}
	
	/*===================================================
    
    init launcher
    
    =====================================================*/
	
	function init_launcher () {
		
		set_section( sections.launcher );
		
	}
	
	/*===================================================
    
    init game
    
    =====================================================*/
    
    function init_game () {
		
		// core
		
		init_core();
		
		// start menu
		
		init_start_menu();
		
    }
	
	function init_core () {
		
		// physics
		
		physics = core.physics;
		
		physics.init();
		
		// world
		
		world = core.world;
		
		world.init();
		
		// player
		
		player = core.player;
		
		player.init();
		
		// character
		
		character = core.character;
		
	}
	
	function init_start_menu () {
		var ms;
		
		// workers
        
        menumaker = game.workers.menumaker;
        
        // init start menu
        
        ms = menus.start = menumaker.make_menu( {
            id: 'start_menu',
            width: 260
        } );
        
        ms.add_item( menumaker.make_button( {
            id: 'Start', 
            callback: function () {
                start_game();
            },
            staticPosition: true,
            classes: 'item_big'
        } ) );
        ms.add_item( menumaker.make_button( {
            id: 'Continue', 
            callback: function () {},
            staticPosition: true,
            disabled: true
        } ) );
        ms.add_item( menumaker.make_button( {
            id: 'Options', 
            callback: function () {},
            staticPosition: true,
            disabled: true
        } ) );
        
        ms.ui_keep_centered();
        
        // hide instantly then show start menu
        
        ms.ui_hide( false, 0 );
        
        ms.ui_show( domElement );
        
	}
    
    /*===================================================
    
    start / stop game
    
    =====================================================*/
    
    function start_game () {
        var ms = menus.start;
		
		// hide static menu
		
		$(shared.html.staticMenu).fadeOut( transitionIn );
		
        // disable start menu
		
        ms.disable();
        
        // hide start menu
		
        ms.ui_hide( true );
        
        // set intro section
		
        set_section( sections.intro );
		
    }
	
	function stop_game () {
		
		// pause game
		
		pause();
		
		// show static menu
		
		$(shared.html.staticMenu).fadeIn( transitionOut );
        
        // show start menu
		
        ms.ui_show( domElement, undefined, function () {
			
			// enable start menu
			
			ms.enable();
			
		});
		
		// set launcher section
		
        set_section( sections.launcher );
		
	}
	
	/*===================================================
    
    render functions
    
    =====================================================*/
	
	function set_render_processing ( parameters ) {
		
		var i, l,
			requiredPasses = ['bg', 'env', 'screen'],
			passesNames,
			passName,
			bgPass = renderPasses.bg,
			envPass = renderPasses.env,
			defaultPassIndex;
		
		// handle parameters
		
		parameters = parameters || {};
		
		passesNames = parameters.passesNames;
		
		// init composer
		
		renderComposer = new THREE.EffectComposer( renderer );
		
		// check that passes camera and scene match current
		
		// bg
		
		if ( bgPass.scene !== sceneBG ) {
			bgPass.scene = sceneBG;
		}
		
		if ( bgPass.camera !== cameraBG ) {
			bgPass.camera = cameraBG;
		}
		
		// env
		
		if ( envPass.scene !== scene ) {
			envPass.scene = scene;
		}
		
		if ( envPass.camera !== camera ) {
			envPass.camera = camera;
		}
		
		// if should use default passes
		
		if ( typeof passesNames === 'undefined' || passesNames.hasOwnProperty('length') === false ) {
			
			passesNames = [];
			
		}
		
		// if names includes bg, remove
		
		defaultPassIndex = passesNames.indexOf( 'bg' );
		
		if ( defaultPassIndex !== -1 ) {
			
			passesNames.splice( defaultPassIndex, 1 );
			
		}
		
		// if names includes env, remove
		
		defaultPassIndex = passesNames.indexOf( 'env' );
		
		if ( defaultPassIndex !== -1 ) {
			
			passesNames.splice( defaultPassIndex, 1 );
			
		}
		
		// if names includes screen, remove
		
		defaultPassIndex = passesNames.indexOf( 'screen' );
		
		if ( defaultPassIndex !== -1 ) {
			
			passesNames.splice( defaultPassIndex, 1 );
			
		}
		
		// add required passes to beginning
		
		passesNames = requiredPasses.concat(passesNames);
        
		// add each pass in passes names
		
		for ( i = 0, l = passesNames.length; i < l; i += 1 ) {
			
			passName = passesNames[ i ];
			
			if ( typeof renderPasses[ passName ] !== 'undefined' ) {
				
				renderComposer.addPass( renderPasses[ passName ] );
				
			}
			
		}
		
	}
	
	/*===================================================
    
    scene functions
    
    =====================================================*/
	
	function set_scene ( sceneNew ) {
		
		var scenePrev = scene;
		
		renderPasses.env.scene = scene = sceneNew || sceneDefault;
		
		if( scene !== scenePrev && typeof camera !== 'undefined') {
			
			if ( typeof scenePrev !== 'undefined' ) {
				console.log('rem s1');
				scenePrev.remove( camera );
			}
			console.log('add s1');
			scene.add( camera );
			
		}
		
	}
	
	function set_scene_bg ( sceneNew ) {
		
		var sceneBGPrev = sceneBG;
		
		renderPasses.bg.scene = sceneBG = sceneNew || sceneBGDefault;
		
		if( sceneBG !== sceneBGPrev && typeof cameraBG !== 'undefined') {
			
			if ( typeof sceneBGPrev !== 'undefined' ) {
				console.log('rem s2');
				sceneBGPrev.remove( cameraBG );
			}
			
			console.log('add s2');
			sceneBG.add( cameraBG );
			
		}
		
	}
	
	function add_to_scene ( objects, sceneTarget ) {
		
		var i, l, object;
		
		if ( objects.hasOwnProperty('length') === false ) {
			objects = [ objects ];
		}
		
		sceneTarget = sceneTarget || scene;
		
		for ( i = 0, l = objects.length; i < l; i += 1 ) {
			
			object = objects[ i ];
			
			// if is character
			
			if ( typeof object.model !== 'undefined' ) {
				
				object = object.model;
				
			}
			
			if ( typeof object.mesh !== 'undefined' ) {
			
				sceneTarget.add( object.mesh );
				
				if ( typeof object.rigidBody !== 'undefined' ) {
					
					physics.add( object.mesh, { rigidBody: object.rigidBody } );
					
				}
				
			}
			else {
				
				sceneTarget.add( object );
				
			}
			
        }
		
	}
	
	function remove_from_scene ( objects, sceneTarget ) {
		
		var i, l, object;
		
		if ( objects.hasOwnProperty('length') === false ) {
			objects = [ objects ];
		}
		
		sceneTarget = sceneTarget || scene;
		
		for ( i = 0, l = objects.length; i < l; i += 1 ) {
		
			object = objects[ i ];
			
			// if is character
			
			if ( typeof object.model !== 'undefined' ) {
				
				object = object.model;
				
			}
			
			if ( typeof object.mesh !== 'undefined' ) {
			
				sceneTarget.remove( object.mesh );
			
				if ( typeof object.rigidBody !== 'undefined' ) {
					
					physics.remove( object.mesh );
					
				}
				
			}
			else {
				
				sceneTarget.remove( object );
				
			}
			
        }
		
	}
	
	/*===================================================
    
    camera functions
    
    =====================================================*/
	
	function set_camera ( cameraNew ) {
		
		var cameraPrev = camera;
		
		if ( typeof cameraPrev !== 'undefined' && typeof scene !== 'undefined' ) {
			console.log('rem c1');
			scene.remove( cameraPrev );
			
		}
		
		renderPasses.env.camera = camera = cameraNew || cameraDefault;
		
		if ( typeof scene !== 'undefined' ) {
			console.log('add c1');
			scene.add( camera );
			
		}
		
	}
	
	function set_camera_bg ( cameraNew ) {
		
		var cameraBGPrev = cameraBG;
		
		if ( typeof cameraBGPrev !== 'undefined' && typeof sceneBG !== 'undefined' ) {
			console.log('rem c2');
			sceneBG.remove( cameraBGPrev );
			
		}
		
		renderPasses.bg.camera = cameraBG = cameraNew || cameraBGDefault;
		
		if ( typeof sceneBG !== 'undefined' ) {
			console.log('add c2');
			sceneBG.add( cameraBG );
			
		}
		
	}
	
	/*===================================================
    
    mouse functions
    
    =====================================================*/
	
	function get_mouse ( parameters ) {
		
		var mouse;
		
		if ( typeof parameters === 'number' ) {
			
			mouse = shared.mice[ parameters ];
			
		}
		else if ( typeof parameters === 'object' && parameters.hasOwnProperty( 'mouseIndex' ) ) {
			
			mouse = shared.mice[ parameters.mouseIndex ];
			
		}
		else {
			
			mouse = shared.mice[ 0 ];
			
		}
		
		return mouse;
	}
	
    /*===================================================
    
    section functions
    
    =====================================================*/
	
	function set_default_cameras_scenes () {
		
		set_scene();
		set_scene_bg();
		
		set_camera();
		set_camera_bg();
		
	}
    
    function update_section_list () {
        var i, l,
            name,
            prevNames = sectionNames.slice(0);
        
        // reset names
        
        sectionNames = [];
        
        // get all names
        
        for ( name in sections ) {
           if ( sections.hasOwnProperty( name ) ) {
               sectionNames.push( name );
           }
        }
        
    }

    function set_section ( section ) {
		
        // hide current section
        if (typeof currentSection !== 'undefined') {
            
            previousSection = currentSection;
            
            previousSection.hide();
            
            $(domElement).append(transitioner.domElement);
            
            $(transitioner.domElement).fadeTo(transitionIn, 1).promise().done( function () {
                
                $(transitioner.domElement).detach();
                
                previousSection.remove();
                
            });
            
        }
		
        // no current section
		
        currentSection = undefined;
		
		// default scene and camera
		
		set_default_cameras_scenes();	
        
        // start and show new section
        if (typeof section !== 'undefined') {
			
            // wait for transitioner to finish fading in
            $(transitioner.domElement).promise().done(function () {
				
                $(domElement).append(transitioner.domElement);
				
                section.init();
				
				section.resize(shared.screenWidth, shared.screenHeight);
				
                section.show();
				
                currentSection = section;
                
                $(transitioner.domElement).fadeTo(transitionOut, 0).promise().done(function () {
                    $(transitioner.domElement).detach();
                });
                
            });
            
        }
		
    }
    
    function pause () {
        if (paused === false) {
            
            paused = true;
            
            shared.signals.paused.dispatch();
            
        }
    }
    
    function resume () {
        if (paused === true) {
            
            paused = false;
            
            shared.signals.resumed.dispatch();
            
        }
    }
    
    function animate () {
    
    	var timeDelta;
        
        requestAnimationFrame( animate );
		
		// handle time
		
		shared.timeLast = shared.time;
		
		shared.time = new Date().getTime();
		
		timeDelta = shared.time - shared.timeLast;
		
		// update
		
		if ( paused !== true ) {
			
			// update physics
			
			if ( typeof physics !== 'undefined' ) {
				physics.update( timeDelta );
			}
			
			// update all others
			
			shared.signals.update.dispatch( timeDelta );
			
		}
		
		// have camera bg mimic camera rotation
		
		cameraBG.quaternion.copy( camera.quaternion );
		
		// render
        
        renderer.setViewport( 0, 0, shared.screenWidth, shared.screenHeight );

        renderer.clear();
        
		renderComposer.render();
		
    }
    
    function resize( W, H ) {
		
		// render passes
		
		renderPasses.focusVignette.uniforms[ "screenWidth" ].value = W;
        renderPasses.focusVignette.uniforms[ "screenHeight" ].value = H;
        
        // renderer
		
        renderer.setSize( W, H );
        renderTarget.width = W;
        renderTarget.height = H;
		
		// cameras
		
		camera.aspect = W / H;
        camera.updateProjectionMatrix();
		
		cameraBG.aspect = W / H;
        cameraBG.updateProjectionMatrix();
        
		// composer
		
        renderComposer.reset();
        
    }
        
    return main; 
    
}(KAIOPUA || {}));