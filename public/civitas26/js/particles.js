/* ============================================================
   CIVITAS'26 — Atmospheric Particles (particles.js)
   Subtle floating dust motes for the void / idea phase.
   ============================================================ */
(function () {
    'use strict';

    var scene    = window.CIVITAS.scene;
    var isMobile = window.CIVITAS.isMobile;

    var COUNT  = isMobile ? 180 : 700;
    var SPREAD = 28;

    // ── Geometry ───────────────────────────────────────────────
    var geometry   = new THREE.BufferGeometry();
    var positions  = new Float32Array(COUNT * 3);
    var velocities = new Float32Array(COUNT * 3);

    for (var i = 0; i < COUNT; i++) {
        var i3 = i * 3;
        positions[i3]     = (Math.random() - 0.5) * SPREAD;
        positions[i3 + 1] = (Math.random() - 0.5) * SPREAD;
        positions[i3 + 2] = (Math.random() - 0.5) * SPREAD;

        velocities[i3]     = (Math.random() - 0.5) * 0.003;
        velocities[i3 + 1] = Math.random() * 0.002 + 0.0005;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // ── Material ──────────────────────────────────────────────
    var material = new THREE.PointsMaterial({
        color:           0x55bbff,
        size:            isMobile ? 0.055 : 0.038,
        transparent:     true,
        opacity:         0.75,
        sizeAttenuation: true,
        depthWrite:      false
    });

    var points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Animation callback ────────────────────────────────────
    function update(dt, elapsed) {
        if (material.opacity <= 0) return;           // skip when invisible
        var arr  = geometry.attributes.position.array;
        var half = SPREAD / 2;
        for (var i = 0; i < COUNT; i++) {
            var i3 = i * 3;
            // Base velocity
            arr[i3]     += velocities[i3];
            arr[i3 + 1] += velocities[i3 + 1];
            arr[i3 + 2] += velocities[i3 + 2];

            // Subtle sine drift
            arr[i3] += Math.sin(elapsed * 0.25 + i * 0.1) * 0.0004;

            // Wrap boundaries
            if (arr[i3 + 1] >  half) arr[i3 + 1] = -half;
            if (arr[i3]     >  half) arr[i3]      = -half;
            if (arr[i3]     < -half) arr[i3]      =  half;
            if (arr[i3 + 2] >  half) arr[i3 + 2]  = -half;
            if (arr[i3 + 2] < -half) arr[i3 + 2]  =  half;
        }
        geometry.attributes.position.needsUpdate = true;
    }

    window.CIVITAS.addRenderCallback(update);

    // ── Public API ────────────────────────────────────────────
    window.CIVITAS.particles = {
        mesh:     points,
        material: material,
        setOpacity: function (v) { material.opacity = v; },
        setVisible: function (v) { points.visible = v; }
    };
})();
