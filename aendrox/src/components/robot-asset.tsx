'use client';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';
export function RobotAsset({skip,reduced,busy,typing,onPhase}:{skip:boolean;reduced:boolean;busy:boolean;typing:boolean;onPhase:(s:string)=>void}) {
 const gltf=useGLTF('/assets/robot/aendrox-robot.glb');
 const scene=useMemo(()=>clone(gltf.scene),[gltf.scene]);
 const mixer=useMemo(()=>new THREE.AnimationMixer(scene),[scene]);
 const actions=useMemo(()=>Object.fromEntries(gltf.animations.map(c=>[c.name,mixer.clipAction(c)])),[gltf.animations,mixer]);
 const elapsed=useRef(0),current=useRef(''),root=useRef<THREE.Group>(null);
 useEffect(()=>()=>{mixer.stopAllAction();current.current=""},[mixer,scene]);
 useFrame((_,delta)=>{
  const dt=Math.min(delta,.05);elapsed.current+=dt;const t=skip||reduced?9:elapsed.current;
  const name=t<4.5?'Walk':t<6.5?'Wave':t<9?'Transform':'Avatar';
  if(current.current!==name){const old=actions[current.current];old?.fadeOut(.2);const action=actions[name==='Avatar'?'Transform':name];if(action){action.reset().setEffectiveWeight(1).fadeIn(.2);action.setLoop(name==='Walk'?THREE.LoopRepeat:THREE.LoopOnce,Infinity);action.clampWhenFinished=true;action.play();if(name==='Avatar'){action.time=action.getClip().duration;action.paused=true;}}current.current=name;onPhase(name==='Walk'?'Walking in':name==='Wave'?'Hello! I’m your AENDROX assistant':name==='Transform'?'Transforming':'Ready to help');}
  mixer.update(reduced?0:dt);
  if(root.current){root.current.position.x=t<4.5?-2.4*(1-t/4.5):0;root.current.rotation.y=t<4.5?-.5:0;}
  if(name==='Avatar'&&!reduced){const head=scene.getObjectByName('head');if(head){head.rotation.y=typing?.12:Math.sin(elapsed.current*.6)*.045;head.rotation.x=busy?Math.sin(elapsed.current*6)*.025:0;}}
 });
 return <group ref={root}><primitive object={scene}/></group>;
}

