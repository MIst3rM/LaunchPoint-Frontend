import * as THREE from 'three'
import { useRef, useState } from 'react'
import getUuid from 'uuid-by-string'
import { useCursor, Image, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath'
import { useParams } from 'react-router-dom';
import { FrameProps } from '../../types';

const GOLDENRATIO = 1.61803398875

const Frame = ({ url, c = new THREE.Color(), ...props }: FrameProps) => {
    const image = useRef<THREE.Mesh>(null);
    const frame = useRef<THREE.Mesh>(null);
    const params = useParams();
    const [hovered, hover] = useState(false)
    const [rnd] = useState(() => Math.random())
    const name = getUuid(url)
    const isActive = params.id === name;

    useCursor(hovered)

    useFrame((state, dt) => {
        if (image.current && 'material' in image.current && 'zoom' in image.current.material) {
            (image.current.material as any).zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
        }

        if (image.current) {
            easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt);
        }

        if (frame.current && 'material' in frame.current && 'color' in frame.current.material) {
            const material = frame.current.material as THREE.MeshBasicMaterial;
            easing.dampC(material.color, hovered ? 'orange' : 'white', 0.1, dt);
        }
    });

    return (
        <group {...props}>
            <mesh
                name={name}
                onPointerOver={(e) => (e.stopPropagation(), hover(true))}
                onPointerOut={() => hover(false)}
                scale={[1, GOLDENRATIO, 0.05]}
                position={[0, GOLDENRATIO / 2, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
                <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                </mesh>
                <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
            </mesh>
            <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
                {name.split('-').join(' ')}
            </Text>
        </group>
    );
}

export default Frame;