/* ============================================================
   CIVITAS'26 — Scene Module (scene.js)
   Three.js renderer, camera, lighting, fog, performance flags
   ============================================================ */
(function () {
    'use strict';

    // ── Performance detection ──────────────────────────────────
    function detectMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
               || window.innerWidth < 768;
    }
    var isMobile = detectMobile();
    var isLowEnd = navigator.hardwareConcurrency
                   ? navigator.hardwareConcurrency <= 4
                   : false;

    // ── Renderer ───────────────────────────────────────────────
    var canvas   = document.getElementById('webgl-canvas');
    var renderer = new THREE.WebGLRenderer({
        canvas:          canvas,
        antialias:       !isMobile,
        alpha:           false,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    // Shadows
    renderer.shadowMap.enabled = !isMobile;
    if (renderer.shadowMap.enabled) {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // Tone mapping
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.2;

    // Color space (r150+ uses outputColorSpace)
    if (typeof THREE.SRGBColorSpace !== 'undefined') {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (typeof THREE.sRGBEncoding !== 'undefined') {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // ── Scene ──────────────────────────────────────────────────
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1a38);   // lighter dark navy

    var fog = null;
    if (!isLowEnd) {
        fog = new THREE.FogExp2(0x0d1a38, 0.007);
        scene.fog = fog;
    }

    // ── Camera ─────────────────────────────────────────────────
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        250
    );
    // Adjust camera for mobile — zoom out much more to show full text
    var camZ = isMobile ? 16 : 8;
    camera.position.set(0, 0.5, camZ);
    camera.lookAt(0, 0, 0);

    // ── Lighting ───────────────────────────────────────────────
    // Ambient fill
    // Neutral white ambient — no blue cast
    var ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Primary directional — pure white, strongly front-lit
    var dirLight = new THREE.DirectionalLight(0xffffff, 4.0);
    dirLight.position.set(5, 10, 12);
    if (renderer.shadowMap.enabled) {
        dirLight.castShadow              = true;
        dirLight.shadow.mapSize.width    = isMobile ? 512 : 1024;
        dirLight.shadow.mapSize.height   = isMobile ? 512 : 1024;
        dirLight.shadow.camera.near      = 1;
        dirLight.shadow.camera.far       = 80;
        dirLight.shadow.camera.left      = -30;
        dirLight.shadow.camera.right     = 30;
        dirLight.shadow.camera.top       = 20;
        dirLight.shadow.camera.bottom    = -10;
        dirLight.shadow.bias             = -0.0008;
    }
    scene.add(dirLight);

    // Subtle cool rim for edge definition
    var rimLight = new THREE.DirectionalLight(0xaaddff, 0.6);
    rimLight.position.set(-8, 3, -6);
    scene.add(rimLight);

    // Close-up point light — harsh bright white on voxel faces
    var voxelLight = new THREE.PointLight(0xffffff, 18.0, 40);
    voxelLight.position.set(0, 0, 6);
    scene.add(voxelLight);

    // ── Resize handler ─────────────────────────────────────────
    function onResize() {
        var w = window.innerWidth, h = window.innerHeight;
        var wasMobile = isMobile;
        isMobile = detectMobile();
        
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        
        // Update global isMobile flag
        if (window.CIVITAS) {
            window.CIVITAS.isMobile = isMobile;
        }
        
        // Notify if mobile state changed
        if (wasMobile !== isMobile && window.CIVITAS && window.CIVITAS.onMobileChange) {
            window.CIVITAS.onMobileChange(isMobile);
        }
    }
    window.addEventListener('resize', onResize);

    // ── Render loop ────────────────────────────────────────────
    var renderCallbacks = [];
    var clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        var dt      = clock.getDelta();
        var elapsed = clock.getElapsedTime();
        for (var i = 0; i < renderCallbacks.length; i++) {
            renderCallbacks[i](dt, elapsed);
        }
        renderer.render(scene, camera);
    }
    animate();

    // ── Public API ─────────────────────────────────────────────
    window.CIVITAS = {
        renderer:     renderer,
        scene:        scene,
        camera:       camera,
        canvas:       canvas,
        ambientLight: ambientLight,
        dirLight:     dirLight,
        rimLight:     rimLight,
        fog:          fog,
        isMobile:     isMobile,
        isLowEnd:     isLowEnd,
        clock:        clock,
        addRenderCallback: function (cb) {
            renderCallbacks.push(cb);
        },
        removeRenderCallback: function (cb) {
            var idx = renderCallbacks.indexOf(cb);
            if (idx !== -1) renderCallbacks.splice(idx, 1);
        }
    };
})();
