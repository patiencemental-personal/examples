import React from 'react';
import { usePopupStore } from '../../stores/usePopupStore';
import {
  PopupTemplate,
  PopupHead,
  PopupBody,
  PopupFooter,
  Message,
  Button
} from './common/index';
import CancleButton from '../common/CancleButton';

const cancleButtonStyles = {
  position: 'absolute',
  top: '1.7rem',
  right: '1.7rem'
}

const MessagePopup = ({ message, styles, buttons }) => {

  const close = usePopupStore((state) => state.close);

  return (
    <PopupTemplate>
      <CancleButton
        onClick={close}
        styles={cancleButtonStyles}
      />
      <PopupHead />
      <PopupBody>
        <Message message={message} styles={styles} />
      </PopupBody>
      <PopupFooter>
        {
          buttons ? (
            buttons.map((button, index) => {
              const { name, onClick, styles } = button;
              return <Button key={index} onClick={onClick} name={name} styles={styles} />
            })
          ) : (
            <Button onClick={close} name='확  인' />
          )
        }
      </PopupFooter>
    </PopupTemplate>
  );
};

export default MessagePopup;