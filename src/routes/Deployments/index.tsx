import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Environment, Html } from "@react-three/drei";
import { easing } from 'maath'
import { useNavigate, useParams } from 'react-router-dom';
import { Frame } from '../../components';
import { DeploymentsProps, FramesProps } from '../../types';
import Station from '../../components/Station';

const GOLDENRATIO = 1.61803398875;

const Frames = ({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }: FramesProps) => {
    const ref = useRef<THREE.Group>(null);
    const clicked = useRef<THREE.Object3D>(null);
    const params = useParams();
    const navigate = useNavigate();

    const updateCameraTransform = (newPosition) => {
        p.copy(newPosition);
    };

    useEffect(() => {
        console.log("useEffect running")
        if (ref.current) {
            clicked.current = ref.current.getObjectByName(params?.id);
            if (clicked.current) {
                clicked.current.parent?.updateWorldMatrix(true, true);
                clicked.current.parent?.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
                clicked.current.parent?.getWorldQuaternion(q);
            } else {
                p.set(0, 0, 5.5);
                q.identity();
            }
        }
    }, [params.id, p, q]);

    useFrame((state, dt) => {
        if (state.camera) {
            easing.damp3(state.camera.position, p, 0.4, dt);
            easing.dampQ(state.camera.quaternion, q, 0.4, dt);
        }
    });

    return (
        <group
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
                navigate(
                    e.object.name === "" ? '/deployments' : clicked.current === e.object ? `/deployments` : `/deployments/item/${e.object.name}`
                );
            }}
            onPointerMissed={() => navigate('/deployments')}>
            {images.map((props) => <Frame key={props.url} updateCameraTransform={updateCameraTransform} {...props} />)}
        </group>
    );
}

const Deployments = ({ images }: DeploymentsProps) => {
    return (
        <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 3, 15] }}>
            <color attach="background" args={['#191920']} />
            <fog attach="fog" args={['#191920', 0, 15]} />
            <group position={[0, -0.5, 0]}>
                <Frames images={images} />
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 300]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={80}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                        mirror={0}
                    />
                </mesh>
            </group>
            <Environment preset="city" />
            <group position={[0, GOLDENRATIO * 4, -2.25]}>
                <Html fullscreen>
                    <Station city="Paris" />
                </Html>
                <mesh>
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial color="white" metalness={0.5} roughness={0.5} />
                </mesh>
            </group>
        </Canvas>
    );
};

export default Deployments;