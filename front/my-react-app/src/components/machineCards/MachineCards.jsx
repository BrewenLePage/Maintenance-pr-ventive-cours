import React, { useState, useEffect } from 'react';
import MaintenancePlan from '../maintenancePlan/MaintenancePlan';

function MachineCards() {
    const [machineData, setMachineData] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null); // État pour suivre la machine sélectionnée

    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:8002/ws');

        ws.onopen = () => console.log("WebSocket connection established.");
        ws.onerror = (error) => console.log("WebSocket error:", error);
        ws.onclose = () => console.log("WebSocket connection closed.");

        ws.onmessage = (event) => {
            console.log("Data received:", event.data);
            try {
                const newData = JSON.parse(event.data);
                setMachineData(newData);
            } catch (error) {
                console.error("Parsing error:", error);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    // Modifier cette fonction pour mettre à jour l'état avec la machine sélectionnée
    const showMaintenancePlan = (machine) => {
        setSelectedMachine(machine); // Mettre à jour l'état avec la machine sélectionnée
    };

    return (
        <div className="flex flex-wrap justify-center">
            {machineData.map((machine, index) => {
                const sortedInfoEntries = Object.entries(machine.info).sort((a, b) => b[1] - a[1]);
                const isNoFailureHighest = sortedInfoEntries[0] && sortedInfoEntries[0][0] === 'No Failure';
                const cardBgColor = isNoFailureHighest ? "bg-green-500" : "bg-red-500";
                const entriesToShow = isNoFailureHighest ? sortedInfoEntries : sortedInfoEntries.filter(([failureType]) => failureType !== 'No Failure');

                // Gestionnaire d'événements onClick
                const handleClick = () => {
                    if (!isNoFailureHighest) { // Si la carte est rouge
                        if (selectedMachine && selectedMachine.Machine === machine.Machine) {
                            // Si la machine sélectionnée est déjà affichée, la masquer
                            setSelectedMachine(null);
                        } else {
                            // Sinon, afficher le plan de maintenance pour la machine sélectionnée
                            showMaintenancePlan(machine);
                        }
                    } else {
                        // Réinitialiser si une carte verte est cliquée
                        setSelectedMachine(null);
                    }
                };

                return (
                    <React.Fragment key={index}>
                        <div>
                        <div className={`m-4 ${cardBgColor} rounded-lg border border-gray-200 shadow-md max-w-sm cursor-pointer card-size`} onClick={handleClick}>
                                <div className="p-5">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{machine.Machine}</h5>
                                    <ul>
                                        {entriesToShow.map(([failureType, probability], i) => (
                                            <li key={i} className="text-gray-700">{failureType}: {probability}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {selectedMachine && selectedMachine.Machine === machine.Machine && (
                                <MaintenancePlan machine={selectedMachine} />
                            )}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default MachineCards;