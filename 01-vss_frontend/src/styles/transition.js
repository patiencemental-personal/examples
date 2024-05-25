import { keyframes } from 'styled-components';
import color from './color';

const transition = {
  skeletonLoading: keyframes`
    from {
      background-color: ${color.skeletonStart};
    }
    to {
      background-color: ${color.skeletonEnd};
    }
  `,
  spin: keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `,
};

export default transition;