import {
  _skeleton,
  _shimmer,
  _icon,
  _item,
  _inventory,
  _queue,
  _title,
  _actions,
  _action,
} from './Skeleton.styled';
import React from 'react';

const Skeleton = () => {
  return (
    <_skeleton>
      <_item>
        <_inventory>
          <_icon>
            <_shimmer />
          </_icon>
        </_inventory>
        <_queue>
          <_title>
            <_shimmer />
          </_title>
          <_actions>
            <_action>
              <_shimmer />
            </_action>
            <_action>
              <_shimmer />
            </_action>
            <_action>
              <_shimmer />
            </_action>
          </_actions>
        </_queue>
      </_item>
      <_item>
        <_inventory>
          <_icon>
            <_shimmer />
          </_icon>
        </_inventory>
        <_queue>
          <_title>
            <_shimmer />
          </_title>
          <_actions>
            <_action>
              <_shimmer />
            </_action>
            <_action>
              <_shimmer />
            </_action>
            <_action>
              <_shimmer />
            </_action>
          </_actions>
        </_queue>
      </_item>
      <_item>
        <_inventory>
          <_icon>
            <_shimmer />
          </_icon>
        </_inventory>
        <_queue>
          <_title>
            <_shimmer />
          </_title>
          <_actions>
            <_action>
              <_shimmer />
            </_action>
            <_action>
              <_shimmer />
            </_action>
            <_action>
              <_shimmer />
            </_action>
          </_actions>
        </_queue>
      </_item>
    </_skeleton>
  );
};

export default Skeleton;
