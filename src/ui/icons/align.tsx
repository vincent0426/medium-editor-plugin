import { CiAlignRight, CiAlignCenterV, CiAlignLeft } from 'react-icons/ci';
import * as React from 'react';

type IconcType = {
    style?: string;
  };

export const AlignLeftIcon = ({ style }: IconcType) => {
  return <CiAlignLeft className={`${style}`} />;
};
  
export const AlignCenterIcon = ({ style }: IconcType) => {
  return <CiAlignCenterV className={`${style}`} />;
};
  
export const AlignRightIcon = ({ style }: IconcType) => {
  return <CiAlignRight className={`${style}`} />;
};