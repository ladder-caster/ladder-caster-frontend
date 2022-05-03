import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  _mutations,
  _wrapper,
  _container,
  _icon,
  _text,
  _queue,
  _body,
  _overlay,
  _shimmer,
  _float,
  _spinner,
} from './Mutations.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CREATE_MUTATION, USER_OFFLINE, ERROR_CODES } from 'core/remix/state';
import usePrevious from 'core/hooks/usePrevious';
import { AnimatePresence } from 'framer-motion';
import { AnimateMutations } from './animations/AnimateMutations';
import { useTranslation } from 'react-i18next';
import { AnimateShimmer } from './animations/AnimateShimmer';
import { useSize } from 'core/hooks/useSize';
import { findIndex } from 'lodash';
import { IconLoading } from 'design/icons/loading.icon';
import { IconLightning } from 'design/icons/lightning.icon';
import { IconEye } from 'design/icons/eye.icon';
import { fetching } from 'core/remix/fetching';
import { IconSpinner } from 'design/icons/spinner.icon';
import { AnimateSpinner } from './animations/AnimateSpinner';
import { IconBlind } from 'design/icons/blind.icon';
import { IconOffline } from 'design/icons/offline.icon';
import { withTheme } from 'styled-components';

const Mutations = withTheme(({ theme }) => {
  const { t } = useTranslation();
  const mutations_ref = useRef();
  const { width, height } = useSize(mutations_ref);
  const [mutation, setMutation] = useRemix(CREATE_MUTATION);
  const [codes] = useRemix(ERROR_CODES);
  const [offline, setOffline] = useRemix(USER_OFFLINE);
  const [queue, setQueue] = useState([]);
  const prev_queue = usePrevious(queue);

  // Handle Mutation
  useEffect(() => {
    if (mutation?.id) {
      // Find in the queue or add
      const match = findIndex(queue, (item) => item.id === mutation.id);
      const next_queue = [...queue];

      if (match !== -1) {
        next_queue[match] = mutation;
        setQueue(next_queue);
      } else setQueue([...queue, mutation]);
      setMutation(undefined);
    }
  }, [mutation]);

  // Current Text
  const current_text = useMemo(() => {
    const item = queue?.[0];
    if (offline) return t('user.offline');
    if (item) {
      const text = fetching[item.type];
      const error_text = item?.text?.error;

      if (item.error)
        return error_text
          ? error_text
          : t(text ? `error.${text}` : 'mutation.error');
      else if (item.success)
        return t(text ? `success.${text}` : 'mutation.success');
      else if (item.validator)
        return t(text ? `loading.${text}` : 'mutation.validator');
      else if (item.rpc)
        return t(text ? `loading.${text}` : 'mutation.loading');
      else return t('mutation.loading');
    }
  }, [queue, offline]);

  // Remove Queue
  const removeFromQueue = (item) => {
    let next_queue = [...queue];
    const index = findIndex(next_queue, (match) => match.id === item.id);
    if (index !== -1) next_queue.splice(index, 1);
    setQueue(next_queue);
  };

  useEffect(() => {
    const item = queue?.[0];
    const pending_item = queue?.[1];
    if (item?.done || item?.success || item?.error) {
      setTimeout(
        () => removeFromQueue(item),
        pending_item
          ? 800
          : item?.error
          ? 3000
          : item?.done
          ? 1500
          : item?.success
          ? 1000
          : 800,
      );
    }
  }, [queue]);

  // Icon based on stage
  const icon_type = (item) => {
    if (offline) return <IconOffline />;
    else if (item?.error) return <IconBlind />;
    else if (item?.success) return <IconEye />;
    else if (item?.retry_id) return <IconLoading />;
    else if (item?.validator) return <IconLightning />;
    else if (item?.rpc) return <IconLoading />;
    else return <IconLoading />;
  };

  const item = queue?.[0];
  const success = !item?.done && item?.success;
  const error = !item?.done && item?.error;
  const retry = item?.retry_id;
  const color = theme.text[success ? 'success' : error ? 'error' : 'base'];
  const active = offline || current_text;

  return (
    <_mutations
      onClick={() => removeFromQueue(item)}
      ref={mutations_ref}
      $active={active}
    >
      <AnimatePresence>
        {active && (
          <AnimateMutations key={'unique-mutations'}>
            <_wrapper $success={success} $error={error}>
              <_overlay>
                {!success && !error && (
                  <AnimateShimmer key={'unique-shimmer'} width={width}>
                    <_shimmer
                      $height={height}
                      $success={success}
                      $error={error}
                    />
                  </AnimateShimmer>
                )}
              </_overlay>
              <_container key={'unique-kee'}>
                <_body>
                  <_icon $color={color}>{icon_type(queue[0])}</_icon>
                  <_text $color={color}>
                    <span>
                      {current_text}
                      {retry && ` ${t('mutation.retry')}`}
                    </span>
                  </_text>
                </_body>
                <_queue $success={success} $error={error}>
                  <span>{queue?.length > 1 ? queue?.length - 1 : ''}</span>
                  <_float>
                    {!offline && !success && !error && (
                      <AnimateSpinner key={'unique-spinner'}>
                        <_spinner>
                          <IconSpinner color={color} />
                        </_spinner>
                      </AnimateSpinner>
                    )}
                  </_float>
                </_queue>
              </_container>
            </_wrapper>
          </AnimateMutations>
        )}
      </AnimatePresence>
    </_mutations>
  );
});

export default Mutations;
