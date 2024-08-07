import { useEffect, useState } from 'react';
import EmployeeTable from "../Mui/TableCLicker.jsx"

import { Paper, Typography, Divider, Box } from '@mui/material';
import { headerStyle, dataStyle, BoxStyle, paragraphStyle } from "../Styles.jsx";
import Background from 'three/examples/jsm/renderers/common/Background.js';
import { getCrewName, getTaskData } from "../DataCom/fireBaseFunctionalActions.js"



const emptydata = {
    id: -1,
    Job_Title: 'Empty Slot',
    name: 'this slot is empty click to add a new note',
}



const NoteClick = (props, data) => {
    console.log(data)
}

const loadingTask = {
    requiredAccessLevel: 0,
    AssignedCrew: [],
    AssignedCrewName: [],
    Description: "loading",
    EstimatedTimeToComplete: 0,
    Location: { "latitude": 0, "longitude": 0 },
    NumberOfSlots: 0,
    RepeatableWeek: [false, true, false, false, false, false, false],
    Type: "loading",
    TimeStart: {
        nanoseconds: 0,
        seconds: 1562524200
    }
}

const NoteComponent = ({ maxWidth, maxHeight, data = emptydata, Name = undefined }) => {
    const [userName, setUserName] = useState("Loading...");


    useEffect(() => {
        // console.log(Name);
        // setUserName(Name);
    }, []);

// getCrewName(userID, setUserName);
    return (
        <Paper elevation={3}
            sx={{
                padding: 2,
                margin: '16px 0',
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                transition: 'background-color 0.3s',
                '&:hover': {
                    backgroundColor: (data.id == -1) ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)', // Adjust this value to set the hover color
                },

            }}
            onClick={(event) => {
                NoteClick(event, data);
            }}
        >
            <Typography variant="h5" component="h2">
                {data.Job_Title}
            </Typography>
            <Divider style={{ margin: '6px 0' }} />
            <Box>
                <Typography variant="body1">
                    {Name ? Name : "Empty Slot Click here to assign yourself to task"}
                </Typography>
            </Box>
        </Paper>
    );
};

export default function TaskComponent(props) {


    const [taskData, setTaskData] = useState(loadingTask);

    useEffect(() => {
        props.taskName ?
            getTaskData(props.taskName)
                .then((data) => {
                    // console.log(data)
                    if (!data) {
                        console.log("Data not found");
                        data = loadingTask;
                    }
                    setTaskData(data);
                }) : console.log("no task name")

    }, []);

    return (
        < >
            <h2
                style={{
                    position: 'absolute',
                    right: '9%',
                    top: '5%'
                }}
            >Task Type
                <p style={paragraphStyle}>
                    {taskData.Type}
                </p>
            </h2>
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
                    // backgroundColor: '#00FF00',
                    display: 'grid',
                    gridTemplateColumns: 'auto auto',

                    // justifyContent: 'space-between',
                    // alignItems: 'center',
                }}>
                    <h2 style={dataStyle}>
                        Task Date: 
                        <p style={paragraphStyle}>
                            {new Date(taskData.TimeStart.seconds * 1000).toUTCString()}
                        </p>
                    </h2>
                    <h2 style={dataStyle} >
                        ETC:
                        <p style={paragraphStyle}>
                            {taskData.EstimatedTimeToComplete} Miniutes
                        </p>
                    </h2>
                    <h3 style={dataStyle}>
                        Task description
                        <p style={paragraphStyle}>
                            {taskData.Description}
                        </p>
                    </h3>

                </Box>
                <Box
                    style={{
                        ...BoxStyle,
                        //  backgroundColor: '#FFFFFF',
                        display: 'grid',
                        gridTemplateColumns: 'auto auto auto',
                        height: '80%',
                    }}
                >
                    {Array(taskData.NumberOfSlots).fill(0).map((_, index) =>
                        index < taskData.AssignedCrew.length ?
                            < NoteComponent
                                key={index}
                                Name={taskData.AssignedCrewName[index]}
                                data={{
                                    id: 1,
                                    Job_Title: 'Slot ' + (index + 1),
                                    name: 'this slot is empty click to add a new note',
                                }}
                            />
                            : <NoteComponent
                                key={index} />

                    )}

                    {/* {slots.map((value, index) =>

                        <NoteComponent
                            key={index}
                            title={value.Title}
                            text={value.Text}
                            maxWidth={value.maxWidth}
                            maxHeight={value.maxHeight}
                            data={value.data} />

                    )} */}

                </Box>
            </Box>

        </>
    )
}
