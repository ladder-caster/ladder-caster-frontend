import { useRemix } from 'core/hooks/remix/useRemix';
import { useEventListener } from 'core/hooks/useEventListener';
import { useSize } from 'core/hooks/useSize';
import { VIEW_SIZE } from 'core/remix/state';
import { domMax, LazyMotion } from 'framer-motion';
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Drawer from '../../../shared/drawer/Drawer';
import { AnimatedViews } from '../animated/AnimatedViews';
import { _container, _view } from '../Game.styled';
import { Drawers } from '../drawers/Drawers';

export const View = () => {
  const view_ref = useRef();
  const view_size = useSize(view_ref);
  const [dh, setDrawerHeight] = useState();
  const [, setViewHeight] = useRemix(VIEW_SIZE);

  useEffect(() => {
    if (view_size?.height) setViewHeight(view_size?.height);
  }, [view_size]);

  const refreshHeight = () => {
    let next_height = view_ref?.current?.offsetHeight;
    if (next_height && next_height !== dh) setDrawerHeight(next_height);
  };

  useLayoutEffect(() => refreshHeight(), []);
  useEventListener('resize', () => refreshHeight());
  useEventListener('scroll', () => refreshHeight());

  return (
    <_view ref={view_ref}>
      <_container>
        <LazyMotion features={domMax}>
          <AnimatedViews />
        </LazyMotion>
      </_container>
      <Drawer height={dh}>
        <Drawers />
      </Drawer>
    </_view>
  );
};
