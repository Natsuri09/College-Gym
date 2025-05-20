// components/BMICalculator.js
'use client';

import { useState } from 'react';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(2);
      let status = '';
      if (bmi < 18.5) status = 'Underweight';
      else if (bmi < 25) status = 'Normal weight';
      else if (bmi < 30) status = 'Overweight';
      else status = 'Obese';
      setResult(`Your BMI is ${bmi} (${status})`);
    } else {
      setResult('Please enter valid height and weight.');
    }
  };

  return (
    <div className="text-center">
      <h2>Calculate Your BMI</h2>
      <p>Check your Body Mass Index to understand your health better.</p>
      <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Height (cm)" />
      <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight (kg)" />
      <button onClick={calculateBMI}>Calculate BMI</button>
      {result && <p>{result}</p>}
    </div>
  );
}
