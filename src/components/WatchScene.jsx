import React, { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei';

function WatchModel(props) {
    const { scene } = useGLTF('/golden_watch/scene.gltf');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    // Crank up environment reflection intensity so the gold pops luxuriously
                    child.material.envMapIntensity = 3.0;

                    // The glass was tinting the entire inside dial pitch black!
                    // Hiding the glass completely ensures 100% clarity and brightness on the watch face.
                    if (child.name.toLowerCase().includes('glass')) {
                        child.visible = false;
                    }
                    child.material.needsUpdate = true;
                }
            }
        });
    }, [scene]);

    // Initial tilt to show off the dial face straight away
    return <primitive object={scene} {...props} />;
}

useGLTF.preload('/golden_watch/scene.gltf');

const WatchScene = () => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        // Initial check
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ width: '100%', height: isMobile ? '450px' : '600px', cursor: 'grab', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
                {/* Additional manual lighting to ensure it is bright and clear */}
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 10]} intensity={3} castShadow />
                <directionalLight position={[-10, -10, -10]} intensity={1} />

                <Suspense fallback={null}>
                    {/* 
                      We dynamically switch adjustCamera based on device!
                      Mobile screens are narrow, so we zoom in tighter (1.1).
                      Desktop screens are wide, so we zoom out slightly (1.4).
                    */}
                    <Stage
                        environment="apartment"
                        intensity={1.5}
                        adjustCamera={isMobile ? 0.9 : 1.4}
                        shadows={{ type: 'contact', opacity: 0.7, blur: 2.5, scale: 20 }}
                    >
                        {/* 
                          1.3 tilts it to face the camera directly.
                          -Math.PI / 2 flips the 12 o'clock mark perfectly to the highest true vertical point.
                        */}
                        <group rotation={[1.3, 0, 0]}>
                            <WatchModel rotation={[0, -Math.PI / 2, 0]} />
                        </group>
                    </Stage>
                </Suspense>

                {/* 
                    Full 360 OrbitControls.
                    I completely removed the angle constraints! 
                    Now the customer can spin it up, down, left, and right in a full 360° sphere,
                    and it will hold exactly where they leave it without snapping back.
                */}
                {/* 
                    "Make it firm": We massively reduce rotateSpeed to 0.25 (from default 1.0).
                    enableDamping adds smooth, heavy momentum.
                    minPolarAngle and maxPolarAngle set to the same value perfectly locks 
                    the vertical axis so the customer can ONLY spin it cleanly left and right.
                */}
                <OrbitControls
                    makeDefault
                    autoRotate
                    // Boosted to 1.5 so it spins clearly on page load, screaming "I am 3D!"
                    autoRotateSpeed={1.5}
                    rotateSpeed={0.25}
                    enableDamping={true}
                    dampingFactor={0.05}
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>

            {/* Subtle luxury UI note indicating interactivity */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: 1, duration: 1.5 }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#1a1a1a',
                }}
            >
                <motion.div
                    animate={{ x: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    style={{ fontSize: '1.2rem', fontWeight: 300 }}
                >
                    ⟷
                </motion.div>
                Drag to explore
            </motion.div>
        </div>
    );
};

export default WatchScene;
