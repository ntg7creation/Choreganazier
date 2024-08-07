import { Html } from '@react-three/drei';
import { useThree, extend, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import gsap from 'gsap'
import { OrbitControls } from '@react-three/drei'
import * as dat from 'lil-gui'
import * as THREE from 'three'

/* -------------------------------- Fire Base ------------------------------- */
import { auth } from '../DataCom/fireBaseCom.js'
/* ------------------------------- My objects ------------------------------- */
import MainMenu from "../Menus/MainMenu.jsx"

import UserProfile from "../Menus/UserInfo.jsx"
import LoginMenu from "../Menus/LoginMenu.jsx"

// import WeekComponent from "../Menus/WeekWindow.jsx"
const WeekComponent = lazy(() => import('../Menus/WeekWindow.jsx'));
// import TaskWindow from "../Menus/TaskWindow.jsx"
const TaskComponent = lazy(() => import('../Menus/TaskWindow.jsx'));

const gui = new dat.GUI()
const PI = Math.PI



function GetGoogleCalander() {
    return <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FVancouver&bgcolor=%23ffffff&src=ZW4uY2FuYWRpYW4jaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23F6BF26"
        style={{
            border: 'none',
            width: '100%',
            height: '100%',
            // transform: 'scale(0.8)',
            transformOrigin: 'top left',


        }}
    />
}




export default function Experience() {
    const { camera, gl } = useThree()
    const meshRef = useRef()
    camera.position.set(0, 0, 3)

    const [face_State, setface_State] = useState([0, 0, 0]);
    const [user, setUser] = useState(null);

    // This constant holds an array of React components that represent different views or screens in the application.
    // Each component represents a specific feature or functionality of the application, such as the main menu, task window, user profile, week component, login menu, and Google Calendar integration.
    // These components are used to render different views or screens based on user actions or state.
    // const Faces = [MainMenu, TaskWindow, UserProfile, WeekComponent, LoginMenu, GetGoogleCalander]
    const [Faces, setFaces] = useState([MainMenu,
        <Suspense fallback={<div>Loading...</div>}>
            <WeekComponent onButtonClick={(task) => {
                console.log(task)
                setface_State([-PI / 2, 0, 0])
            }} />
        </Suspense>,
        <Suspense fallback={<div>Loading...</div>}>
            <TaskComponent taskName="task2" />
        </Suspense>
        , UserProfile, LoginMenu, GetGoogleCalander])




    useEffect(() => {


        // Set up the subscription
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this runs once on mount


    useMemo(() => {


        /* ----------------------------- rotate the cube ---------------------------- */

        if (meshRef.current) {
            gsap.to(meshRef.current.rotation, {
                duration: 1.5, // Animation duration in seconds
                x: face_State[0], // Rotate 360 degrees (2 * Math.PI radians)
                y: face_State[1],
                z: face_State[2],
                repeat: 0,
                ease: "expo.out",
            })

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


    // const weekCallback = useCallback((task) => {
    //     console.log(task);
    // }, []);


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
        {/* <axesHelper args={[10]} position={[-5, -5, -5]} /> */}




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
            {/*  ----------------------------- Front Window -----------------------------  */}
            <Html
                distanceFactor={1}
                rotation={[0, 0, 0]}
                position={[0, 0, 0.51 * scaleValue]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                {user ? (
                    Faces[0](setface_State, resolution)
                ) : (
                        LoginMenu(resolution)
                )}
            </Html>



            {/*  ----------------------------- Week Calander -----------------------------  */}

            <Html
                distanceFactor={1}
                rotation={[0, -PI / 2, 0]}
                position={[-0.51 * scaleValue, 0, 0]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                {user ? (
                    Faces[1]
                ) : LoginMenu(resolution)}

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
                {/* <iframe
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FVancouver&bgcolor=%23ffffff&src=ZW4uY2FuYWRpYW4jaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23F6BF26"
                    style={{
                        border: 'none',
                        width: '100%',
                        height: '100%',
                        // transform: 'scale(0.8)',
                        transformOrigin: 'top left',


                    }}
                /> */}
                {user ? (
                    GetGoogleCalander()
                ) : (
                    LoginMenu(resolution)
                )}
            </Html>

            {/*  -------------------------------- Temp View -------------------------------  */}

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
                {user ? (
                    // TaskWindow({ task: { Name: 'temp name', EstimatedTimeToComplete: 90 } })
                    Faces[2]
                ) : (
                    LoginMenu(resolution)
                )}
                {/* {TaskWindow({ task: { Name: 'temp name', EstimatedTimeToComplete: 90 } })} */}
                {/* <WeekComponent onButtonClick={(day) => {  setface_State([-PI / 2, 0, 0])}} /> */}
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
                {user ? (
                    UserProfile()
                ) : (
                    LoginMenu(resolution)
                )}
                {/* {UserProfile()} */}
            </Html>


        </mesh >




    </>
}