import { Html } from '@react-three/drei';
import { useThree, extend, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from 'gsap'
import { Environment, Sky, ContactShadows, RandomizedLight, AccumulativeShadows, SoftShadows, BakeShadows, useHelper, OrbitControls } from '@react-three/drei'
import * as dat from 'lil-gui'
import * as THREE from 'three'

/* ------------------------------- My objects ------------------------------- */
import EmployeeTable from "../Mui/TableCLicker.jsx"
import MainMenu from "../Menus/MainMenu.jsx"
import TaskWindow from "../CustomeComponents/TaskWindow.jsx"
import UserProfile from "../Menus/UserInfo.jsx"
const gui = new dat.GUI()
const PI = Math.PI
function GridLoactions(rows, cols) {
    const Loactions = []
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const y = -(col - cols / 2) * (1 / cols)
            const x = (row - rows / 2) * (1 / rows)
            Loactions.push([x, y])
        }
    }
    return Loactions
}
const CalanderLocationsMonth = GridLoactions(7, 4)
const CalanderLocations1Week = GridLoactions(7, 1)
const CalanderLocations2Week = GridLoactions(7, 2)



export default function Experience() {
    const { camera, gl } = useThree()
    const meshRef = useRef()
    camera.position.set(0, 0, 3)
    const [face_State, setface_State] = useState([0, 0, 0]);
    const [firstScreen, setfirstScreen] = useState(false);


    useMemo(() => {


        /* ----------------------------- rotate the cube ---------------------------- */
        // console.log("face_State", face_State)
        // // console.log("firstScreen", firstScreen)
        if (meshRef.current) {
            gsap.to(meshRef.current.rotation, {
                duration: 1.5, // Animation duration in seconds
                x: face_State[0], // Rotate 360 degrees (2 * Math.PI radians)
                y: face_State[1],
                z: face_State[2],
                repeat: 0,
                ease: "expo.out",
            })
            // meshRef.current.rotation.set(...face_State)

        }
    }, [face_State]);


    useMemo(() => {



        /* ------------------------------- first pass ------------------------------- */
        if (meshRef.current) {
            meshRef.current.rotation.set(0, 0, 0)
            meshRef.current.position.set(0, 2, -5)
            gsap.to(meshRef.current.position, { duration: 2, x: 0, y: 0, z: 0, ease: "expo.out" })
            gsap.to(meshRef.current.rotation, {
                duration: 2, // Animation duration in seconds
                y: "6.28", // Rotate 360 degrees (2 * Math.PI radians)
                repeat: 0,
                ease: "expo.out",
                onComplete: () => {
                    // console.log("Look-at complete!");
                    setfirstScreen(true)
                }
            })
        }
        const handleClick = () => {
            setface_State([0, 0, 0])
        }


        gui.add({ onClick: handleClick }, 'onClick').name('Click Me!');

        /* ----------------------------- rotate the cube ---------------------------- */
        // look at 0,0,0
        const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(
            new THREE.Vector3(...face_State),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0) // Up vector
        ));

        gsap.to(camera.quaternion, {
            duration: 2, // Animation duration in seconds
            ...targetQuaternion, // Target quaternion values
            ease: "expo.out",
            onComplete: () => {
                // console.log("Look-at complete!");
            }
        });

    }, []);

    useEffect(() => {

    }, [])



    const scaleValue = 3;
    const resolution = 400 * scaleValue;
    return <>
        {/* <Environment
            background
            files="../public/HDRI/Ocean.exr"
        /> */}
        <OrbitControls makeDefault enableDamping={false} />
        {/* <OrbitControls /> */}
        <directionalLight position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />
        {/* <AxesHelper /> */}
        <axesHelper args={[10]} position={[-5, -5, -5]} />




        <mesh scale={0.5} rotation-x={0} ref={meshRef}>
            <boxGeometry
                args={[1 * scaleValue, 1 * scaleValue, 1 * scaleValue,]} // [7, 4, 7]}
            />
            <meshPhysicalMaterial
                metalness={1.0} // Fully metallic
                roughness={0.4} // Medium roughness for a slightly polished look
                clearcoat={1.0} // High clearcoat to simulate the glossy finish of aluminum
                clearcoatRoughness={0.1}
                reflectivity={1}
                color="white" wireframe={false} />
            {/*  ----------------------------- Month Calander -----------------------------  */}
            <Html
                distanceFactor={1}
                rotation={[0, 0, 0]}
                position={[0, 0, 0.51 * scaleValue]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                {MainMenu(setface_State, resolution)}
            </Html>
            {/* <Html
                distanceFactor={1}
                rotation={[0, 0, 0]}
                position={[0, 0, 0.51]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                <div>
                    {[...CalanderLocationsMonth].map((value, index) =>
                        <button key={index}
                            style={{ width: '57px', height: '100px' }}
                            onClick={() => {
                                // setface_State([0, PI / 2, 0])

                                setface_State([-PI / 2, 0, 0])
                            }}
                        >Click Me {index}
                        </button>)}
                </div>
            </Html> */}


            {/*  ----------------------------- Week Calander -----------------------------  */}

            <Html
                distanceFactor={1}
                rotation={[0, -PI / 2, 0]}
                position={[-0.51 * scaleValue, 0, 0]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                <div>
                    {[...Array(7)].map((value, index) =>
                        <button key={index}
                            style={{ width: '57px', height: `${resolution}px` }}
                            onClick={() => { setface_State([0, PI, 0]) }}
                        >Click Me {index}
                        </button>)}
                </div>
            </Html>


            {/*  ----------------------------- 2Week Calander -----------------------------  */}

            <Html
                distanceFactor={1}
                rotation={[0, PI, 0]}
                position={[0, 0, -0.51 * scaleValue]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                <div>
                    {[...Array(14)].map((value, index) =>
                        <button key={index}
                            style={{ width: '57px', height: '200px' }}
                            onClick={() => { setface_State([PI / 2, 0, 0]) }}
                        >Click Me {index}
                        </button>)}
                </div>
            </Html>

            {/*  ------------------------------- Google Calander -------------------------------  */}
            <Html
                distanceFactor={1}
                // scale={0.5}
                rotation={[-PI / 2, 0, 0]}
                position={[0, 0.51 * scaleValue, 0]}
                transform
                occlude
                style={{ width: `${resolution / 2}px`, height: `${resolution / 2}px` }}
                scale={2}
            >
                <iframe
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FVancouver&bgcolor=%23ffffff&src=ZW4uY2FuYWRpYW4jaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23F6BF26"
                    style={{
                        border: 'none',
                        width: '100%',
                        height: '100%',
                        // transform: 'scale(0.8)',
                        transformOrigin: 'top left',


                    }}
                />
            </Html>

            {/*  -------------------------------- Task View -------------------------------  */}

            <Html
                distanceFactor={1}
                // scale={0.5}
                rotation={[PI / 2, 0, 0]}
                position={[0, -0.51 * scaleValue, 0]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                {/* {EmployeeTable()} */}
                {TaskWindow({ task: { Name: 'temp name', EstimatedTimeToComplete: 90 } })}
            </Html>

            {/*  -------------------------------- User View -------------------------------  */}

            <Html
                distanceFactor={1}
                // scale={0.5}
                rotation={[0, PI / 2, 0]}
                position={[0.51 * scaleValue, 0, 0]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >

                {UserProfile()}
            </Html>


        </mesh >




    </>
}