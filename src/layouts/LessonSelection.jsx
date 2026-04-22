import React from 'react';
import { useNavigate } from 'react-router-dom';

const LessonSelection = () => {
    const navigate = useNavigate();

    // Bu ma'lumotlar aslida backenddan keladi
    const myLessons = [
        { id: 101, name: "Dasturiy injiniring", group: "310-23" },
        { id: 102, name: "Ma'lumotlar bazasi", group: "311-23" }
    ];

    const startAttendance = (id) => {
        // QR-kod generator sahifasiga lessonId bilan o'tamiz
        navigate(`/attendance/qr/${id}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Mening darslarim</h1>
            {myLessons.map(lesson => (
                <div key={lesson.id} style={{ 
                    border: '1px solid #ccc', 
                    padding: '15px', 
                    marginBottom: '10px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3>{lesson.name}</h3>
                        <p>Guruh: {lesson.group}</p>
                    </div>
                    <button 
                        onClick={() => startAttendance(lesson.id)}
                        style={{ padding: '10px 20px', cursor: 'pointer', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        Davomatni boshlash
                    </button>
                </div>
            ))}
        </div>
    );
};