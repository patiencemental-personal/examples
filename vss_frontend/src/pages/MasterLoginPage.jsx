import React from 'react';
import { useEffect } from 'react';
import EmptyLayout from '../components/layouts/EmptyLayout';
import popupType from '../lib/popupType';
import { useMasterStore } from '../stores/useMasterStore'; // eslint-disable-line no-unused-vars
import { usePopupStore } from '../stores/usePopupStore';

const MasterLoginPage = () => {

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);

  useEffect(() => {
    openPopup({ 
      type: popupType.MASTER_LOGIN,
    });

    return () => {
      closePopup();
    };
  }, [openPopup, closePopup]);

  return <EmptyLayout />;
};

export default MasterLoginPage;