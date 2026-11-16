"""Original AENDROX robot: reproducible Blender model, rigid skin rig and clips."""
import bpy, math, os, json
from mathutils import Vector
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'public','assets','robot')
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def material(name,color,metal=0,rough=.25,emit=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emit
 return m
chrome=material('Polished platinum',(.67,.72,.78),1,.18)
shell=material('Brushed silver',(.48,.53,.6),.88,.29)
dark=material('Graphite joint',(.018,.022,.03),.75,.28)
glass=material('Obsidian facial display',(.003,.008,.012),.35,.12)
light=material('White emissive',(.78,.95,1),.1,.18,4)
parts=[]
def finish(o,name,mat,bone):
 o.name=name;o.data.materials.append(mat)
 for p in o.data.polygons:p.use_smooth=True
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bone:parts.append((o,bone))
 return o
def ell(name,loc,scale,mat=chrome,bone='chest'):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,location=loc);o=bpy.context.object;o.scale=scale;return finish(o,name,mat,bone)
def box(name,loc,scale,mat=chrome,bone='chest',bevel=.06):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=scale
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 m=o.modifiers.new('Machined edge','BEVEL');m.width=bevel;m.segments=3;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=m.name)
 return finish(o,name,mat,bone)
def ring(name,loc,r,t,mat=chrome,bone='head',rot=(math.pi/2,0,0)):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=48,minor_segments=8,location=loc,rotation=rot);return finish(bpy.context.object,name,mat,bone)
def rod(name,a,b,r,mat=chrome,bone='chest'):
 d=Vector(b)-Vector(a);bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=r,depth=d.length,location=(Vector(a)+Vector(b))/2);o=bpy.context.object;o.rotation_mode='QUATERNION';o.rotation_quaternion=d.to_track_quat('Z','Y');return finish(o,name,mat,bone)
# Proportioned shell over exposed mechanical spine.
ell('Pelvic housing',(0,0,1.48),(.34,.24,.21),shell,'pelvis')
rod('Spinal piston',(0,.06,1.5),(0,.06,2.19),.12,dark)
for z in [1.67,1.79,1.91]:
 box('Abdominal armor',(0,-.14,z),(.43,.19,.10),shell,bevel=.035)
ell('Thoracic armor',(0,0,2.13),(.47,.27,.42),shell)
ell('Left pectoral',(-.21,-.175,2.25),(.23,.14,.24))
ell('Right pectoral',(.21,-.175,2.25),(.23,.14,.24))
ring('Chest reactor bezel',(0,-.294,2.15),.105,.023)
ring('Chest reactor light',(0,-.312,2.15),.074,.009,light,'chest')
for s in [-1,1]:
 for z in [1.82,1.94,2.06]:rod('Side rib',(s*.3,.06,z),(s*.39,-.05,z+.09),.035,dark)
rod('Neck column',(0,0,2.45),(0,0,2.7),.12,dark,'neck')
for z in [2.51,2.57,2.63]:ring('Neck collar',(0,0,z),.13,.025,chrome,'neck',(0,0,0))
ell('Cranial shell',(0,0,2.98),(.39,.32,.4),chrome,'head')
ell('Black wraparound visor',(0,-.208,3.01),(.345,.20,.275),glass,'head')
ell('Lower jaw',(0,-.07,2.73),(.29,.25,.095),shell,'head')
for s in [-1,1]:
 ell('Ear graphite backing',(s*.375,0,3.0),(.075,.22,.22),dark,'head')
 ring('Ear silver surround',(s*.425,0,3),.175,.035,chrome,'head',(0,math.pi/2,0))
 ring('Ear light',(s*.463,0,3),.135,.012,light,'head',(0,math.pi/2,0))
 for k in range(12):
  a=k*math.pi/11; b=(k+1)*math.pi/11
  rod('Happy eye',(s*.135+.062*math.cos(a),-.401,3.01+.05*math.sin(a)),(s*.135+.062*math.cos(b),-.401,3.01+.05*math.sin(b)),.009,light,'head')
 # Actual rigid segments with separately rigged elbow and finger groups.
 side='L' if s<0 else 'R'
 ell('Shoulder bearing',(s*.49,0,2.34),(.18,.18,.18),dark,'upper_'+side)
 ell('Shoulder plate',(s*.55,-.015,2.37),(.20,.19,.17),chrome,'upper_'+side)
 ell('Upper arm',(s*.57,0,2.07),(.125,.14,.25),shell,'upper_'+side)
 rod('Arm piston',(s*.65,.06,2.23),(s*.65,.06,1.89),.025,chrome,'upper_'+side)
 ell('Elbow',(s*.6,0,1.8),(.12,.13,.12),dark,'fore_'+side)
 ell('Forearm armor',(s*.62,-.01,1.58),(.13,.14,.21),chrome,'fore_'+side)
 box('Wrist',(s*.64,0,1.34),(.17,.15,.1),dark,'hand_'+side,.025)
 box('Palm',(s*.64,-.02,1.22),(.21,.13,.2),shell,'hand_'+side,.045)
 for j in range(4):
  x=s*.64+(j-1.5)*.052
  for z in [1.07,.98]:
   ell('Finger knuckle',(x,-.025,z+.035),(.026,.035,.03),dark,'finger_'+side)
   box('Finger segment',(x,-.025,z),(.041,.056,.07),chrome,'finger_'+side,.015)
 rod('Thumb',(s*.75,0,1.24),(s*.81,-.02,1.1),.035,chrome,'hand_'+side)
 ell('Hip bearing',(s*.23,0,1.42),(.17,.17,.17),dark,'thigh_'+side)
 ell('Thigh armor',(s*.24,0,1.15),(.17,.19,.29),shell,'thigh_'+side)
 rod('Thigh piston',(s*.36,.03,1.37),(s*.36,.03,.94),.028,chrome,'thigh_'+side)
 ell('Knee bearing',(s*.24,0,.82),(.13,.14,.13),dark,'shin_'+side)
 box('Kneecap',(s*.24,-.13,.82),(.19,.12,.18),chrome,'shin_'+side,.05)
 ell('Shin armor',(s*.24,0,.51),(.12,.15,.27),chrome,'shin_'+side)
 box('Ankle',(s*.24,0,.23),(.16,.15,.13),dark,'foot_'+side,.03)
 box('Foot',(s*.24,-.12,.12),(.26,.46,.15),chrome,'foot_'+side,.065)
 box('Rubber sole',(s*.24,-.13,.05),(.27,.47,.04),dark,'foot_'+side,.015)
# A insignia as geometry, no texture dependency.
for a,b in [((-.075,-.302,2.35),(0,-.31,2.5)),((0,-.31,2.5),(.075,-.302,2.35)),((-.04,-.31,2.40),(.04,-.31,2.40))]:rod('AENDROX A',a,b,.012,chrome)
# Armature with rigid mechanical skin weights.
bpy.ops.object.armature_add();rig=bpy.context.object;rig.name='AENDROX_Rig';bpy.ops.object.mode_set(mode='EDIT');rig.data.edit_bones.remove(rig.data.edit_bones[0])
def bone(n,h,t,parent=None):
 b=rig.data.edit_bones.new(n);b.head=h;b.tail=t
 if parent:b.parent=rig.data.edit_bones[parent]
bone('root',(0,0,0),(0,0,.2));bone('pelvis',(0,0,1.45),(0,0,1.65),'root');bone('chest',(0,0,1.65),(0,0,2.45),'pelvis');bone('neck',(0,0,2.45),(0,0,2.68),'chest');bone('head',(0,0,2.68),(0,0,3.3),'neck')
for s,side in [(-1,'L'),(1,'R')]:
 bone('upper_'+side,(s*.49,0,2.34),(s*.6,0,1.8),'chest');bone('fore_'+side,(s*.6,0,1.8),(s*.64,0,1.34),'upper_'+side);bone('hand_'+side,(s*.64,0,1.34),(s*.64,0,1.12),'fore_'+side);bone('finger_'+side,(s*.64,0,1.12),(s*.64,0,.94),'hand_'+side)
 bone('thigh_'+side,(s*.23,0,1.42),(s*.24,0,.82),'pelvis');bone('shin_'+side,(s*.24,0,.82),(s*.24,0,.23),'thigh_'+side);bone('foot_'+side,(s*.24,0,.23),(s*.24,-.25,.12),'shin_'+side)
bpy.ops.object.mode_set(mode='OBJECT')
for o,b in parts:
 g=o.vertex_groups.new(name=b);g.add(list(range(len(o.data.vertices))),1,'REPLACE');mod=o.modifiers.new('Rigid mechanical skin','ARMATURE');mod.object=rig;o.parent=rig
for p in rig.pose.bones:p.rotation_mode='XYZ'
def clear():
 for p in rig.pose.bones:p.rotation_euler=(0,0,0);p.location=(0,0,0);p.scale=(1,1,1)
def pose(n,rot):rig.pose.bones[n].rotation_euler=rot
def key(f):
 for p in rig.pose.bones:
  p.keyframe_insert('rotation_euler',frame=f);p.keyframe_insert('location',frame=f);p.keyframe_insert('scale',frame=f)
rig.animation_data_create()
for name,frames in [('Idle',120),('Walk',32),('Wave',60),('Transform',75)]:
 action=bpy.data.actions.new(name);rig.animation_data.action=action
 for f in range(0,frames+1,4 if name=='Walk' else 5):
  clear();u=f/frames;ph=u*math.tau
  if name=='Idle':pose('head',(.015*math.sin(ph),0,.045*math.sin(ph)));pose('chest',(.008*math.sin(ph),0,0))
  if name=='Walk':
   for s,side in [(-1,'L'),(1,'R')]:
    w=math.sin(ph+(0 if s<0 else math.pi));pose('thigh_'+side,(w*.38,0,0));pose('shin_'+side,(-max(0,-w)*.65,0,0));pose('foot_'+side,(-w*.16,0,0));pose('upper_'+side,(-w*.26,0,0));pose('fore_'+side,(-.15,0,0))
   rig.pose.bones['root'].location.z=.025*(1-math.cos(ph*2))
  if name=='Wave':
   w=min(u*5,1)*min((1-u)*5,1);pose('upper_R',(0,-w*2.05,0));pose('fore_R',(-w*.4,0,w*.22*math.sin(ph*3)));pose('hand_R',(0,0,w*.18*math.sin(ph*3)));pose('head',(0,-.05*w,-.08*w))
  if name=='Transform':
   q=u*u*(3-2*u)
   for side in ['L','R']:
    pose('thigh_'+side,(q*1.4,0,0));pose('shin_'+side,(-q*2.5,0,0));pose('fore_'+side,(-q*1.3,0,0));rig.pose.bones['thigh_'+side].scale=(1,1-q*.65,1)
   rig.pose.bones['root'].location.z=-q*.65
  key(f+1)
 action.use_fake_user=True;track=rig.animation_data.nla_tracks.new();track.name=name;track.strips.new(name,1,action);track.mute=True
rig.animation_data.action=None;clear()
for tr in rig.animation_data.nla_tracks:tr.mute=False
scene=bpy.context.scene;scene.render.fps=30;scene.frame_set(1)
os.makedirs(OUT,exist_ok=True)
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True)
for o,b in parts:o.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'aendrox-robot.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='NLA_TRACKS',export_force_sampling=True)
# Editable source and isolated studio preview.
for tr in rig.animation_data.nla_tracks:tr.mute=True
clear();scene.frame_set(1)
world=bpy.data.worlds.new('Studio');scene.world=world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.13,.15,.18,1);world.node_tree.nodes['Background'].inputs[1].default_value=.45
def area(loc,power,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1.8))-o.location).to_track_quat('-Z','Y').to_euler()
area((2,-4,5),1100,4);area((-3,-1,3),1400,3);area((1,3,4),1800,3)
bpy.ops.object.camera_add(location=(4,-8,3.8));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1.7))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=4.05;scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.render.resolution_x=900;scene.render.resolution_y=1100;scene.render.resolution_percentage=100;scene.render.film_transparent=False
scene.render.filepath=os.path.join(ROOT,'output','robot','robot-preview.png');bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'output','robot','aendrox-robot.blend'));bpy.ops.render.render(write_still=True)
print('EXPORTED',len(parts),'rigid meshes',len(rig.data.bones),'bones')
