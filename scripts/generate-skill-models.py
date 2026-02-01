"""
Generate professional 3D skill logo GLB models using Blender Python API.
Higher quality: subdivision surfaces, PBR materials, emission accents.
Run: blender --background --python scripts/generate-skill-models.py
"""

import bpy
import os
import math

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "models", "skills")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m)
    for m in list(bpy.data.materials):
        bpy.data.materials.remove(m)


def pbr_material(name, hex_color, metallic=0.4, roughness=0.3, emission_hex=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes["Principled BSDF"]

    r = ((hex_color >> 16) & 0xFF) / 255.0
    g = ((hex_color >> 8) & 0xFF) / 255.0
    b = (hex_color & 0xFF) / 255.0
    bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness

    if emission_hex and emission_strength > 0:
        er = ((emission_hex >> 16) & 0xFF) / 255.0
        eg = ((emission_hex >> 8) & 0xFF) / 255.0
        eb = (emission_hex & 0xFF) / 255.0
        bsdf.inputs["Emission Color"].default_value = (er, eg, eb, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength

    return mat


def apply_mat(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)


def smooth_shade(obj):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)


def add_subsurf(obj, levels=2):
    bpy.context.view_layer.objects.active = obj
    mod = obj.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = levels
    mod.render_levels = levels


def add_bevel(obj, width=0.02, segments=3):
    bpy.context.view_layer.objects.active = obj
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = width
    mod.segments = segments


def export_glb(name):
    # Apply all modifiers
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            smooth_shade(obj)
    filepath = os.path.join(OUTPUT_DIR, f"{name}.glb")
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
    )
    size = os.path.getsize(filepath) / 1024
    print(f"  Exported: {name}.glb ({size:.0f}KB)")


# ═══════════════════════════════════════════════════════════
# REACT: Polished atom with glowing orbits
# ═══════════════════════════════════════════════════════════
def make_react():
    clear_scene()
    mat_core = pbr_material("ReactCore", 0x61DAFB, metallic=0.7, roughness=0.15, emission_hex=0x61DAFB, emission_strength=0.5)
    mat_ring = pbr_material("ReactRing", 0x61DAFB, metallic=0.5, roughness=0.2, emission_hex=0x61DAFB, emission_strength=0.3)

    # Nucleus
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(0, 0, 0), segments=32, ring_count=24)
    nucleus = bpy.context.active_object
    add_subsurf(nucleus, 2)
    apply_mat(nucleus, mat_core)

    # Three orbital rings at different tilts
    for i, angle in enumerate([0, 60, 120]):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.6, minor_radius=0.025,
            major_segments=80, minor_segments=16,
            location=(0, 0, 0),
            rotation=(math.radians(angle), math.radians(70), 0)
        )
        ring = bpy.context.active_object
        apply_mat(ring, mat_ring)

        # Small electron on each ring
        r = 0.6
        t = i * 2.1
        ex = r * math.cos(t) * math.cos(math.radians(angle))
        ey = r * math.cos(t) * math.sin(math.radians(angle))
        ez = r * math.sin(t)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(ex, ey, ez), segments=16, ring_count=12)
        electron = bpy.context.active_object
        apply_mat(electron, mat_core)

    export_glb("react")


# ═══════════════════════════════════════════════════════════
# TYPESCRIPT: Glossy rounded badge
# ═══════════════════════════════════════════════════════════
def make_typescript():
    clear_scene()
    mat_bg = pbr_material("TSBg", 0x3178C6, metallic=0.3, roughness=0.25)
    mat_text = pbr_material("TSText", 0xFFFFFF, metallic=0.15, roughness=0.4)

    # Rounded square base
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    base = bpy.context.active_object
    base.scale = (0.5, 0.5, 0.1)
    bpy.ops.object.transform_apply(scale=True)
    add_bevel(base, width=0.08, segments=4)
    add_subsurf(base, 2)
    apply_mat(base, mat_bg)

    # "TS" text
    bpy.ops.object.text_add(location=(0, -0.04, 0.11))
    txt = bpy.context.active_object
    txt.data.body = "TS"
    txt.data.size = 0.35
    txt.data.extrude = 0.04
    txt.data.bevel_depth = 0.012
    txt.data.bevel_resolution = 3
    txt.data.align_x = 'CENTER'
    txt.data.align_y = 'CENTER'
    bpy.ops.object.convert(target='MESH')
    apply_mat(txt, mat_text)

    export_glb("typescript")


# ═══════════════════════════════════════════════════════════
# NODE.JS: Glossy hexagon badge
# ═══════════════════════════════════════════════════════════
def make_nodejs():
    clear_scene()
    mat_bg = pbr_material("NodeBg", 0x339933, metallic=0.35, roughness=0.25)
    mat_text = pbr_material("NodeText", 0xFFFFFF, metallic=0.15, roughness=0.4)
    mat_edge = pbr_material("NodeEdge", 0x66CC33, metallic=0.5, roughness=0.2, emission_hex=0x66CC33, emission_strength=0.15)

    # Hexagonal prism
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.55, depth=0.2, location=(0, 0, 0))
    hex_base = bpy.context.active_object
    add_bevel(hex_base, width=0.04, segments=3)
    add_subsurf(hex_base, 1)
    apply_mat(hex_base, mat_bg)

    # Thin glowing edge ring
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.57, depth=0.04, location=(0, 0, 0.1))
    edge = bpy.context.active_object
    add_bevel(edge, width=0.01, segments=2)
    apply_mat(edge, mat_edge)

    # "N" letter
    bpy.ops.object.text_add(location=(0, -0.04, 0.11))
    txt = bpy.context.active_object
    txt.data.body = "N"
    txt.data.size = 0.4
    txt.data.extrude = 0.04
    txt.data.bevel_depth = 0.01
    txt.data.bevel_resolution = 3
    txt.data.align_x = 'CENTER'
    txt.data.align_y = 'CENTER'
    bpy.ops.object.convert(target='MESH')
    apply_mat(txt, mat_text)

    export_glb("nodejs")


# ═══════════════════════════════════════════════════════════
# DATABASE: Polished stacked disks with glow
# ═══════════════════════════════════════════════════════════
def make_database():
    clear_scene()
    colors = [0x336791, 0x2B5E87, 0x24507D]
    mat_glow = pbr_material("DBGlow", 0x4A90D9, metallic=0.3, roughness=0.3, emission_hex=0x4A90D9, emission_strength=0.3)

    for i, y in enumerate([-0.22, 0, 0.22]):
        mat = pbr_material(f"DB{i}", colors[i], metallic=0.5, roughness=0.2)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.4, depth=0.16, location=(0, 0, y))
        disk = bpy.context.active_object
        add_bevel(disk, width=0.025, segments=3)
        add_subsurf(disk, 1)
        apply_mat(disk, mat)

    # Glowing separator rings
    for y in [-0.11, 0.11]:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.4, minor_radius=0.01, location=(0, 0, y), major_segments=48, minor_segments=8)
        ring = bpy.context.active_object
        apply_mat(ring, mat_glow)

    export_glb("database")


# ═══════════════════════════════════════════════════════════
# DESIGN: Artist palette with vivid dots
# ═══════════════════════════════════════════════════════════
def make_design():
    clear_scene()
    mat_palette = pbr_material("Palette", 0xF0EDE8, metallic=0.05, roughness=0.6)

    # Palette shape (squished sphere)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0, 0, 0), segments=48, ring_count=32)
    palette = bpy.context.active_object
    palette.scale = (1, 0.85, 0.15)
    bpy.ops.object.transform_apply(scale=True)
    add_subsurf(palette, 1)
    apply_mat(palette, mat_palette)

    # Thumb hole
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.2, location=(-0.25, -0.15, 0))
    hole = bpy.context.active_object
    apply_mat(hole, pbr_material("Hole", 0x333333, metallic=0.1, roughness=0.8))

    # Color blobs
    blob_data = [
        (0xFF6B6B, (-0.08, 0.2, 0.07)),
        (0x4ECDC4, (0.18, 0.18, 0.07)),
        (0xFFE66D, (0.05, -0.05, 0.07)),
        (0x6C5CE7, (-0.22, 0.08, 0.07)),
        (0xFF8A5C, (0.28, 0.0, 0.07)),
        (0x2ED573, (0.1, 0.12, 0.07)),
    ]
    for color, pos in blob_data:
        mat = pbr_material(f"Blob{color:x}", color, metallic=0.15, roughness=0.35)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.055, location=pos, segments=20, ring_count=12)
        blob = bpy.context.active_object
        blob.scale = (1, 1, 0.6)
        bpy.ops.object.transform_apply(scale=True)
        apply_mat(blob, mat)

    export_glb("design")


# ═══════════════════════════════════════════════════════════
# AI: Microchip with glowing circuits
# ═══════════════════════════════════════════════════════════
def make_ai():
    clear_scene()
    mat_chip = pbr_material("Chip", 0x2D2B55, metallic=0.7, roughness=0.15)
    mat_pin = pbr_material("Pin", 0xC0C0C0, metallic=0.8, roughness=0.15)
    mat_glow = pbr_material("AIGlow", 0x00D2FF, metallic=0.3, roughness=0.2, emission_hex=0x00D2FF, emission_strength=1.5)

    # Main chip body
    bpy.ops.mesh.primitive_cube_add(size=0.65, location=(0, 0, 0))
    chip = bpy.context.active_object
    chip.scale = (1, 1, 0.3)
    bpy.ops.object.transform_apply(scale=True)
    add_bevel(chip, width=0.035, segments=4)
    add_subsurf(chip, 1)
    apply_mat(chip, mat_chip)

    # Pins on each side
    for side in range(4):
        for j in range(4):
            offset = (j - 1.5) * 0.13
            if side == 0:
                pos, scl = (0.4, offset, 0), (2, 0.6, 0.6)
            elif side == 1:
                pos, scl = (-0.4, offset, 0), (2, 0.6, 0.6)
            elif side == 2:
                pos, scl = (offset, 0.4, 0), (0.6, 2, 0.6)
            else:
                pos, scl = (offset, -0.4, 0), (0.6, 2, 0.6)
            bpy.ops.mesh.primitive_cube_add(size=0.05, location=pos)
            pin = bpy.context.active_object
            pin.scale = scl
            bpy.ops.object.transform_apply(scale=True)
            add_bevel(pin, width=0.005, segments=2)
            apply_mat(pin, mat_pin)

    # Glowing core circle
    bpy.ops.mesh.primitive_torus_add(major_radius=0.1, minor_radius=0.02, location=(0, 0, 0.11), major_segments=32, minor_segments=12)
    core_ring = bpy.context.active_object
    apply_mat(core_ring, mat_glow)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(0, 0, 0.11), segments=20, ring_count=12)
    core = bpy.context.active_object
    apply_mat(core, mat_glow)

    # Circuit trace lines on top
    for dx, dy in [(0.15, 0), (-0.15, 0), (0, 0.15), (0, -0.15)]:
        bpy.ops.mesh.primitive_cube_add(size=0.01, location=(dx/2, dy/2, 0.1))
        trace = bpy.context.active_object
        if dx != 0:
            trace.scale = (15, 1, 0.5)
        else:
            trace.scale = (1, 15, 0.5)
        bpy.ops.object.transform_apply(scale=True)
        apply_mat(trace, mat_glow)

    export_glb("ai")


# ═══════════════════════════════════════════════════════════
# C: Polished badge with embossed letter
# ═══════════════════════════════════════════════════════════
def make_c():
    clear_scene()
    mat_bg = pbr_material("CBg", 0x5C6BC0, metallic=0.4, roughness=0.2)
    mat_text = pbr_material("CText", 0xFFFFFF, metallic=0.2, roughness=0.4)
    mat_rim = pbr_material("CRim", 0x7986CB, metallic=0.6, roughness=0.15, emission_hex=0x7986CB, emission_strength=0.15)

    # Circle base
    bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=0.15, location=(0, 0, 0), vertices=48)
    base = bpy.context.active_object
    add_bevel(base, width=0.025, segments=3)
    add_subsurf(base, 1)
    apply_mat(base, mat_bg)

    # Rim ring
    bpy.ops.mesh.primitive_torus_add(major_radius=0.5, minor_radius=0.018, location=(0, 0, 0.08), major_segments=48, minor_segments=12)
    rim = bpy.context.active_object
    apply_mat(rim, mat_rim)

    # "C" text
    bpy.ops.object.text_add(location=(0, -0.05, 0.08))
    txt = bpy.context.active_object
    txt.data.body = "C"
    txt.data.size = 0.45
    txt.data.extrude = 0.05
    txt.data.bevel_depth = 0.015
    txt.data.bevel_resolution = 3
    txt.data.align_x = 'CENTER'
    txt.data.align_y = 'CENTER'
    bpy.ops.object.convert(target='MESH')
    apply_mat(txt, mat_text)

    export_glb("c")


# ═══════════════════════════════════════════════════════════
# RUST: Detailed gear with metallic finish
# ═══════════════════════════════════════════════════════════
def make_rust():
    clear_scene()
    mat_gear = pbr_material("RustGear", 0xDEA584, metallic=0.7, roughness=0.2)
    mat_inner = pbr_material("RustInner", 0xB87333, metallic=0.8, roughness=0.15)
    mat_text = pbr_material("RustText", 0x1A1A1A, metallic=0.3, roughness=0.4)

    # Main gear body
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.45, depth=0.12, location=(0, 0, 0))
    gear = bpy.context.active_object
    add_bevel(gear, width=0.015, segments=3)
    add_subsurf(gear, 1)
    apply_mat(gear, mat_gear)

    # Gear teeth
    for i in range(16):
        angle = math.radians(i * 22.5)
        x = 0.45 * math.cos(angle)
        y = 0.45 * math.sin(angle)
        bpy.ops.mesh.primitive_cube_add(size=0.08, location=(x, y, 0), rotation=(0, 0, angle))
        tooth = bpy.context.active_object
        tooth.scale = (1.4, 0.5, 1.2)
        bpy.ops.object.transform_apply(scale=True)
        add_bevel(tooth, width=0.008, segments=2)
        apply_mat(tooth, mat_gear)

    # Center hole ring
    bpy.ops.mesh.primitive_torus_add(major_radius=0.12, minor_radius=0.035, location=(0, 0, 0), major_segments=32, minor_segments=16)
    hole = bpy.context.active_object
    apply_mat(hole, mat_inner)

    # "R" letter
    bpy.ops.object.text_add(location=(0, -0.03, 0.07))
    txt = bpy.context.active_object
    txt.data.body = "R"
    txt.data.size = 0.2
    txt.data.extrude = 0.03
    txt.data.bevel_depth = 0.008
    txt.data.bevel_resolution = 3
    txt.data.align_x = 'CENTER'
    txt.data.align_y = 'CENTER'
    bpy.ops.object.convert(target='MESH')
    apply_mat(txt, mat_text)

    export_glb("rust")


# ═══════════════════════════════════════════════════════════
# PYTHON: Intertwined segments with eyes
# ═══════════════════════════════════════════════════════════
def make_python():
    clear_scene()
    mat_blue = pbr_material("PyBlue", 0x3776AB, metallic=0.4, roughness=0.25)
    mat_yellow = pbr_material("PyYellow", 0xFFD43B, metallic=0.4, roughness=0.25)
    mat_eye = pbr_material("PyEye", 0xFFFFFF, metallic=0.1, roughness=0.5)

    # Blue top half
    bpy.ops.mesh.primitive_cube_add(size=0.38, location=(0.1, 0.1, 0.1))
    top = bpy.context.active_object
    add_bevel(top, width=0.06, segments=4)
    add_subsurf(top, 2)
    apply_mat(top, mat_blue)

    # Yellow bottom half
    bpy.ops.mesh.primitive_cube_add(size=0.38, location=(-0.1, -0.1, -0.1))
    bottom = bpy.context.active_object
    add_bevel(bottom, width=0.06, segments=4)
    add_subsurf(bottom, 2)
    apply_mat(bottom, mat_yellow)

    # Connecting bridge
    bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=0.45, location=(0, 0, 0))
    bridge = bpy.context.active_object
    add_subsurf(bridge, 1)
    apply_mat(bridge, mat_blue)

    # Eyes
    for pos in [(0.02, 0.18, 0.22), (-0.02, -0.18, -0.22)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=pos, segments=16, ring_count=12)
        eye = bpy.context.active_object
        apply_mat(eye, mat_eye)

    export_glb("python")


# ═══════════════════════════════════════════════════════════
# NETWORKING: Connected nodes constellation
# ═══════════════════════════════════════════════════════════
def make_networking():
    clear_scene()
    import mathutils

    mat_center = pbr_material("NetCenter", 0x0077B6, metallic=0.6, roughness=0.2, emission_hex=0x00B4D8, emission_strength=0.4)
    mat_node = pbr_material("NetNode", 0x48CAE4, metallic=0.5, roughness=0.25, emission_hex=0x48CAE4, emission_strength=0.2)
    mat_link = pbr_material("NetLink", 0x90E0EF, metallic=0.4, roughness=0.3, emission_hex=0x90E0EF, emission_strength=0.3)

    # Central hub
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.13, location=(0, 0, 0), segments=24, ring_count=16)
    center = bpy.context.active_object
    add_subsurf(center, 1)
    apply_mat(center, mat_center)

    # Outer nodes
    node_positions = [
        (0.42, 0, 0.05), (-0.42, 0, -0.05),
        (0, 0.42, 0.05), (0, -0.42, -0.05),
        (0.28, 0.28, 0.15), (-0.28, -0.28, -0.15),
        (0.28, -0.28, 0.1), (-0.28, 0.28, -0.1),
    ]

    for pos in node_positions:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, location=pos, segments=20, ring_count=12)
        node = bpy.context.active_object
        add_subsurf(node, 1)
        apply_mat(node, mat_node)

        # Link rod to center
        dx, dy, dz = pos
        length = math.sqrt(dx*dx + dy*dy + dz*dz)
        mid = (dx/2, dy/2, dz/2)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=length, location=mid)
        rod = bpy.context.active_object

        up = mathutils.Vector((0, 0, 1))
        target = mathutils.Vector((dx, dy, dz)).normalized()
        rot = up.rotation_difference(target)
        rod.rotation_euler = rot.to_euler()
        bpy.context.view_layer.objects.active = rod
        bpy.ops.object.transform_apply(rotation=True)
        apply_mat(rod, mat_link)

    export_glb("networking")


# ═══════════════════════════════════════════════════════════
print("=== Generating professional 3D skill models ===")
make_react()
make_typescript()
make_nodejs()
make_database()
make_design()
make_ai()
make_c()
make_rust()
make_python()
make_networking()
print("=== All models generated ===")
