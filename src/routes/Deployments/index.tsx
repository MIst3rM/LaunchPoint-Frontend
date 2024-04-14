import * as THREE from 'three'
import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Environment, Html } from "@react-three/drei";
import { easing } from 'maath'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Frame } from '../../components';
import { DeploymentsProps, FramesProps } from '../../types';
import Stations from '../../components/Stations';
import { useAuth } from '../../providers/auth';
import getUuid from 'uuid-by-string'

import { motion } from 'framer-motion';

const GOLDENRATIO = 1.61803398875;

const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID
const batteries_collection_id = import.meta.env.VITE_BATTERY_COLLECTION_ID

const Frames = memo(({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }: FramesProps) => {
    const ref = useRef<THREE.Group>(null);
    const clicked = useRef<THREE.Object3D>(null);
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [stationsVisible, setStationsVisible] = useState(false);
    const [activeLocation, setActiveLocation] = useState('');

    const toggleStationsVisibility = (city) => {
        setActiveLocation(city);
        setStationsVisible(!stationsVisible);
    }

    const { client } = useAuth();

    useEffect(() => {
        if (ref.current) {
            if (location.pathname.includes('stations')) {
                clicked.current = ref.current.getObjectByName('stations');
                if (clicked.current) {
                    clicked.current.parent?.updateWorldMatrix(true, true);
                    clicked.current.parent?.localToWorld(p.set(0, GOLDENRATIO * 4, -2));
                    clicked.current.parent?.getWorldQuaternion(q);
                } else {
                    p.set(0, 0, 5.5);
                    q.identity();
                }
            } else {
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
        }
    }, [params.id, p, q]);

    useFrame((state, dt) => {
        if (state.camera) {
            easing.damp3(state.camera.position, p, 0.4, dt);
            easing.dampQ(state.camera.quaternion, q, 0.4, dt);
        }
    });

    const handleNavigation = (e) => {
        if (e.object.name === "" || clicked.current === e.object) {
            return '/deployments';
        }

        if (images.map((props) => getUuid(props.url)).includes(e.object.name)) {
            return `/deployments/item/${e.object.name}`;
        }
    }

    return (
        <group
            ref={ref}
            onClick={(e) => {
                e.stopPropagation(),
                    navigate(handleNavigation(e))
            }}
            onPointerMissed={() => {
                setStationsVisible(false),
                    navigate('/deployments')
            }
            }>
            {stationsVisible &&
                <group name={`stations`} position={[0, GOLDENRATIO * 4, -2.25]}>
                    <Html calculatePosition={() => [0, 0, 0]}>
                        <Stations city={activeLocation} client={client} />
                    </Html>
                    <mesh name={`stations-mesh`} onDoubleClick={
                        (e) => {
                            e.stopPropagation();
                            setStationsVisible(false),
                                navigate('/deployments');
                        }
                    }>
                        <planeGeometry args={[1, 0.5, 32, 32]} />
                        <meshStandardMaterial color="white" metalness={0.5} roughness={0.5} />
                    </mesh>
                </group>
            }
            {images.map((props) => <Frame key={props.url} details={toggleStationsVisibility} {...props} />)}
        </group>
    );
});

const Deployments = memo(({ images }: DeploymentsProps) => {

    const imagesMemo = useMemo(() => images, [images]);

    return (
        <motion.div
            key="deployments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.5 } }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 3, 15] }}>
                <color attach="background" args={['#191920']} />
                <fog attach="fog" args={['#191920', 0, 15]} />
                <group position={[0, -0.5, 0]}>
                    <Frames images={imagesMemo} />
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
            </Canvas>
        </motion.div>
    );
});

export default Deployments;