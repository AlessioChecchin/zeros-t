import './App.css';
import { useState, useRef } from 'react';
import { evaluate } from 'mathjs';
import React from 'react';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  registerables as registerablesJS
} from "chart.js";
import { Chart} from "react-chartjs-2";
ChartJS.register(...registerablesJS);

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const App = () => {

  const a = useRef(null);
  const b = useRef(null);
  const f = useRef(null);

  const [best, setBest] = useState(null);
  const [error, setError] = useState('');
  const [computationResult, setComputationResult] = useState([]);
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);

  const fx = x => evaluate(f.current.value, { x: x });

  return (
    <div className="App">
      <div className="Title">
        Bolzano's theorem
      </div>
      <div className="Form-Container">
        <div className="AB-Container">
          <input type="text" placeholder="A" ref={a} className="Limit" />
          <input type="text" placeholder="B" ref={b} className="Limit" />
        </div>
        <div className="Function-Container">
          <div className="Y">
            Y =&nbsp;
          </div>
          <div className="Function">
            <input type="text" placeholder="Enter function" ref={f} />
          </div>

        </div>
        <div className="Button-Container">
          <input type="button" value="Find zeros" onClick={
            () => {
              try {
                if (f.current.value === "" || a.current.value === "" || b.current.value === "")
                  return setError("Invalid input");

                const tempX = [];
                const tempY = [];

                let computation = [];
                let va = parseFloat(a.current.value);
                let vb = parseFloat(b.current.value);

                for (let i = 0; i < 50; i++) {

                  const m = (va + vb) / 2;

                  computation.push({
                    a: va,
                    m: m,
                    b: vb
                  });

                  const ya = fx(va);
                  const ym = fx(m);

                  tempX.push(m);
                  tempY.push(ym);

                  if (ya * ym <= 0) {
                    vb = m;
                  }
                  else {
                    va = m;
                  }
                }

                const res = Math.abs(va) < Math.abs(vb) ? va : vb;

                if (Math.abs(fx(res).toFixed(2)) !== 0) {
                  return setError("Unable to find zeros!");
                }

                setBest(res);
                setComputationResult(computation);
                setError('');
                setXValues(tempX);
                setYValues(tempY);
              }
              catch (e) {
                setError("Invalid data");
              }

            }
          } />
        </div>
      </div>
      <div className="Best-Case">
        {(best != null && !error) ? `(${best.toFixed(2)}, 0)` : ''}
      </div>
      <div className={`${error ? "Visible" : "Hidden"} Error-Container`}>
        {error}
      </div>
      <div className={`${(best != null && !error) ? "Data-Visualization" : "Hidden"}`}>
        <div className="Chart-Container">
          <div className="Chart">
            <Chart
              type="line"
              data={{
                labels: xValues.map((v, i) => i),
                datasets: [{
                  label: "Value of m after each iteration",
                  backgroundColor: "rgba(255, 0, 0, 1.0)",
                  borderColor: "rgba(255, 255, 255, 1.0)",
                  data: yValues
                }]
              }}
              options={{
                scales: {
                  y: {
                    grid: {
                      color: '#555'
                    }
                  },
                  x: {
                    grid: {
                      color: '#555'
                    }
                  }
                }
              }}
            />
          </div>

        </div>

        <div className="Computation-Container">
          <div className="Computation-Result">
            <div className="Computation-Table">
              <div className="Line">
                <div className="Cell">
                  A
                </div>
                <div className="Cell">
                  M
                </div>
                <div className="Cell">
                  B
                </div>
              </div>
              {
                computationResult.map((item, index) => {
                  return (
                    <div key={index} className="Line">
                      <div className="Cell">
                        {item.a}
                      </div>
                      <div className="Cell">
                        {item.m}
                      </div>
                      <div className="Cell">
                        {item.b}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
