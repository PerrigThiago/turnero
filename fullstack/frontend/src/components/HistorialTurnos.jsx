import { useEffect, useState } from "react";

function HistorialTurnos() {
    const [turnos, setTurnos] = useState();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/turnos") // poner endopint de hitorial de turnos
            
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al obtener historial");
                }
                return res.json();
            })
            
            .then((data) => {
                if (Array.isArray(data)) {
                    setTurnos(data);
                } else {
                    setTurnos([]);
                }
            })

            .catch((err) => {
                console.error(err);
                setError("No se puedo cargar el historial");
            })

            .finally(() => {
                setCargando(false);
            });
            
        }, []);
    
    if (cargando) {
        return <p>Cargando historial...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (turnos.length === 0) {
        return <p>No hay turnos en el historial.</p>;
    }

    return (
        <section>
            <h2>Historial de turnos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Teléfono</th>
                        <th>Fecha del turno</th>
                        <th>Hora del turno</th>
                    </tr>
                </thead>
                <tbody>
                    {turnos.map((t) => (
                        <tr key={t.id}>
                            <td>{t.nombre}</td>
                            <td>{t.apellido}</td>
                            <td>{t.dni}</td>
                            <td>{t.telefono}</td>
                            <td>{t.fecha_turno}</td>
                            <td>{t.hora_turno}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default HistorialTurnos;