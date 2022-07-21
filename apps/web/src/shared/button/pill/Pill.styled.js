import styled from 'styled-components';
import { m } from 'framer-motion';
import {
  _pill_container,
  _pill_inner,
  _pill_text,
} from 'design/styles/buttons/_pill.css';
export const _container = styled(m.div).attrs(
  ({ theme, $pulse, $disabled }) => {
    const pulse = $pulse && !$disabled;
    return {
      animate: {
        scale: pulse ? 1.1 : 1,
        filter: pulse ? 'saturate(2.5), brightness(1.4)' : 'saturate(1)',
      },
      transition: {
        duration: 1.55,
        ease: 'easeOut',
        repeat: pulse ? Infinity : 0,
        repeatDelay: 0.5,
        repeatType: 'mirror',
      },
    };
  },
)`
  ${_pill_container}
`;
export const _pill = styled(m.div).attrs(({ theme, $border, $background }) => {
  return {
    initial: {
      background: `${theme.background[$background ?? 'high']}`,
      boxShadow: theme.shadow['shadow'],
      scale: 1,
    },
    whileHover: {
      scale: 1.04,
      background: theme.background['active'],
      borderColor: theme.border['highest'],
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    whileTap: {
      scale: 0.96,
      background: theme.background['high'],
      borderColor: theme.border['high'],
      color: theme.text['low'],
      transition: {
        duration: 0.05,
        ease: 'easeOut',
      },
    },
  };
})`
  ${_pill_inner}
`;
export const _text = styled(m.div).attrs(({ theme }) => {
  // framer motion animations go here
  return {};
})`
  ${_pill_text}
`;
