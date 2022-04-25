import React from 'react';
import { _swap, _form, _row, _section, _input, _float, _checkbox, _percent, _submit } from './SwapTab.styled';
import Checkbox from '../../checkbox/Checkbox';
import Input from '../../input/Input';

const SwapTab = () => {
    
    return (
        <_swap>
          <_form>
            <_row>
              <_section>
                <_input>
                  <_float>
                    <_checkbox>
                      <Checkbox/>
                    </_checkbox>
                    <Input/>
                  </_float>
                </_input>
              </_section>
              <_percent>
  
              </_percent>
            </_row>
            <_row>
              <_section>
                <_input>
                  <_float>
                    <_checkbox>
                      <Checkbox/>
                    </_checkbox>
                    <Input/>
                  </_float>
                </_input>
              </_section>
              <_percent>
  
              </_percent>
            </_row>
            <_row>
              <_section>
  
              </_section>
              <_percent>
  
              </_percent>
            </_row>
            <_row>
              <_section>
                <_submit>
                
                </_submit>
              </_section>
              <_percent>
              
              </_percent>
            </_row>
          </_form>
        </_swap>
    );
};

export default SwapTab;

