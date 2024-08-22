import { Html, Environment } from '@react-three/drei';
import { useThree, extend, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import gsap from 'gsap'
import { OrbitControls } from '@react-three/drei'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { lights8 } from './Lights.jsx';

/* -------------------------------- Fire Base ------------------------------- */
// TODO refactor this
import { auth, checkUserIsLegit } from '../DataCom/fireBaseCom.js'   
/* ------------------------------- My objects ------------------------------- */
import MainMenu from "../Menus/MainMenu.jsx"
import { LogoutMenu } from "../Menus/MainMenu.jsx"
import UserProfile from "../Menus/UserInfo.jsx"
import LoginMenu from "../Menus/LoginMenu.jsx"

// import CreateTask from "../Menus/CreateTaskWindow.jsx"
const CreateTask = lazy(() => import('../Menus/CreateTaskWindow.jsx'));
// import CreateCrew from "../Menus/CreateCrew.jsx"
const CreateCrew = lazy(() => import('../Menus/CreateCrew.jsx'));
// import WeekComponent from "../Menus/WeekWindow.jsx"
const WeekComponent = lazy(() => import('../Menus/WeekWindow.jsx'));
// import TaskWindow from "../Menus/TaskWindow.jsx"
const TaskComponent = lazy(() => import('../Menus/TaskWindow.jsx'));
// import DeleteWindow from "../Menus/DeleteWindow.jsx"
const DeleteComponent = lazy(() => import('../Menus/DeleteWindow.jsx'));

const gui = new dat.GUI()
const PI = Math.PI



function TempMessage() {
    return LogoutMenu()
}



export default function Experience() {
    const { camera, gl } = useThree()
    const meshRef = useRef()
    camera.position.set(0, 0, 3)
    const lookingAt = { "front": [0, 0, 3], "back": [0, 0, -3], "left": [-3, 0, 0], "right": [3, 0, 0], "top": [0, 3, 0], "bottom": [0, -3, 0] }
    const lookingRotation = { "front": [0, 0, 0], "back": [0, PI, 0], "left": [0, PI / 2, 0], "right": [0, -PI / 2, 0], "top": [PI / 2, 0, 0], "bottom": [-PI / 2, 0, 0] }
    const [face_State, setface_State] = useState("front");

    const [user, setUser] = useState(null);
    const [legitUser, setLegitUser] = useState(false);
    // const [taskInstance, setTaskInstance] = useState(loadingTaskInstance);


    const temp = "temp0";
    const WeekShowTask =
        (task) => {

            setFaces([...Faces.slice(0, 2),
            <TaskComponent taskInstance={task} />
                , ...Faces.slice(3)])
            // console.log(task);
            setface_State("bottom")//setface_State([-PI / 2, 0, 0])
        }

    const SwapFace =
        (Face, locatoin, direction) => {

            setFaces([...Faces.slice(0, locatoin),
                Face
                , ...Faces.slice(locatoin + 1)])
            setface_State(direction)
        }


    // This constant holds an array of React components that represent different views or screens in the application.
    // Each component represents a specific feature or functionality of the application, such as the main menu, task window, user profile, week component, login menu, and Google Calendar integration.
    // These components are used to render different views or screens based on user actions or state.
    // const Faces = [MainMenu, TaskWindow, UserProfile, WeekComponent, LoginMenu, GetGoogleCalander]
    const [Faces, setFaces] = useState([
        MainMenu, // ! 0
        <Suspense><WeekComponent onButtonClick={WeekShowTask} /></Suspense>, // ! 1
        <Suspense><TaskComponent taskInstance={undefined} /></Suspense>, // ! 2
        <Suspense><CreateCrew /></Suspense>, // UserProfile, // ! 3
        LoginMenu, // ! 4
        <Suspense><DeleteComponent /> </Suspense>, //</>GetGoogleCalander, // ! 5
        <Suspense><CreateTask /></Suspense>  // ! 6
    ])


    useEffect(() => {
        gui.add({
            onClick: () => {
                setface_State("front")//setface_State([0, 0, 3])
            }
        }, 'onClick').name('Reset Camera');

        // gui.add({
        //     onClick: () => {
        //         setface_State("right")//setface_State([0, 0, 3])
        //     }
        // }, 'onClick').name('Camera right');

    }, [])

    useEffect(() => {
        // Set up the subscription
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            checkUserIsLegit(user.uid).then((result) => {
                // console.log("the result is :", result);
                setLegitUser(result);
            });
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this runs once on mount


    const prevFaceStateRef = useRef();

    useEffect(() => {


        /* ----------------------------- rotate the cube ---------------------------- */
        const rotateTo = lookingRotation[face_State] 

        if (meshRef.current) {
            gsap.to(meshRef.current.rotation, {
                duration: 1.5, // Animation duration in seconds
                x: rotateTo[0], // Rotate 360 degrees (2 * Math.PI radians)
                y: rotateTo[1],
                z: rotateTo[2],
                repeat: 0,
                ease: "expo.out",
            })
        }


        /* ---------------------------- rotate the camera --------------------------- */



        // const prevFaceState = prevFaceStateRef.current ? prevFaceStateRef.current : "front";
        // const posFrom = lookingAt[prevFaceState]
        // const posTO = lookingAt[face_State]

        // if (camera) {

        //     gsap.fromTo(camera.position,
        //         { x: posFrom[0], y: posFrom[1], z: posFrom[2] },
        //         {
        //             x: posTO[0], y: posTO[1], z: posTO[2], repeat: 0, ease: "expo.out", duration: 1.5,
        //         })

        // }
        // prevFaceStateRef.current = face_State;

        camera.lookAt(0, 0, 0)
    }, [face_State]);


    useEffect(() => {


        /* ------------------------------- first pass ------------------------------- */
        if (meshRef.current) {
            meshRef.current.rotation.set(0, 0, 0)
            // meshRef.current.position.set(0, 2, -5)
            gsap.to(meshRef.current.position, { duration: 2, x: 0, y: 0, z: 0, ease: "expo.out" })
            gsap.to(meshRef.current.rotation, {
                duration: 2, // Animation duration in seconds
                y: "6.28", // Rotate 360 degrees (2 * Math.PI radians)
                repeat: 0,
                ease: "expo.out"
            })
        }


        /* ----------------------------- rotate the cube ---------------------------- */
        // look at 0,0,0
        // const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(
        //     new THREE.Vector3(...face_State),
        //     new THREE.Vector3(0, 0, 0),
        //     new THREE.Vector3(0, 1, 0) // Up vector
        // ));

        // gsap.to(camera.quaternion, {
        //     duration: 2, // Animation duration in seconds
        //     ...targetQuaternion, // Target quaternion values
        //     ease: "expo.out",
        //     onComplete: () => {
        //         // console.log("Look-at complete!");
        //     }
        // });

    }, []);





    const scaleValue = 3;
    const resolution = 400 * scaleValue;
    return <>
        {/* <Environment background={"only"} files="../public/HDRI/Ocean.exr" /> */}

        {/* <OrbitControls makeDefault enableDamping={false} /> */}

        {lights8(false)}

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
                {/* ChildComponent({taskInstance}) */}
                {user ?
                    (legitUser ?
                        Faces[0](setface_State, resolution) : TempMessage()
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
                {user ? (legitUser ?
                    Faces[1] : TempMessage()
                ) : LoginMenu(resolution)}

            </Html>


            {/*  ----------------------------- Create Task -----------------------------  */}

            <Html
                distanceFactor={1}
                rotation={[0, PI, 0]}
                position={[0, 0, -0.51 * scaleValue]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >

                {user ? (legitUser ?
                    Faces[6] : TempMessage()
                ) : (
                    LoginMenu(resolution)
                )}



            </Html>

            {/*  ------------------------------- Delete Calander -------------------------------  */}
            <Html
                distanceFactor={1}
                // scale={0.5}
                rotation={[-PI / 2, 0, 0]}
                position={[0, 0.51 * scaleValue, 0]}
                transform
                occlude
                style={{ width: `${resolution}px`, height: `${resolution}px` }}
            >
                {user ? (legitUser ?
                    Faces[5] : TempMessage()
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
                {user ? (legitUser ?
                    Faces[2] : TempMessage()
                ) : (
                    LoginMenu(resolution)
                )}

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
                {user ? (legitUser ?

                    Faces[3] : TempMessage()
                ) : (
                    LoginMenu(resolution)
                )}
            </Html>


        </mesh >




    </>
}