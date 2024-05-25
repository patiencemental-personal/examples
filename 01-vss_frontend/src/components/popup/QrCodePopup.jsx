import React from 'react';
import {
  PopupTemplate,
  Button
} from './common/index';
import { usePopupStore } from '../../stores/usePopupStore';
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";

const templateStyles = {
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const buttonStyles = {
  fontSize: '1rem',
  padding: '0.6rem 1rem',
  marginTop: '1rem',
  width: '70%',
}

const QRcodeDiv = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem',
}

const buttonDiv = {
  display: 'flex',
  justifyContent: 'center',
}

const QrCodePopup = ({ qrValue, title }) => {
  const closePopup = usePopupStore((state) => state.close);
  const downloadQR = () => {
    const canvas = document.getElementById("compeQR");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${title} QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <>
      <PopupTemplate styles={templateStyles} applyMediaQuery={false}>
        <div style={QRcodeDiv}>
          <QRCode
            id='compeQR'
            size={128}
            level={"H"}
            includeMargin={true}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={qrValue}
          />
        </div>

        <div style={buttonDiv}>
          <Button
            name='닫 기'
            onClick={closePopup}
            styles={buttonStyles}
          />
          <Button
            name='다운로드'
            onClick={downloadQR}
            styles={buttonStyles}
          />
        </div>
      
    </PopupTemplate>
    </>
  );
};

export default QrCodePopup;