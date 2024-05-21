import React from 'react';
import { useEffect } from 'react';
import EmptyLayout from '../components/layouts/EmptyLayout';
import popupType from '../lib/popupType';
import { usePopupStore } from '../stores/usePopupStore';

const AdminLoginPage = () => {

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);

  useEffect(() => {
    openPopup({ 
      type: popupType.ADMIN_LOGIN,
    });

    return () => {
      closePopup();
    };
  }, [openPopup, closePopup]);

  return <EmptyLayout />;
};

export default AdminLoginPage;