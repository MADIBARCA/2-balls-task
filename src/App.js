import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [ballPosition1, setBallPosition1] = useState({
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    isDragging: false,
  });

  const [ballPosition2, setBallPosition2] = useState({
    x: 200,
    y: 50,
    vx: 0,
    vy: 0,
  });

  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setBallPosition1({
      ...ballPosition1,
      isDragging: true,
      dragOffsetX: offsetX,
      dragOffsetY: offsetY,
    });
  };

  const handleMouseMove = (e) => {
    if (ballPosition1.isDragging) {
      const vx = e.clientX - ballPosition1.dragOffsetX - ballPosition1.x;
      const vy = e.clientY - ballPosition1.dragOffsetY - ballPosition1.y;
      setBallPosition1({ ...ballPosition1, vx, vy });
    }
  };

  const handleMouseUp = () => {
    setBallPosition1({ ...ballPosition1, isDragging: false });
  };

  useEffect(() => {
    const updateBalls = () => {
      if (ballPosition1.isDragging) {
        setBallPosition1((prevBall1) => ({
          ...prevBall1,
          x: prevBall1.x + prevBall1.vx,
          y: prevBall1.y + prevBall1.vy,
        }));
      }

      const distance = Math.sqrt(
        (ballPosition1.x - ballPosition2.x) ** 2 +
          (ballPosition1.y - ballPosition2.y) ** 2
      );

      const totalRadius = 20 + 20;

      if (distance < totalRadius) {
        const nx = (ballPosition2.x - ballPosition1.x) / distance;
        const ny = (ballPosition2.y - ballPosition1.y) / distance;

        const relVelocity = {
          x: ballPosition2.vx - ballPosition1.vx,
          y: ballPosition2.vy - ballPosition2.vy,
        };

        // const dotProduct = ballPosition1.vx * nx + ballPosition1.vy * ny;
        const dotProduct = relVelocity.x * nx + relVelocity.y * ny;

        ballPosition1.vx += (2 * dotProduct * nx) / 2;
        ballPosition1.vy += (2 * dotProduct * ny) / 2;

        ballPosition2.vx -= (2 * dotProduct * nx) / 2;
        ballPosition2.vy -= (2 * dotProduct * ny) / 2;
      }
    };

    const animationId = requestAnimationFrame(updateBalls);

    return () => cancelAnimationFrame(animationId);
  }, [ballPosition1, ballPosition2]);

  return (
    <div>
      <div
        className="draggingBall"
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          position: "absolute",
          left: ballPosition1.x,
          top: ballPosition1.y,
        }}
      ></div>
      <div
        className="draggingBall"
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          position: "absolute",
          left: ballPosition2.x,
          top: ballPosition2.y,
        }}
      ></div>
    </div>
  );
}

export default App;
