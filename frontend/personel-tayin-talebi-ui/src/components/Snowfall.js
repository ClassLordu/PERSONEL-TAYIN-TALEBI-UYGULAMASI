import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useTheme } from "@mui/material/styles";

const Snowfall = () => {
  const theme = useTheme(); // Mevcut temayı alıyoruz

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Kar tanelerinin rengini tema moduna göre dinamik olarak ayarlıyoruz
  const particleColor = theme.palette.mode === 'light' ? '#888888' : '#ffffff';

  const options = {
    background: {
      color: "transparent",
    },
    fullScreen: {
      enable: true,
      zIndex: -1, // Efektin sayfa içeriğinin arkasında kalmasını sağlar
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: particleColor, // Dinamik rengi burada kullanıyoruz
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: true,
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "bottom",
        straight: false,
      },
    },
  };

  return <Particles id="tsparticles" init={particlesInit} options={options} />;
};

export default Snowfall;
