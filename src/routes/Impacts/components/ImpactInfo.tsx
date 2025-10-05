// components/ImpactInfoPanel.tsx
import React, { useContext } from "react";
import { ImpactDataContext } from "../contexts/ImpactDataContext";

const ImpactInfoPanel: React.FC = () => {
  const data = useContext(ImpactDataContext);

  // Extract asteroid data
  const { diameter, velocity, position } = data.asteroid;

  // Velocity magnitude (m/s)
  const velocityMag = Math.sqrt(
    velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2
  );

  // Impact angle (relative to ground plane = xy-plane)
  // If asteroid is coming down mostly in z-direction:
  const angleRad = Math.atan2(Math.abs(velocity[2]), Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2));
  const impactAngle = (angleRad * 180) / Math.PI;

  // Location (x, y)
  const location = { x: position[0], y: position[1] };

  // Mass estimate (sphere volume * density).
  // Assume density = 3000 kg/m³ (typical rock asteroid). f
  const density = 3000;
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * radius ** 3;
  const mass = density * volume;

  // Kinetic energy = 0.5 * m * v^2
  const kineticEnergy = 0.5 * mass * velocityMag ** 2;

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        maxWidth: "260px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>
        Impact Info
      </h3>
      <p><strong>Diameter:</strong> {diameter.toFixed(2)} m</p>
      <p><strong>Velocity:</strong> {velocityMag.toFixed(2)} m/s</p>
      <p><strong>Angle:</strong> {impactAngle.toFixed(1)}°</p>
      <p>
        <strong>Location:</strong> (x: {location.x.toFixed(1)}, y: {location.y.toFixed(1)})
      </p>
      <p>
        <strong>Kinetic Energy:</strong>{" "}
        {(kineticEnergy / 1e12).toFixed(2)} ×10¹² J
      </p>
    </div>
  );
};

export default ImpactInfoPanel;
