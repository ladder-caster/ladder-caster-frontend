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
import { CREATE_MUTATION, USER_OFFLINE } from 'core/remix/state';
import { AnimatePresence } from 'framer-motion';
import { AnimateMutations } from './animations/AnimateMutations';
import { useTranslation } from 'react-i18next';
import { AnimateShimmer } from './animations/AnimateShimmer';
import { useSize } from 'core/hooks/useSize';
import { cloneDeep, findIndex, isEqual } from 'lodash';
import { IconLoading } from 'design/icons/loading.icon';
import { IconLightning } from 'design/icons/lightning.icon';
import { IconEye } from 'design/icons/eye.icon';
import { fetching } from 'core/remix/fetching';
import { IconSpinner } from 'design/icons/spinner.icon';
import { AnimateSpinner } from './animations/AnimateSpinner';
import { IconBlind } from 'design/icons/blind.icon';
import { IconOffline } from 'design/icons/offline.icon';
import { withTheme } from 'styled-components';
import { TxStates } from 'sdk/src/hooks/useMutations';

const Mutations = withTheme(({ theme }) => {
  const { t } = useTranslation();
  const mutations_ref = useRef();
  const { width, height } = useSize(mutations_ref);
  const [mutation, setMutation] = useRemix(CREATE_MUTATION);
  const [offline] = useRemix(USER_OFFLINE);
  const [queue, setQueue] = useState([]);

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

      if (item.state === TxStates.ERROR)
        return error_text
          ? error_text
          : t(text ? `error.${text}` : 'mutation.error');
      else if (item.state === TxStates.SUCCESS || item.state === TxStates.DONE)
        return t(text ? `success.${text}` : 'mutation.success');
      else if (item.state === TxStates.EXECUTING)
        return t(text ? `loading.${text}` : 'mutation.validator');
      else if (item.state === TxStates.CONFIRMING)
        return t(text ? `loading.${text}` : 'mutation.loading');
      else return t('mutation.loading');
    }
  }, [queue, offline]);

  // Remove Queue
  const removeFromQueue = (item) => {
    //filters out items of same type in queue
    let next_queue = cloneDeep(queue).filter(
      (queueItem) => !isEqual(queueItem.type, item.type),
    );
    setQueue(next_queue);
  };

  useEffect(() => {
    const item = queue?.[0];
    const pending_item = queue?.[1];
    if (
      [TxStates.DONE, TxStates.SUCCESS, TxStates.ERROR].includes(item?.state)
    ) {
      setTimeout(
        () => removeFromQueue(item),
        pending_item
          ? 1000
          : item?.state === TxStates.ERROR
          ? 3000
          : item?.state === TxStates.DONE
          ? 2000
          : item?.state === TxStates.SUCCESS
          ? 3000
          : 1000,
      );
    }
  }, [queue]);

  // Icon based on stage
  const icon_type = (item) => {
    if (offline) return <IconOffline />;

    switch (item?.state) {
      case TxStates.ERROR: {
        return <IconBlind />;
      }
      case TxStates.SUCCESS: {
        return <IconEye />;
      }
      case TxStates.CONFIRMING: {
        return <IconLightning />;
      }
      case TxStates.RETRYING:
      case TxStates.EXECUTING:
      default: {
        return <IconLoading />;
      }
    }
  };

  const item = queue?.[0];
  const success = item?.state === TxStates.SUCCESS;
  const error = item?.state === TxStates.ERROR;
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
                    <span>{current_text}</span>
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
