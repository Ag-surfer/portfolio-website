"""Generate an abstract hero sculpture and export as compressed GLB."""
import bpy
import math
import os

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create a torus knot via curve
bpy.ops.curve.primitive_nurbs_path_add()
bpy.ops.object.delete()

# Build torus knot manually with a mesh
bpy.ops.mesh.primitive_torus_add(
    align='WORLD',
    major_radius=1.2,
    minor_radius=0.35,
    major_segments=64,
    minor_segments=16,
)
torus = bpy.context.active_object
torus.name = "HeroSculpture"

# Add twist deformation via Simple Deform
mod_twist = torus.modifiers.new(name="Twist", type='SIMPLE_DEFORM')
mod_twist.deform_method = 'TWIST'
mod_twist.angle = math.radians(360)
mod_twist.deform_axis = 'Z'

# Add a second twist on X
mod_twist2 = torus.modifiers.new(name="Twist2", type='SIMPLE_DEFORM')
mod_twist2.deform_method = 'TWIST'
mod_twist2.angle = math.radians(180)
mod_twist2.deform_axis = 'X'

# Subdivision surface for smoothness
mod_sub = torus.modifiers.new(name="Subdiv", type='SUBSURF')
mod_sub.levels = 2
mod_sub.render_levels = 2

# Apply all modifiers
for mod in torus.modifiers:
    bpy.ops.object.modifier_apply(modifier=mod.name)

# Smooth shading
bpy.ops.object.shade_smooth()

# Create metallic material
mat = bpy.data.materials.new(name="SculptureMetal")
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links

# Clear defaults
for n in nodes:
    nodes.remove(n)

# Principled BSDF
bsdf = nodes.new('ShaderNodeBsdfPrincipled')
bsdf.inputs['Base Color'].default_value = (0.7, 0.75, 0.8, 1.0)
bsdf.inputs['Metallic'].default_value = 0.9
bsdf.inputs['Roughness'].default_value = 0.15
bsdf.inputs['IOR'].default_value = 2.5

output = nodes.new('ShaderNodeOutputMaterial')
links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

torus.data.materials.append(mat)

# Center and normalize scale
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='MEDIAN')
torus.location = (0, 0, 0)

# Export as GLB with Draco compression
output_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "models", "hero-sculpture.glb"
)

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_materials='EXPORT',
    export_apply=True,
)

print(f"Exported to {output_path}")
