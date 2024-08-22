//TODO refactor in progress
export default function TheBox({ resolution, user, legitUser, taskInstance, scaleValue }) {
    const lookingAt = { "front": [0, 0, 3], "back": [0, 0, -3], "left": [-3, 0, 0], "right": [3, 0, 0], "top": [0, 3, 0], "bottom": [0, -3, 0] }
    const lookingRotation = { "front": [0, 0, 0], "back": [0, PI, 0], "left": [0, PI / 2, 0], "right": [0, -PI / 2, 0], "top": [PI / 2, 0, 0], "bottom": [-PI / 2, 0, 0] }
    const [face_State, setface_State] = useState("front");

    // This constant holds an array of React components that represent different views or screens in the application.
    // Each component represents a specific feature or functionality of the application, such as the main menu, task window, user profile, week component, login menu, and Google Calendar integration.
    // These components are used to render different views or screens based on user actions or state.
    // const Faces = [MainMenu, TaskWindow, UserProfile, WeekComponent, LoginMenu, GetGoogleCalander]
    const [Faces, setFaces] = useState([
        MainMenu, // ! 0
        <Suspense><WeekComponent onButtonClick={WeekShowTask} /></Suspense>, // ! 1
        <Suspense><TaskComponent taskInstance={undefined} /></Suspense>, // ! 2
        UserProfile, // ! 3
        LoginMenu, // ! 4
        GetGoogleCalander, // ! 5
        <Suspense><CreateTask /></Suspense>  // ! 6
    ])



    useEffect(() => {
        gui.add({
            onClick: () => {
                setface_State("front")//setface_State([0, 0, 3])
            }
        }, 'onClick').name('Reset Camera');

        gui.add({
            onClick: () => {
                setface_State("right")//setface_State([0, 0, 3])
            }
        }, 'onClick').name('Camera right');

    }, [])
    return (
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
                {user ? (legitUser ?
                    GetGoogleCalander() : TempMessage()
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

                    UserProfile() : TempMessage()
                ) : (
                    LoginMenu(resolution)
                )}
            </Html>


        </mesh >
    )
}