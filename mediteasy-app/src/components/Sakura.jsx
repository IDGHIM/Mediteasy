import React, { useEffect } from "react";

const Sakura = () => {
  useEffect(() => {
    const numPetals = 25;
    for (let i = 0; i < numPetals; i++) {
      const petal = document.createElement("div");
      petal.classList.add("petal");
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.animationDuration = 5 + Math.random() * 10 + "s";
      petal.style.animationDelay = Math.random() * 10 + "s";
      petal.style.transform = `scale(${0.5 + Math.random()})`;
      document.body.appendChild(petal);
    }
    return () => {
      document.querySelectorAll(".petal").forEach((el) => el.remove());
    };
  }, []);

  return null;
};

export default Sakura;