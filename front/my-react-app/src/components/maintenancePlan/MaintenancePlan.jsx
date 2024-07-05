import React from "react";
// MaintenancePlan.jsx
function MaintenancePlan({ machine }) {
    if (!machine) return null;
  
    return (
      <div className="m-4 p-4 bg-gray-100 rounded-lg border border-gray-200 shadow-md max-w-sm">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Plan de maintenance</h5>
        {/* Afficher les détails du plan de maintenance ici */}
        <p>Détails du plan de maintenance pour {machine.Machine}...</p>
      </div>
    );
  }

export default MaintenancePlan;