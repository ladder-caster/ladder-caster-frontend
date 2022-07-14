import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  _header,
  _container,
  _left,
  _right,
  _coin,
  _icon,
  _crank,
  _square,
  _button,
  _speed,
  _controls,
  _padding,
  _before,
  _content,
  _after,
} from '../Header.styled';
import { AnimateButton } from '../../animations/AnimateButton';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import { GAME_CONSTANTS } from 'core/remix/state';
import dayjs from 'dayjs';
import { IconSkip } from 'design/icons/skip.icon';
import { AnimateCrank } from '../../animations/AnimateCrank';
import { useActions } from '../../../../../actions';
import { useRemix } from 'core/hooks/remix/useRemix';
import usePrevious from 'core/hooks/usePrevious';

let a = 180;
let PI = Math.PI;
let start = 0;
let delay = 0;
let elapsed = 0;
let ended = false;
let remaining = 0;
let position = 0;
let interval;
const Timer = () => {
  const { drawerCrank } = useActions();
  const [casters] = useRemix(CHAIN_CASTERS);
  const [gameConstants] = useRemix(GAME_CONSTANTS);
  const prev_game = usePrevious(gameConstants?.gameState);
  const [time, setTime] = useState();
  const game = gameConstants?.gameState;
  const loader_ref = useRef();
  const border_ref = useRef();

  useEffect(() => {
    const next_turn =
      start !== game?.turnInfo?.lastCrankSeconds?.toNumber() ||
      (prev_game &&
        prev_game?.turnInfo?.lastCrankSeconds?.toNumber() !==
          game?.turnInfo?.lastCrankSeconds?.toNumber());

    const next_second = () => {
      start = game?.turnInfo?.lastCrankSeconds?.toNumber();
      delay = game?.turnInfo?.turnDelay;
      elapsed = Math.floor((+dayjs() - start * 1000) / 1000);
      ended = elapsed >= delay;
      remaining = !ended ? delay - elapsed : 0;
      position = (remaining / delay) * 360;
      a = ended ? 180 : position + 180;
      a %= 360;

      const r = (a * PI) / 180;
      const x = Math.sin(r) * 125;
      const y = Math.cos(r) * 125;
      const mid = a > 180 ? 1 : 0;
      const anim = `M 0 0 v -125 A 125 125 1 ${mid} 1 ${x} ${y} z`;

      const next_time = {
        ...time,
        start,
        delay,
        elapsed,
        ended,
        remaining,
        position,
      };

      setTime(next_time);

      loader_ref?.current?.setAttribute('d', anim);
      border_ref?.current?.setAttribute('d', anim);
    };

    if (!prev_game && game) {
      interval = setInterval(() => next_second(), 1000);
      return () => clearInterval(interval);
    } else if (next_turn) {
      clearInterval(interval);
      interval = setInterval(() => next_second(), 1000);
      return () => clearInterval(interval);
    }
  }, [game, game?.turnInfo?.lastCrankSeconds?.toNumber()]);

  const Button = useMemo(() => {
    return (
      <AnimateCrank>
        <_crank>
          {!time?.ended ? (
            <_square>
              <_padding>
                <svg width="250" height="250" viewBox="0 0 250 250">
                  <path
                    ref={border_ref}
                    id="border"
                    transform="translate(125, 125)"
                  />
                  <path
                    ref={loader_ref}
                    id="loader"
                    transform="translate(125, 125) scale(.84)"
                  />
                </svg>
              </_padding>
            </_square>
          ) : (
            <IconSkip />
          )}
        </_crank>
      </AnimateCrank>
    );
  }, [time?.ended]);

  if (!(game && casters?.size !== 0)) return null;

  return (
    <AnimateButton>
      <_button onClick={() => drawerCrank()}>{Button}</_button>
    </AnimateButton>
  );
};

export default Timer;
