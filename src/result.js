import React from 'react';

const ResultComponent = ({ route }) => (
  <div>
    <h3>Optimal Path:</h3>
    <ul>
      {route.map((point, index) => (
        <li key={index}>{`City ${point}`}</li>
      ))}
    </ul>
  </div>
);

export default ResultComponent;
