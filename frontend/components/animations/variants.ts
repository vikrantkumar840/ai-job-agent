import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: .8,
    },
  },
};

export const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -80,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: .8,
    },
  },
};

export const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 80,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: .8,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: .85,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: .8,
    },
  },
};
