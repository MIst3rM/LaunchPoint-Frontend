import * as THREE from 'three'
import { useRef, useState } from 'react'
import getUuid from 'uuid-by-string'
import { useCursor, Image, Text, Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath'
import { useNavigate, useParams } from 'react-router-dom';
import { FrameProps } from '../../types';

const GOLDENRATIO = 1.61803398875

const mediumFont = '/Inter-Medium.ttf'

const Frame = ({ url, c = new THREE.Color(), updateCameraTransform, ...props }: FrameProps) => {
    const image = useRef<THREE.Mesh>(null);
    const frame = useRef<THREE.Mesh>(null);
    const button = useRef<THREE.Mesh>(null);
    const params = useParams();
    const navigate = useNavigate();
    const [hovered, hover] = useState(false)
    const [buttonHovered, setButtonHovered] = useState(false);
    const [rnd] = useState(() => Math.random())
    const name = getUuid(url)
    const isActive = params.id === name;

    const fontProps = { font: mediumFont, fontSize: 0.025, letterSpacing: 0.15, lineHeight: 1, 'material-toneMapped': false }

    useCursor(hovered)

    const handleClick = (e) => {
        e.stopPropagation();
        try {
            navigate('/deployments/item/' + name + '/stations')
            updateCameraTransform(new THREE.Vector3(0, GOLDENRATIO * 4, -2.0));
        } catch (error) {
            console.error('Error in handleClick:', error);
        }
    };

    useFrame((state, dt) => {
        if (image.current && 'material' in image.current && 'zoom' in image.current.material) {
            (image.current.material as any).zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
        }

        if (image.current) {
            easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt);
        }

        if (buttonHovered) {
            button.current.scale.set(1.1, 1.1, 1.1);
        } else {
            button.current.scale.set(1, 1, 1);
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
                <Image raycast={() => null} ref={image} position={[0, 0, 0.69]} url={url} />
                <Plane
                    ref={button}
                    args={[0.2, 0.055]}
                    position={[0, -0.4, 0.7]}
                    onPointerOver={() => setButtonHovered(true)}
                    onPointerOut={() => setButtonHovered(false)}
                    onClick={handleClick}
                >
                    <meshBasicMaterial attach="material" color={buttonHovered ? '#999' : '#555'} transparent />
                    <Text
                        maxWidth={0.3}
                        anchorX="center"
                        anchorY="middle"
                        position={[0, 0, 0.01]}
                        {...fontProps}
                    >
                        Details
                    </Text>
                </Plane>
            </mesh>
            <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.035}>
                {props.title || name.split('-').join(' ')}
            </Text>
        </group>
    );
}

export default Frame;