import React, { useEffect } from 'react';
import EmployeeTable from "../Mui/TableCLicker.jsx"

import { Paper, Typography, Divider, Box } from '@mui/material';
import { headerStyle, dataStyle, BoxStyle } from "../Styles.jsx";
import Background from 'three/examples/jsm/renderers/common/Background.js';


const NoteComponent = ({ title, text, maxWidth, maxHeight }) => {
    return (
        <Paper elevation={3}
            sx={{
                padding: 2,
                margin: '16px 0',
                maxWidth: maxWidth,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                transition: 'background-color 0.3s',
                '&:hover': {
                    backgroundColor: true ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)', // Adjust this value to set the hover color
                },
            }}
        >
            <Typography variant="h6" component="h2">
                {title}
            </Typography>
            <Divider style={{ margin: '6px 0' }} />
            <Box>
                <Typography variant="body1">
                    {text}

                </Typography>
            </Box>
        </Paper>
    );
};

export default function TaskWindow(props) {


    const slots = [
        { Name: "My Week", Title: "Note Title", Text: "random text", maxWidth: "90%", maxHeight: "90%" },
        { Name: "Full Calendar", Title: "Note Title", Text: "random text", maxWidth: "90%", maxHeight: "90%" },
        { Name: "Today Calendar", Title: "Note Title", Text: "random text", maxWidth: "90%", maxHeight: "90%" },
        { Name: "My Info", Title: "Note Title", Text: "random text", maxWidth: "90%", maxHeight: "90%" },
        { Name: "Temp button", Title: "Note Title", Text: "random text", maxWidth: "90%", maxHeight: "90%" },
    ]
    return (
        < >
            <h2
                style={{
                    position: 'absolute',
                    right: '9%',
                    top: '5%'
                }}
            >Task Type</h2>
            <h1
                style={headerStyle}>Task Window

            </h1>

            <Box style={{
                ...BoxStyle,
                // backgroundColor: '#FF0000',
                display: 'grid',
                top: '5%',
                height: '80%',
            }}

            >
                <Box style={{
                    ...BoxStyle,
                    backgroundColor: '#00FF00',
                    display: 'grid',
                    gridTemplateColumns: 'auto auto',

                    // justifyContent: 'space-between',
                    // alignItems: 'center',
                }}>
                    <h2 style={dataStyle}>
                        Task Date:
                    </h2>

                    <h2 style={dataStyle}>
                        ETC:
                    </h2>
                    <h3
                        style={dataStyle}>
                        Task description
                    </h3>

                </Box>
                <Box
                    style={{
                        ...BoxStyle,
                        //  backgroundColor: '#FFFFFF',
                        display: 'grid',
                        gridTemplateColumns: 'auto auto auto',
                    }}
                >

                    {slots.map((value, index) =>

                        <NoteComponent
                            key={index}
                            title={value.Title}
                            text={value.Text}
                            maxWidth={value.maxWidth}
                            maxHeight={value.maxHeight} />

                    )}

                </Box>
            </Box>

        </>
    )
}
