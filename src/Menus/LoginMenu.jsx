import { Html } from "@react-three/drei";
import * as React from 'react';
import Button from '@mui/material/Button';
import { headerStyle, buttonStyle } from "../Styles.jsx";
import { getAuthenticated } from "../DataCom/fireBaseFunctionalActions.js"
const PI = Math.PI



export default function LoginMenu(resolution) {


    const buttons = [
        { positions: { top: '40%', left: `40%` }, rotation: [-PI / 2, 0, 0], Name: "Login" },
    ]



    return (



        <>
            <h1
                style={headerStyle}>Please Login</h1>

            {buttons.map((value, index) =>
                <Button
                    key={index}
                    variant="contained"
                    disableElevation
                    style={{ ...buttonStyle, ... (value.positions) }}
                    onClick={() => {
                        getAuthenticated()

                    }}
                >
                    {value.Name}
                </Button>
            )}

        </>
    );
}
