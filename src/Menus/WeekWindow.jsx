import React, { useEffect, useRef } from 'react';
import { Box, Grid, Paper, Divider } from '@mui/material';
import { headerStyle, } from "../Styles.jsx";

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const colours = [
    { name: 'red', rgb: '#FF0000', darker: '#8B0000' },
    { name: 'blue', rgb: '#0000FF', darker: '#00008B' },
    { name: 'green', rgb: '#00FF00', darker: '#008B00' },
    { name: 'purple', rgb: '#800080', darker: '#4B0082' },
    { name: 'orange', rgb: '#FFA500', darker: '#FF4500' },
    { name: 'yellow', rgb: '#FFFF00', darker: '#ADFF2F' }
];




const tasks = Array.from({ length: 7 }, (_, i) => {
    const dayOfWeek = (i + 7) % 7;
    return Array.from({ length: Math.floor(Math.random() * 10) }, (_, j) => ({
        day: daysOfWeek[dayOfWeek],
        duration: Math.floor(30 + Math.random() * 120),
        name: `Task ${i * 10 + j + 1}`,
        color: [colours[Math.floor(Math.random() * colours.length)].rgb],
        darker: [colours[Math.floor(Math.random() * colours.length)].darker],
    }));
}).flat();

// console.log(tasks);


const WeekComponent = ({ onButtonClick }) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const refs = useRef([]);

    useEffect(() => {
        refs.current = days.map(() => React.createRef());
    }, []);

    const updatePosition = (dayIndex, left, top) => {
        if (refs.current[dayIndex] && refs.current[dayIndex].current) {
            const element = refs.current[dayIndex].current;
            element.style.left = `${left}px`;
            element.style.top = `${top}px`;
        }
    };

    return (
        <><h1
            style={headerStyle}>Week Window
        </h1>



            <Divider orientation="vertical"
                style={{
                    position: 'absolute',
                    left: '13%',
                }}
                sx={{
                    borderLeftWidth: 2,
                    borderLeftStyle: 'dashed',
                    borderLeftColor: 'black',
                    borderRightWidth: 0,
                    height: '77%'

                }} />

            <Box
                style={{
                    position: 'relative',
                    // backgroundColor: '#333033',
                    // display: 'grid',
                    top: '5%',
                    width: '85%',
                    left: '15%',
                }}>
                {daysOfWeek.map((day) => (
                    < div key={day}>


                        <h2 key={day}
                            style={{
                                position: 'absolute',
                                left: '-15%',
                            }}
                        >
                            {day}
                        </h2>


                        <Grid container

                            rowSpacing={{ xs: 1 }}
                            columnSpacing={{ xs: 1 }}
                            p={2}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        // style={{ backgroundColor: '#FF0000' }}
                        >
                            {updatePosition(daysOfWeek.indexOf(day), 0, 0)}
                            {tasks.filter((task) => task.day === day).map((task) => (

                                <Grid item xs={task.duration / 30} key={task.name}  >

                                    <Paper
                                        sx={{
                                            height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: task.color,
                                            transition: 'background-color 0.3s',
                                            '&:hover': {
                                                backgroundColor: 'white', // Adjust this value to set the hover color
                                            },
                                        }}
                                        onClick={() => onButtonClick(task)}

                                    >

                                        {task.name}
                                    </Paper>
                                </Grid>


                            )
                            )}

                        </Grid>

                        <Divider sx={{ borderBottomWidth: 2, borderStyle: 'dashed', borderColor: 'black', }} />

                    </div>
                ))}
            </Box>
            {/* </Box > */}
        </>
    );
};

export default WeekComponent;
