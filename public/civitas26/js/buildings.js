/* ============================================================
   CIVITAS'26 — Building Systems (buildings.js)

   Procedural text voxels  → structural morph → building geometry
   Architectural detailing → sky bridges → courtyard → landscape

   Inspired by POD academic buildings at IIT Indore.
   Organic modern architecture: smooth white surfaces, rounded
   edges, slit-style windows, horizontal layered bands.

   All geometry is generated from geometric rules.
   No model loading. No image extrusion.
   Target polygon count: < 200k.
   ============================================================ */
(function () {
    'use strict';

    var scene    = window.CIVITAS.scene;
    var isMobile = window.CIVITAS.isMobile;
    var isLowEnd = window.CIVITAS.isLowEnd;

    /* ═══════════════════════════════════════════════════════════
       CONSTANTS  (1 unit ≈ 5 m)
       ═══════════════════════════════════════════════════════════ */
    var B_LENGTH  = 24;       // building length   (X)  ≈ 120 m
    var B_WIDTH   = 5.6;      // building width    (Z)  ≈  28 m
    var B_HEIGHT  = 4.8;      // building height   (Y)  ≈  24 m (5 storeys)
    var STOREY    = 0.96;     // one storey height       ≈ 4.8 m
    var COURTYARD = 4.4;      // courtyard gap     (Z)  ≈  22 m
    var FILLET    = 0.9;      // corner radius          ≈ 4.5 m
    var SLAB_PROJ = 0.2;      // slab overhang          ≈ 1 m

    // Floor band constants
    var BAND_H    = 0.055;    // band height             ≈ 0.28 m
    var BAND_D    = 0.06;     // band thickness           ≈ 0.30 m

    // ── Alternating tilted floor plate offset ─────────────────
    // POD buildings feature alternating left-right floor shifts
    // creating a wave-like stacked appearance. ~1.0 m (0.2 units)
    var TILT      = 0.20;     // tilt offset per floor   ≈ 1.0 m

    // Returns X offset for a given floor index (0-based).
    // Even floors shift right, odd floors shift left.
    // Floor 0 (ground) gets minimal offset for stability.
    function floorOffset(floorIdx) {
        if (floorIdx === 0) return 0;  // ground floor stays centred
        var dir = (floorIdx % 2 === 0) ? 1 : -1;
        return dir * TILT;
    }

    // Building-centre Z positions
    var BZ_A = -(COURTYARD / 2 + B_WIDTH / 2);   // −5.0
    var BZ_B =  (COURTYARD / 2 + B_WIDTH / 2);   // +5.0

    /* ═══════════════════════════════════════════════════════════
       UTILITIES
       ═══════════════════════════════════════════════════════════ */
    function lerp(a, b, t) { return a + (b - a) * t; }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    // Deterministic pseudo-random (0-1) from seed
    function srand(seed) {
        var x = Math.sin(seed * 9301 + 49297) * 49297;
        return x - Math.floor(x);
    }

    /* ═══════════════════════════════════════════════════════════
       SECTION 1 — TEXT VOXEL SYSTEM
       ═══════════════════════════════════════════════════════════ */

    // ── 1a. Sample text pixels from an off-screen canvas ──────
    function sampleText() {
        var W = 320, H = 80;
        var cvs = document.createElement('canvas');
        cvs.width = W; cvs.height = H;
        var ctx = cvs.getContext('2d');

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle    = '#fff';
        ctx.font         = isMobile ? 'bold 32px Arial, Helvetica, sans-serif' : 'bold 52px Arial, Helvetica, sans-serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("CIVITAS'26", W / 2, H / 2);

        var img  = ctx.getImageData(0, 0, W, H).data;
        var step = isMobile ? 2 : 3;     // mobile: better detail (less decimation)
        var sc   = 10 / W;               // text ≈ 10 world-units wide
        var out  = [];

        for (var y = 0; y < H; y += step) {
            for (var x = 0; x < W; x += step) {
                if (img[(y * W + x) * 4] > 128) {
                    out.push({
                        x:   (x - W / 2) * sc,
                        y:   (H / 2 - y) * sc,    // flip Y
                        z:   0,
                        row: Math.floor(y / (H / 6))
                    });
                }
            }
        }
        return out;
    }

    // ── 1b. Phase-2 targets — structural slab grid ────────────
    function makePhase2(src) {
        var layers = 6;
        var minY = Infinity, maxY = -Infinity;
        for (var i = 0; i < src.length; i++) {
            if (src[i].y < minY) minY = src[i].y;
            if (src[i].y > maxY) maxY = src[i].y;
        }
        var range  = (maxY - minY) || 1;
        var layerH = range / layers;
        var beamSp = 2.0;
        var out = [];

        for (var i = 0; i < src.length; i++) {
            var p  = src[i];
            var li = Math.min(layers - 1, Math.floor((p.y - minY) / layerH));
            var ty = (li - layers / 2 + 0.5) * 1.4;     // separate layers
            var tx = p.x * 1.35;                          // widen horizontally
            // Snap toward beam grid (vertical divisions)
            var snap = Math.round(tx / beamSp) * beamSp;
            tx = lerp(tx, snap, 0.3);
            var tz = srand(i * 37) * 0.35 - 0.175;
            out.push({ x: tx, y: ty, z: tz });
        }
        return out;
    }

    // ── 1c. Phase-3 targets — building-volume surface ─────────
    function makePhase3(src) {
        var half = Math.floor(src.length / 2);
        var out  = [];

        for (var i = 0; i < src.length; i++) {
            var isA        = i < half;
            var bz         = isA ? BZ_A : BZ_B;
            var localIdx   = isA ? i : i - half;
            var localTotal = isA ? half : src.length - half;
            var t          = localIdx / localTotal;

            var fl = B_LENGTH - 2 * FILLET;           // flat front length
            var sl = B_WIDTH  - 2 * FILLET;           // flat side length
            var perim = 2 * (fl + sl);
            var d = t * perim;

            var tx, tz;
            if (d < fl) {
                tx = -fl / 2 + d;
                tz = bz - B_WIDTH / 2;
            } else if (d < fl + sl) {
                tx = fl / 2;
                tz = bz - B_WIDTH / 2 + (d - fl);
            } else if (d < 2 * fl + sl) {
                tx = fl / 2 - (d - fl - sl);
                tz = bz + B_WIDTH / 2;
            } else {
                tx = -fl / 2;
                tz = bz + B_WIDTH / 2 - (d - 2 * fl - sl);
            }
            var ty = srand(i * 53) * B_HEIGHT;
            out.push({ x: tx, y: ty, z: tz });
        }
        return out;
    }

    // ── 1d. Create InstancedMesh ──────────────────────────────
    var textPositions, p2Targets, p3Targets;
    var instCount, instMesh, dummy;

    function createTextInstances() {
        textPositions = sampleText();
        instCount     = textPositions.length;
        p2Targets     = makePhase2(textPositions);
        p3Targets     = makePhase3(textPositions);

        var sz  = isMobile ? 0.08 : 0.12;   // smaller on mobile for more detailed text
        var geo = new THREE.BoxGeometry(sz, sz, sz * 0.5);
        var mat = new THREE.MeshStandardMaterial({
            color:        0xffffff,
            roughness:    0.05,
            metalness:    0.0,
            emissive:     new THREE.Color(0xffffff),  // white self-glow
            emissiveIntensity: 1.2,
            transparent:  true,
            opacity:      1.0
        });

        instMesh = new THREE.InstancedMesh(geo, mat, instCount);
        instMesh.castShadow    = true;
        instMesh.receiveShadow = true;
        dummy = new THREE.Object3D();

        for (var i = 0; i < instCount; i++) {
            dummy.position.set(
                textPositions[i].x,
                textPositions[i].y,
                textPositions[i].z
            );
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            instMesh.setMatrixAt(i, dummy.matrix);
        }
        instMesh.instanceMatrix.needsUpdate = true;
        scene.add(instMesh);
    }

    // ── 1e. Update morph each frame (scroll-driven) ───────────
    function updateMorph(progress) {
        if (!instMesh) return;
        if (progress > 0.66) { instMesh.visible = false; return; }

        for (var i = 0; i < instCount; i++) {
            var px, py, pz, s = 1;

            if (progress <= 0.15) {
                // Phase 1 — text
                px = textPositions[i].x;
                py = textPositions[i].y;
                pz = textPositions[i].z;

            } else if (progress <= 0.35) {
                // Phase 2 — text → structural grid
                var t2 = easeInOutCubic((progress - 0.15) / 0.20);
                px = lerp(textPositions[i].x, p2Targets[i].x, t2);
                py = lerp(textPositions[i].y, p2Targets[i].y, t2);
                pz = lerp(textPositions[i].z, p2Targets[i].z, t2);

            } else if (progress <= 0.55) {
                // Phase 3 — structural grid → building volumes
                var t3 = easeInOutCubic(clamp((progress - 0.35) / 0.20, 0, 1));
                px = lerp(p2Targets[i].x, p3Targets[i].x, t3);
                py = lerp(p2Targets[i].y, p3Targets[i].y, t3);
                pz = lerp(p2Targets[i].z, p3Targets[i].z, t3);

            } else {
                // Settled — fade out as real building geometry appears
                px = p3Targets[i].x;
                py = p3Targets[i].y;
                pz = p3Targets[i].z;
                s  = 1 - clamp((progress - 0.55) / 0.10, 0, 1);
            }

            dummy.position.set(px, py, pz);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            instMesh.setMatrixAt(i, dummy.matrix);
        }
        instMesh.instanceMatrix.needsUpdate = true;
        instMesh.visible = true;
    }

    /* ═══════════════════════════════════════════════════════════
       SECTION 2 — BUILDING GEOMETRY (Upgraded)
       FacadeSystem, WindowSystem, BridgeSystem, Courtyard,
       RooftopDetails, Landscape — all modular subsystems
       ═══════════════════════════════════════════════════════════ */

    // ── Rounded-rectangle Shape (floor plan in XY) ────────────
    // Used for building mass, slabs, and floor bands
    function rrShape(w, d, r) {
        var s  = new THREE.Shape();
        var hw = w / 2, hd = d / 2;
        r = Math.min(r, hw, hd);
        s.moveTo(-hw + r, -hd);
        s.lineTo( hw - r, -hd);
        s.quadraticCurveTo( hw, -hd,  hw, -hd + r);
        s.lineTo( hw,  hd - r);
        s.quadraticCurveTo( hw,  hd,  hw - r,  hd);
        s.lineTo(-hw + r,  hd);
        s.quadraticCurveTo(-hw,  hd, -hw,  hd - r);
        s.lineTo(-hw, -hd + r);
        s.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
        return s;
    }

    // ── Groups ────────────────────────────────────────────────
    var buildingGrp  = new THREE.Group();
    var detailGrp    = new THREE.Group();
    var bridgeGrp    = new THREE.Group();
    var courtyardGrp = new THREE.Group();
    var landscapeGrp = new THREE.Group();   // NEW: trees, poles, grass

    buildingGrp.visible  = false;
    detailGrp.visible    = false;
    bridgeGrp.visible    = false;
    courtyardGrp.visible = false;
    landscapeGrp.visible = false;

    scene.add(buildingGrp);
    scene.add(detailGrp);
    scene.add(bridgeGrp);
    scene.add(courtyardGrp);
    scene.add(landscapeGrp);

    // ── Rotate all groups 90° on Y-axis for side/drone view ───
    var ROT_Y = Math.PI / 2;
    buildingGrp.rotation.y  = ROT_Y;
    detailGrp.rotation.y    = ROT_Y;
    bridgeGrp.rotation.y    = ROT_Y;
    courtyardGrp.rotation.y = ROT_Y;
    landscapeGrp.rotation.y = ROT_Y;

    /* ── Material System ───────────────────────────────────────
       All materials start transparent (opacity: 0) and are
       driven by the scroll-based updateVisibility() function.
       ──────────────────────────────────────────────────────── */

    // Facade — warm off-white, slightly rough plaster
    var facadeMat = new THREE.MeshStandardMaterial({
        color: 0xf0efe8, roughness: 0.75, metalness: 0.0,
        transparent: true, opacity: 0
    });

    // Floor slab overhangs — slightly warmer
    var slabMat = new THREE.MeshStandardMaterial({
        color: 0xeae9e2, roughness: 0.80, metalness: 0.0,
        transparent: true, opacity: 0
    });

    // Floor bands — dark charcoal recessed strips
    var bandMat = new THREE.MeshStandardMaterial({
        color: 0x2a2e35, roughness: 0.60, metalness: 0.05,
        transparent: true, opacity: 0
    });

    // Windows — dark grey / black, slightly reflective
    var winMat = new THREE.MeshStandardMaterial({
        color: 0x1a2a3a, roughness: 0.30, metalness: 0.30,
        transparent: true, opacity: 0
    });

    // Continuous ribbon glazing — very dark
    var ribbonMat = new THREE.MeshStandardMaterial({
        color: 0x0a1520, roughness: 0.20, metalness: 0.40,
        transparent: true, opacity: 0
    });

    // Facade voids — deep dark
    var voidMat = new THREE.MeshStandardMaterial({
        color: 0x0d1218, roughness: 0.40, metalness: 0.10,
        transparent: true, opacity: 0
    });

    // Ground floor glass — transparent with reflection
    var glassMat = new THREE.MeshStandardMaterial({
        color: 0x88bbcc, roughness: 0.05, metalness: 0.80,
        transparent: true, opacity: 0
    });

    // Ground floor structural columns
    var columnMat = new THREE.MeshStandardMaterial({
        color: 0xe0dfd8, roughness: 0.65, metalness: 0.0,
        transparent: true, opacity: 0
    });

    // Bridge deck — concrete tone
    var bridgeMat = new THREE.MeshStandardMaterial({
        color: 0xd8d4c8, roughness: 0.60, metalness: 0.05,
        transparent: true, opacity: 0
    });

    // Bridge railings — steel grey
    var railMat = new THREE.MeshStandardMaterial({
        color: 0x667788, roughness: 0.30, metalness: 0.55,
        transparent: true, opacity: 0
    });

    // Courtyard paving — warm brown stone
    var courtMat = new THREE.MeshStandardMaterial({
        color: 0x8b7a6a, roughness: 0.85, metalness: 0.0,
        transparent: true, opacity: 0
    });
    // Red walking path
    var pathMat = new THREE.MeshStandardMaterial({
        color: 0x8b3a2a, roughness: 0.70, metalness: 0.0,
        transparent: true, opacity: 0
    });
    // Planting beds
    var plantMat = new THREE.MeshStandardMaterial({
        color: 0x3a5a3a, roughness: 0.90, metalness: 0.0,
        transparent: true, opacity: 0
    });
    // Ground plane
    var groundMat = new THREE.MeshStandardMaterial({
        color: 0x1a1e28, roughness: 1.0, metalness: 0.0,
        transparent: true, opacity: 0
    });

    // Rooftop equipment / parapet
    var rooftopMat = new THREE.MeshStandardMaterial({
        color: 0xc8c6be, roughness: 0.70, metalness: 0.10,
        transparent: true, opacity: 0
    });

    // Tree canopy — dark green
    var canopyMat = new THREE.MeshStandardMaterial({
        color: 0x2d5a30, roughness: 0.85, metalness: 0.0,
        transparent: true, opacity: 0
    });
    // Tree trunk
    var trunkMat = new THREE.MeshStandardMaterial({
        color: 0x5a4030, roughness: 0.90, metalness: 0.0,
        transparent: true, opacity: 0
    });
    // Light poles
    var poleMat = new THREE.MeshStandardMaterial({
        color: 0x555555, roughness: 0.40, metalness: 0.60,
        transparent: true, opacity: 0
    });
    // Grey pavement tiles
    var pavementMat = new THREE.MeshStandardMaterial({
        color: 0x555a60, roughness: 0.80, metalness: 0.0,
        transparent: true, opacity: 0
    });


    /* ───────────────────────────────────────────────────────────
       2a. FACADE SYSTEM — Per-floor bodies with alternating tilt
       Each floor is an individual slab module offset along X,
       alternating left/right to create the POD wave facade.
       Reuses a single geometry, only position changes per floor.
       ──────────────────────────────────────────────────────── */
    function createBodies() {
        // Single-storey slab geometry (reused 5× per building)
        var shape = rrShape(B_LENGTH, B_WIDTH, FILLET);
        var geo   = new THREE.ExtrudeGeometry(shape, {
            depth: STOREY, bevelEnabled: false
        });
        geo.rotateX(-Math.PI / 2);

        [BZ_A, BZ_B].forEach(function (bz) {
            for (var s = 0; s < 5; s++) {
                var body = new THREE.Mesh(geo, facadeMat);
                body.position.set(floorOffset(s), s * STOREY, bz);
                body.castShadow = true;
                body.receiveShadow = true;
                buildingGrp.add(body);
            }
        });
        // Total: 5 floors × 2 buildings = 10 meshes (reused geo)
    }


    /* ───────────────────────────────────────────────────────────
       2b. FLOOR BANDS — Dark recessed horizontal strips
       Continuous charcoal bands at each floor junction,
       placed on all 4 faces of each building.
       Creates the signature layered-slab appearance.
       ──────────────────────────────────────────────────────── */
    function createFloorBands() {
        // Geometry for long faces (front/back)
        var longGeo = new THREE.BoxGeometry(
            B_LENGTH - 2 * FILLET + 0.2,
            BAND_H,
            BAND_D
        );
        // Geometry for short faces (sides)
        var shortGeo = new THREE.BoxGeometry(
            BAND_D,
            BAND_H,
            B_WIDTH - 2 * FILLET + 0.2
        );

        [BZ_A, BZ_B].forEach(function (bz) {
            for (var s = 1; s <= 5; s++) {
                var y  = s * STOREY - BAND_H * 0.5;
                // Band sits between floor s-1 and floor s.
                // Average the offset of adjacent floors for smooth transition.
                var ox = (floorOffset(s - 1) + floorOffset(Math.min(s, 4))) * 0.5;

                var f = new THREE.Mesh(longGeo, bandMat);
                f.position.set(ox, y, bz - B_WIDTH / 2 - BAND_D * 0.5 + 0.005);
                detailGrp.add(f);

                var b = new THREE.Mesh(longGeo, bandMat);
                b.position.set(ox, y, bz + B_WIDTH / 2 + BAND_D * 0.5 - 0.005);
                detailGrp.add(b);

                var l = new THREE.Mesh(shortGeo, bandMat);
                l.position.set(ox - B_LENGTH / 2 - BAND_D * 0.5 + 0.005, y, bz);
                detailGrp.add(l);

                var r = new THREE.Mesh(shortGeo, bandMat);
                r.position.set(ox + B_LENGTH / 2 + BAND_D * 0.5 - 0.005, y, bz);
                detailGrp.add(r);
            }
        });
    }


    /* ───────────────────────────────────────────────────────────
       2c. SLAB PROJECTIONS — Floor overhangs
       Slightly projecting slab edges at each storey, creating
       shadow lines and horizontal rhythm.
       ──────────────────────────────────────────────────────── */
    function createSlabs() {
        var shape = rrShape(
            B_LENGTH + 2 * SLAB_PROJ,
            B_WIDTH  + 2 * SLAB_PROJ,
            FILLET   + SLAB_PROJ
        );
        var geo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.06, bevelEnabled: false
        });
        geo.rotateX(-Math.PI / 2);

        // Slab at each storey line follows the floor's tilt offset
        for (var s = 0; s <= 5; s++) {
            var y  = s * STOREY;
            var ox = floorOffset(Math.min(s, 4));  // clamp to valid floor

            var a = new THREE.Mesh(geo, slabMat);
            a.position.set(ox, y, BZ_A);
            a.castShadow = true;
            detailGrp.add(a);

            var b = new THREE.Mesh(geo.clone(), slabMat);
            b.position.set(ox, y, BZ_B);
            b.castShadow = true;
            detailGrp.add(b);
        }
    }


    /* ───────────────────────────────────────────────────────────
       2d. GROUND FLOOR — Columns + glass panels + lobby entries
       Ground storey appears more open with structural columns
       and transparent glass facade segments.
       ──────────────────────────────────────────────────────── */
    function createGroundFloor() {
        var colRadius = 0.06;
        var colHeight = STOREY - 0.06;
        var colGeo    = new THREE.CylinderGeometry(colRadius, colRadius, colHeight, 8);
        var colSpacing = 2.4;
        var ox0 = floorOffset(0);  // ground floor offset (0)

        var glassH = colHeight * 0.75;
        var glassGeo = new THREE.BoxGeometry(colSpacing - 0.3, glassH, 0.02);

        [BZ_A, BZ_B].forEach(function (bz) {
            var xMin = -B_LENGTH / 2 + FILLET + 0.5 + ox0;
            var xMax =  B_LENGTH / 2 - FILLET - 0.5 + ox0;

            var faces = [
                { z: bz - B_WIDTH / 2 - 0.01 },
                { z: bz + B_WIDTH / 2 + 0.01 }
            ];

            faces.forEach(function (face) {
                for (var x = xMin; x <= xMax; x += colSpacing) {
                    var col = new THREE.Mesh(colGeo, columnMat);
                    col.position.set(x, colHeight / 2, face.z);
                    col.castShadow = true;
                    detailGrp.add(col);

                    if (x + colSpacing <= xMax) {
                        var glass = new THREE.Mesh(glassGeo, glassMat);
                        glass.position.set(x + colSpacing / 2, colHeight * 0.45, face.z);
                        detailGrp.add(glass);
                    }
                }
            });

            var lobbyGeo = new THREE.BoxGeometry(2.0, colHeight, 0.3);
            var lobbySide = (bz < 0) ? bz + B_WIDTH / 2 : bz - B_WIDTH / 2;
            [-3, 3].forEach(function (lx) {
                var lobby = new THREE.Mesh(lobbyGeo, voidMat);
                lobby.position.set(lx + ox0, colHeight / 2, lobbySide);
                detailGrp.add(lobby);
            });
        });
    }


    /* ───────────────────────────────────────────────────────────
       2e. WINDOW SYSTEM — Procedural multi-type slit windows
       Three window types with weighted randomness:
         Small slit:  0.25 × 0.06  (≈1.25m × 0.3m)
         Medium slit: 0.40 × 0.09  (≈2.0m  × 0.45m)
         Large slit:  0.65 × 0.12  (≈3.25m × 0.6m)
       Uses InstancedMesh per type for GPU efficiency.
       Skips ground floor (has columns/glass) and band zones.
       ──────────────────────────────────────────────────────── */
    function createWindows() {
        // Three window type geometries
        var types = [
            { geo: new THREE.BoxGeometry(0.25, 0.06, 0.04), weight: 0.40, label: 'small' },
            { geo: new THREE.BoxGeometry(0.40, 0.09, 0.04), weight: 0.40, label: 'medium' },
            { geo: new THREE.BoxGeometry(0.65, 0.12, 0.04), weight: 0.20, label: 'large' }
        ];

        var typeData = [[], [], []];

        [BZ_A, BZ_B].forEach(function (bz, bIdx) {
            // ── Long faces (front & back, along X axis) ───────
            var longFaces = [
                { z: bz - B_WIDTH / 2 - 0.025, ry: 0 },
                { z: bz + B_WIDTH / 2 + 0.025, ry: 0 }
            ];

            longFaces.forEach(function (f, fIdx) {
                for (var s = 1; s < 5; s++) {
                    var ox    = floorOffset(s);  // tilt offset for this floor
                    var baseY = s * STOREY + STOREY * 0.30;
                    var bandY = (s + 1) * STOREY - BAND_H;
                    var xMin  = -B_LENGTH / 2 + FILLET + 0.5 + ox;
                    var xMax  =  B_LENGTH / 2 - FILLET - 0.5 + ox;

                    for (var x = xMin; x < xMax; x += 1.2) {
                        var seed = bIdx * 1e4 + fIdx * 2e3 + s * 100 + Math.floor(x * 10);
                        if (srand(seed) > 0.65) continue;

                        var typeRand = srand(seed + 17);
                        var typeIdx = typeRand < types[0].weight ? 0
                                    : typeRand < types[0].weight + types[1].weight ? 1
                                    : 2;

                        var wy = baseY + srand(seed + 7) * STOREY * 0.22;
                        if (wy > bandY - 0.08 && wy < bandY + BAND_H + 0.04) continue;

                        typeData[typeIdx].push({
                            x: x + srand(seed + 3) * 0.2 - 0.1,
                            y: wy,
                            z: f.z,
                            ry: f.ry
                        });
                    }
                }
            });

            // ── Short faces (sides, along Z axis) ────────────
            var sideFaces = [
                { x: -B_LENGTH / 2 - 0.025, ry: Math.PI / 2 },
                { x:  B_LENGTH / 2 + 0.025, ry: Math.PI / 2 }
            ];

            sideFaces.forEach(function (sf, sIdx) {
                for (var s = 1; s < 5; s++) {
                    var ox    = floorOffset(s);  // tilt offset for side edges
                    var baseY = s * STOREY + STOREY * 0.30;
                    var bandY = (s + 1) * STOREY - BAND_H;
                    var zMin  = bz - B_WIDTH / 2 + FILLET + 0.3;
                    var zMax  = bz + B_WIDTH / 2 - FILLET - 0.3;

                    for (var z = zMin; z < zMax; z += 1.4) {
                        var seed = bIdx * 3e4 + sIdx * 1e3 + s * 80 + Math.floor(z * 10);
                        if (srand(seed) > 0.55) continue;

                        var typeRand = srand(seed + 23);
                        var typeIdx = typeRand < 0.50 ? 0 : typeRand < 0.90 ? 1 : 2;

                        var wy = baseY + srand(seed + 11) * STOREY * 0.18;
                        if (wy > bandY - 0.08 && wy < bandY + BAND_H + 0.04) continue;

                        typeData[typeIdx].push({
                            x: sf.x + ox,   // shift side face X with floor tilt
                            y: wy,
                            z: z + srand(seed + 5) * 0.15,
                            ry: sf.ry
                        });
                    }
                }
            });
        });

        // Create InstancedMesh for each window type
        var d = new THREE.Object3D();
        types.forEach(function (type, ti) {
            var data = typeData[ti];
            if (data.length === 0) return;
            var inst = new THREE.InstancedMesh(type.geo, winMat, data.length);
            for (var i = 0; i < data.length; i++) {
                d.position.set(data[i].x, data[i].y, data[i].z);
                d.rotation.set(0, data[i].ry, 0);
                d.scale.set(1, 1, 1);
                d.updateMatrix();
                inst.setMatrixAt(i, d.matrix);
            }
            inst.instanceMatrix.needsUpdate = true;
            detailGrp.add(inst);
        });
    }


    /* ───────────────────────────────────────────────────────────
       2f. CONTINUOUS RIBBON GLAZING — Corridor-level dark strip
       ──────────────────────────────────────────────────────── */
    function createRibbon() {
        var rLen = B_LENGTH - 2 * FILLET - 1;
        var geo  = new THREE.BoxGeometry(rLen, 0.18, 0.05);
        // Ribbon sits at floor 2 corridor level — use floor 2 offset
        var cy   = 2 * STOREY + STOREY * 0.5;
        var ox   = floorOffset(2);

        var m;
        m = new THREE.Mesh(geo, ribbonMat);
        m.position.set(ox, cy, BZ_A - B_WIDTH / 2 - 0.025);
        detailGrp.add(m);

        m = new THREE.Mesh(geo.clone(), ribbonMat);
        m.position.set(ox, cy, BZ_A + B_WIDTH / 2 + 0.025);
        detailGrp.add(m);

        m = new THREE.Mesh(geo.clone(), ribbonMat);
        m.position.set(ox, cy, BZ_B - B_WIDTH / 2 - 0.025);
        detailGrp.add(m);

        m = new THREE.Mesh(geo.clone(), ribbonMat);
        m.position.set(ox, cy, BZ_B + B_WIDTH / 2 + 0.025);
        detailGrp.add(m);
    }


    /* ───────────────────────────────────────────────────────────
       2g. FACADE VOIDS — Controlled asymmetric openings
       ──────────────────────────────────────────────────────── */
    function createVoids() {
        var geo = new THREE.BoxGeometry(1.5, 1.2, 0.08);
        var positions = [
            { x: -5,  y: 1.5, z: BZ_A - B_WIDTH / 2 - 0.03 },
            { x:  7,  y: 3.2, z: BZ_A - B_WIDTH / 2 - 0.03 },
            { x:  3,  y: 0.8, z: BZ_A + B_WIDTH / 2 + 0.03 },
            { x: -4,  y: 2.8, z: BZ_B + B_WIDTH / 2 + 0.03 },
            { x:  6,  y: 1.2, z: BZ_B - B_WIDTH / 2 - 0.03 },
            { x: -8,  y: 3.5, z: BZ_B + B_WIDTH / 2 + 0.03 }
        ];
        positions.forEach(function (p) {
            // Determine which floor this void sits on & apply tilt
            var floorIdx = Math.min(4, Math.max(0, Math.round(p.y / STOREY)));
            var ox = floorOffset(floorIdx);
            var m = new THREE.Mesh(geo, voidMat);
            m.position.set(p.x + ox, p.y, p.z);
            detailGrp.add(m);
        });
    }


    /* ───────────────────────────────────────────────────────────
       2h. BRIDGE SYSTEM — 5 sky bridges at different levels
       Thin walkway slabs with minimal steel railings.
       Slightly diagonal placement for visual interest.
       Width ≈ 2.5m (0.5 units). Spans courtyard gap.
       ──────────────────────────────────────────────────────── */
    function createBridges() {
        var span = COURTYARD + 1.0;
        var deckGeo  = new THREE.BoxGeometry(0.50, 0.10, span);  // thinner, wider deck
        var railGeo  = new THREE.BoxGeometry(0.02, 0.40, span);
        // Vertical rail posts (balusters)
        var postGeo  = new THREE.BoxGeometry(0.02, 0.40, 0.02);

        var specs = [
            { x: -8, y: 1 * STOREY, ry:  0.04 },   // Level 1, slight angle
            { x: -3, y: 2 * STOREY, ry: -0.03 },   // Level 2
            { x:  1, y: 2 * STOREY, ry:  0.05 },   // Level 2
            { x:  5, y: 3 * STOREY, ry: -0.04 },   // Level 3
            { x:  9, y: 4 * STOREY, ry:  0.03 }    // Level 4
        ];

        specs.forEach(function (sp) {
            var grp = new THREE.Group();
            grp.position.set(sp.x, sp.y, 0);
            grp.rotation.y = sp.ry;   // slight diagonal

            // Deck slab
            var deck = new THREE.Mesh(deckGeo, bridgeMat);
            deck.castShadow = true;
            grp.add(deck);

            // Left railing (continuous)
            var rL = new THREE.Mesh(railGeo, railMat);
            rL.position.set(-0.22, 0.22, 0);
            grp.add(rL);

            // Right railing (continuous)
            var rR = new THREE.Mesh(railGeo, railMat);
            rR.position.set(0.22, 0.22, 0);
            grp.add(rR);

            // Railing posts at intervals
            var postSpacing = span / 6;
            for (var i = -3; i <= 3; i++) {
                var pz = i * postSpacing;
                var pL = new THREE.Mesh(postGeo, railMat);
                pL.position.set(-0.22, 0.22, pz);
                grp.add(pL);

                var pR = new THREE.Mesh(postGeo, railMat);
                pR.position.set(0.22, 0.22, pz);
                grp.add(pR);
            }

            bridgeGrp.add(grp);
        });
    }


    /* ───────────────────────────────────────────────────────────
       2i. COURTYARD — Pedestrian plaza between buildings
       Red walking path, stone pavement, grass patches,
       symmetrical landscaping, curved entry path.
       ──────────────────────────────────────────────────────── */
    function createCourtyard() {
        // ── Stone pavement base ───────────────────────────────
        var cGeo = new THREE.PlaneGeometry(B_LENGTH, COURTYARD);
        var court = new THREE.Mesh(cGeo, courtMat);
        court.rotation.x = -Math.PI / 2;
        court.position.set(0, 0.01, 0);
        court.receiveShadow = true;
        courtyardGrp.add(court);

        // ── Main red walking path — straight central strip ────
        var mainPathGeo = new THREE.PlaneGeometry(B_LENGTH - 2, 0.8);
        var mainPath = new THREE.Mesh(mainPathGeo, pathMat);
        mainPath.rotation.x = -Math.PI / 2;
        mainPath.position.set(0, 0.018, 0);
        courtyardGrp.add(mainPath);

        // ── Cross paths (perpendicular connectors) ────────────
        var crossGeo = new THREE.PlaneGeometry(0.5, COURTYARD - 0.4);
        var crossSpacing = 5.0;
        for (var cx = -B_LENGTH / 2 + 3; cx <= B_LENGTH / 2 - 3; cx += crossSpacing) {
            var cp = new THREE.Mesh(crossGeo, pathMat);
            cp.rotation.x = -Math.PI / 2;
            cp.position.set(cx, 0.016, 0);
            courtyardGrp.add(cp);
        }

        // ── Pavement tile bands along edges ───────────────────
        var tileGeo = new THREE.PlaneGeometry(B_LENGTH - 1, 0.6);
        [-1.6, 1.6].forEach(function (tz) {
            var tile = new THREE.Mesh(tileGeo, pavementMat);
            tile.rotation.x = -Math.PI / 2;
            tile.position.set(0, 0.014, tz);
            courtyardGrp.add(tile);
        });

        // ── Grass patches (between paths) ─────────────────────
        var grassGeo = new THREE.PlaneGeometry(4.0, 0.5);
        var grassPositions = [];
        for (var gx = -B_LENGTH / 2 + 4; gx <= B_LENGTH / 2 - 4; gx += crossSpacing) {
            grassPositions.push({ x: gx, z: -0.9 });
            grassPositions.push({ x: gx, z:  0.9 });
        }
        grassPositions.forEach(function (gp) {
            var grass = new THREE.Mesh(grassGeo, plantMat);
            grass.rotation.x = -Math.PI / 2;
            grass.position.set(gp.x, 0.013, gp.z);
            courtyardGrp.add(grass);
        });

        // ── Planting beds along building edges ────────────────
        var pGeo = new THREE.BoxGeometry(3.0, 0.10, 0.35);
        for (var px = -B_LENGTH / 2 + 3; px <= B_LENGTH / 2 - 3; px += 6) {
            [-COURTYARD / 2 + 0.3, COURTYARD / 2 - 0.3].forEach(function (pz) {
                var p = new THREE.Mesh(pGeo, plantMat);
                p.position.set(px, 0.05, pz);
                courtyardGrp.add(p);
            });
        }

        // ── Extended ground plane ─────────────────────────────
        var gGeo = new THREE.PlaneGeometry(60, 40);
        var gnd  = new THREE.Mesh(gGeo, groundMat);
        gnd.rotation.x = -Math.PI / 2;
        gnd.position.set(0, -0.02, 0);
        gnd.receiveShadow = true;
        courtyardGrp.add(gnd);
    }


    /* ───────────────────────────────────────────────────────────
       2j. ROOFTOP DETAILS — HVAC, water tanks, mechanical rooms,
       stair access, parapet wall.
       Simple box geometry — not over-detailed.
       ──────────────────────────────────────────────────────── */
    function createRooftop() {
        var roofY = B_HEIGHT;
        var topOx = floorOffset(4);  // top floor (floor 4) offset

        [BZ_A, BZ_B].forEach(function (bz, bIdx) {
            var parapetH = 0.15;
            var parapetT = 0.06;

            // Front/back parapets — follow top floor tilt
            var pFrontGeo = new THREE.BoxGeometry(B_LENGTH - 1, parapetH, parapetT);
            var pFront = new THREE.Mesh(pFrontGeo, rooftopMat);
            pFront.position.set(topOx, roofY + parapetH / 2, bz - B_WIDTH / 2);
            detailGrp.add(pFront);

            var pBack = new THREE.Mesh(pFrontGeo, rooftopMat);
            pBack.position.set(topOx, roofY + parapetH / 2, bz + B_WIDTH / 2);
            detailGrp.add(pBack);

            // Side parapets
            var pSideGeo = new THREE.BoxGeometry(parapetT, parapetH, B_WIDTH - 0.5);
            var pLeft = new THREE.Mesh(pSideGeo, rooftopMat);
            pLeft.position.set(topOx - B_LENGTH / 2 + 0.3, roofY + parapetH / 2, bz);
            detailGrp.add(pLeft);

            var pRight = new THREE.Mesh(pSideGeo, rooftopMat);
            pRight.position.set(topOx + B_LENGTH / 2 - 0.3, roofY + parapetH / 2, bz);
            detailGrp.add(pRight);

            // HVAC units — on top floor, follow its tilt
            var hvacGeo = new THREE.BoxGeometry(0.6, 0.35, 0.4);
            var hvacPositions = [
                { x: -5 + bIdx * 3, z: bz - 0.8 },
                { x:  4 - bIdx * 2, z: bz + 0.6 }
            ];
            hvacPositions.forEach(function (hp) {
                var hvac = new THREE.Mesh(hvacGeo, rooftopMat);
                hvac.position.set(hp.x + topOx, roofY + 0.175, hp.z);
                detailGrp.add(hvac);
            });

            // Water tank
            var tankGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 8);
            var tank = new THREE.Mesh(tankGeo, rooftopMat);
            tank.position.set((bIdx === 0 ? 7 : -7) + topOx, roofY + 0.25, bz);
            detailGrp.add(tank);

            // Stair access structure
            var stairGeo = new THREE.BoxGeometry(1.0, 0.6, 0.8);
            var stair = new THREE.Mesh(stairGeo, rooftopMat);
            stair.position.set((bIdx === 0 ? -2 : 2) + topOx, roofY + 0.3, bz);
            detailGrp.add(stair);
        });
    }


    /* ───────────────────────────────────────────────────────────
       2k. LANDSCAPE — Trees, grass areas, light poles, pavement
       Low-poly vegetation and minimal environment details.
       Uses InstancedMesh for trees.
       ──────────────────────────────────────────────────────── */
    function createLandscape() {
        // ── Trees ─────────────────────────────────────────────
        // Low-poly: icosahedron canopy + cylinder trunk
        var trunkGeo  = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 6);
        var canopyGeo = new THREE.IcosahedronGeometry(0.35, 0);

        // Tree positions: around building edges and courtyard ends
        var treePositions = [
            // Courtyard ends
            { x: -B_LENGTH / 2 - 1.5, z: 0, s: 1.0 },
            { x:  B_LENGTH / 2 + 1.5, z: 0, s: 1.1 },
            { x: -B_LENGTH / 2 - 1.0, z: -2, s: 0.9 },
            { x:  B_LENGTH / 2 + 1.0, z: -2, s: 0.85 },
            { x: -B_LENGTH / 2 - 1.0, z:  2, s: 0.95 },
            { x:  B_LENGTH / 2 + 1.0, z:  2, s: 1.05 },
            // Along outer building edges (front of A)
            { x: -7,  z: BZ_A - B_WIDTH / 2 - 1.5, s: 1.1 },
            { x:  0,  z: BZ_A - B_WIDTH / 2 - 1.8, s: 0.9 },
            { x:  7,  z: BZ_A - B_WIDTH / 2 - 1.4, s: 1.0 },
            // Along outer building edges (back of B)
            { x: -6,  z: BZ_B + B_WIDTH / 2 + 1.5, s: 1.0 },
            { x:  2,  z: BZ_B + B_WIDTH / 2 + 1.7, s: 0.85 },
            { x:  8,  z: BZ_B + B_WIDTH / 2 + 1.3, s: 1.1 }
        ];

        // Instanced trunks
        var d = new THREE.Object3D();
        var trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treePositions.length);
        var canopyInst = new THREE.InstancedMesh(canopyGeo, canopyMat, treePositions.length);

        treePositions.forEach(function (tp, i) {
            var scale = tp.s || 1.0;
            // Trunk
            d.position.set(tp.x, 0.3 * scale, tp.z);
            d.rotation.set(0, srand(i * 77) * Math.PI, 0);
            d.scale.set(scale, scale, scale);
            d.updateMatrix();
            trunkInst.setMatrixAt(i, d.matrix);

            // Canopy — higher up
            d.position.set(tp.x, 0.6 * scale + 0.15, tp.z);
            d.scale.set(scale * 0.9, scale * 0.75, scale * 0.9);
            d.updateMatrix();
            canopyInst.setMatrixAt(i, d.matrix);
        });
        trunkInst.instanceMatrix.needsUpdate = true;
        canopyInst.instanceMatrix.needsUpdate = true;
        landscapeGrp.add(trunkInst);
        landscapeGrp.add(canopyInst);

        // ── Light poles along courtyard ───────────────────────
        var poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.7, 4);
        var headGeo = new THREE.SphereGeometry(0.04, 4, 3);

        var polePositions = [];
        for (var px = -B_LENGTH / 2 + 3; px <= B_LENGTH / 2 - 3; px += 5) {
            polePositions.push({ x: px, z: -COURTYARD / 2 + 0.2 });
            polePositions.push({ x: px, z:  COURTYARD / 2 - 0.2 });
        }

        polePositions.forEach(function (pp) {
            var pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.set(pp.x, 0.35, pp.z);
            landscapeGrp.add(pole);

            var head = new THREE.Mesh(headGeo, poleMat);
            head.position.set(pp.x, 0.72, pp.z);
            landscapeGrp.add(head);
        });

        // ── Outer pavement areas ──────────────────────────────
        var outerGeo = new THREE.PlaneGeometry(B_LENGTH + 6, 3);
        // Front of building A
        var pavA = new THREE.Mesh(outerGeo, pavementMat);
        pavA.rotation.x = -Math.PI / 2;
        pavA.position.set(0, -0.01, BZ_A - B_WIDTH / 2 - 2);
        pavA.receiveShadow = true;
        landscapeGrp.add(pavA);

        // Back of building B
        var pavB = new THREE.Mesh(outerGeo, pavementMat);
        pavB.rotation.x = -Math.PI / 2;
        pavB.position.set(0, -0.01, BZ_B + B_WIDTH / 2 + 2);
        pavB.receiveShadow = true;
        landscapeGrp.add(pavB);

        // ── Grass areas flanking the buildings ────────────────
        var grassAreaGeo = new THREE.PlaneGeometry(B_LENGTH + 10, 5);
        var grassA = new THREE.Mesh(grassAreaGeo, plantMat);
        grassA.rotation.x = -Math.PI / 2;
        grassA.position.set(0, -0.015, BZ_A - B_WIDTH / 2 - 5);
        landscapeGrp.add(grassA);

        var grassB = new THREE.Mesh(grassAreaGeo, plantMat);
        grassB.rotation.x = -Math.PI / 2;
        grassB.position.set(0, -0.015, BZ_B + B_WIDTH / 2 + 5);
        landscapeGrp.add(grassB);
    }


    /* ───────────────────────────────────────────────────────────
       2l. BUILDING LABELS — "POD 1C" / "POD 1D" on facades
       Red glowing text rendered via CanvasTexture on plane meshes,
       placed on the outer facade of each building at mid-height.
       Appears AFTER animation completes (fade-in 0.92-1.0).
       ──────────────────────────────────────────────────────── */

    var labelGrp = new THREE.Group();
    labelGrp.visible = false;
    labelGrp.rotation.y = ROT_Y;
    scene.add(labelGrp);

    // Label materials — red glowing text, starts transparent
    var labelMatA, labelMatB;

    function makeTextTexture(text) {
        var cvs = document.createElement('canvas');
        cvs.width  = 1024;   // Higher resolution for clarity
        cvs.height = 256;
        var ctx = cvs.getContext('2d');

        // Transparent background
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // Add glow effect with shadow
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Bright red text
        ctx.fillStyle    = '#ff0000';
        ctx.font         = 'bold 120px Arial, Helvetica, sans-serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, cvs.width / 2, cvs.height / 2);

        var tex = new THREE.CanvasTexture(cvs);
        tex.needsUpdate = true;
        return tex;
    }

    function createBuildingLabels() {
        var labelW = 6.0;   // Larger label plane for better visibility
        var labelH = 1.5;
        var geo    = new THREE.PlaneGeometry(labelW, labelH);

        // ── POD 1C — Building A (left / negative-Z), outer face ──
        var texA = makeTextTexture('POD 1C');
        labelMatA = new THREE.MeshStandardMaterial({
            map: texA,
            transparent: true,
            opacity: 0,
            roughness: 0.3,
            metalness: 0.0,
            emissive: new THREE.Color(0xff0000),      // Red glow
            emissiveIntensity: 0,                      // Starts at 0, fades in
            side: THREE.DoubleSide,
            depthWrite: false
        });

        var labelA = new THREE.Mesh(geo, labelMatA);
        // Position on the outer face of building A, mid-height
        var outerZA = BZ_A - B_WIDTH / 2 - 0.08;
        labelA.position.set(floorOffset(2), B_HEIGHT * 0.5, outerZA);
        // Face outward (negative Z)
        labelA.rotation.y = Math.PI;
        labelGrp.add(labelA);

        // ── POD 1D — Building B (right / positive-Z), outer face ──
        var texB = makeTextTexture('POD 1D');
        labelMatB = new THREE.MeshStandardMaterial({
            map: texB,
            transparent: true,
            opacity: 0,
            roughness: 0.3,
            metalness: 0.0,
            emissive: new THREE.Color(0xff0000),      // Red glow
            emissiveIntensity: 0,                      // Starts at 0, fades in
            side: THREE.DoubleSide,
            depthWrite: false
        });

        var labelB = new THREE.Mesh(geo.clone(), labelMatB);
        // Position on the outer face of building B, mid-height
        var outerZB = BZ_B + B_WIDTH / 2 + 0.08;
        labelB.position.set(floorOffset(2), B_HEIGHT * 0.5, outerZB);
        // Face outward (positive Z) — default plane normal
        labelGrp.add(labelB);
    }


    /* ═══════════════════════════════════════════════════════════
       SECTION 3 — INITIALISE ALL
       ═══════════════════════════════════════════════════════════ */
    createTextInstances();

    // Facade System
    createBodies();
    createFloorBands();
    createSlabs();

    // Detail systems (skip expensive ones on low-end)
    if (!isLowEnd) {
        createWindows();
        createRibbon();
        createVoids();
        createGroundFloor();
        createRooftop();
    }

    // Building Labels
    createBuildingLabels();

    // Bridge System
    createBridges();

    // Courtyard + Landscape
    createCourtyard();
    if (!isLowEnd) {
        createLandscape();
    }


    /* ═══════════════════════════════════════════════════════════
       SECTION 4 — VISIBILITY / OPACITY DRIVER
       Phase timings preserved from original. New materials
       are inserted into the appropriate existing phases.
       ═══════════════════════════════════════════════════════════ */
    function updateVisibility(progress) {

        // ── Phase 4 (0.50–0.65): Building bodies fade in ──────
        if (progress > 0.50) {
            buildingGrp.visible = true;
            var bO = clamp((progress - 0.50) / 0.15, 0, 1);
            facadeMat.opacity = bO;
            if (bO >= 0.98) { facadeMat.transparent = false; facadeMat.opacity = 1; }
            else            { facadeMat.transparent = true; }
        } else {
            buildingGrp.visible = false;
        }

        // ── Phase 5 (0.60–0.75): Details fade in ─────────────
        // Slabs, windows, bands, ribbon, voids, ground floor,
        // rooftop, columns, glass
        if (progress > 0.60) {
            detailGrp.visible = true;
            var dO = clamp((progress - 0.60) / 0.15, 0, 1);
            slabMat.opacity    = dO;
            bandMat.opacity    = dO;
            winMat.opacity     = dO;
            ribbonMat.opacity  = dO;
            voidMat.opacity    = dO;
            columnMat.opacity  = dO;
            glassMat.opacity   = Math.min(dO, 0.45);  // glass stays semi-transparent
            rooftopMat.opacity = dO * 0.85;
        } else {
            detailGrp.visible = false;
        }

        // ── Phase 6 (0.80–0.90): Sky bridges fade in ─────────
        if (progress > 0.80) {
            bridgeGrp.visible = true;
            var brO = clamp((progress - 0.80) / 0.10, 0, 1);
            bridgeMat.opacity = brO;
            railMat.opacity   = brO * 0.6;
        } else {
            bridgeGrp.visible = false;
        }

        // ── Phase 7 (0.82–0.94): Courtyard + landscape ───────
        if (progress > 0.82) {
            courtyardGrp.visible = true;
            var cO = clamp((progress - 0.82) / 0.12, 0, 1);
            courtMat.opacity    = cO;
            pathMat.opacity     = cO;
            pavementMat.opacity = cO * 0.6;
            plantMat.opacity    = cO * 0.7;
            groundMat.opacity   = cO * 0.4;
        } else {
            courtyardGrp.visible = false;
        }

        // ── Phase 7b (0.86–0.96): Landscape details ──────────
        if (progress > 0.86) {
            landscapeGrp.visible = true;
            var lO = clamp((progress - 0.86) / 0.10, 0, 1);
            canopyMat.opacity  = lO * 0.8;
            trunkMat.opacity   = lO * 0.7;
            poleMat.opacity    = lO * 0.5;
        } else {
            landscapeGrp.visible = false;
        }

        // ── Phase 8 (0.92–1.0): Building labels fade in ──────
        // POD 1C / POD 1D red glowing text appears after animation completes
        if (progress > 0.92) {
            labelGrp.visible = true;
            var lblO = clamp((progress - 0.92) / 0.08, 0, 1);
            if (labelMatA) {
                labelMatA.opacity = lblO;
                labelMatA.emissiveIntensity = lblO * 0.8;  // Glow effect
            }
            if (labelMatB) {
                labelMatB.opacity = lblO;
                labelMatB.emissiveIntensity = lblO * 0.8;  // Glow effect
            }
        } else {
            labelGrp.visible = false;
        }
    }


    /* ═══════════════════════════════════════════════════════════
       PUBLIC API — Same interface as original
       ═══════════════════════════════════════════════════════════ */
    window.CIVITAS.buildings = {
        instMesh:     instMesh,
        buildingGrp:  buildingGrp,
        detailGrp:    detailGrp,
        bridgeGrp:    bridgeGrp,
        courtyardGrp: courtyardGrp,
        landscapeGrp: landscapeGrp,
        labelGrp:     labelGrp,
        facadeMat:    facadeMat,
        updateMorph:      updateMorph,
        updateVisibility: updateVisibility
    };
})();
