'use client'
import React, { useEffect } from 'react';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import { getConfig } from './cookieConsentConfig';
import { useParams } from 'next/navigation';

export const CookieConsentComponent = ({forceShow = false, hidePopup = false}) => {
  const params = useParams();
  const locale = params?.locale as string | undefined;
  useEffect(() => {
    setTimeout(()=> {
      if(window && window?.name !== "preview") {
        CookieConsent.run(getConfig(locale ?? "en"));
        if(forceShow){
            CookieConsent.show(true)}
    }
    }, 1000)
  }, [window.name]);

  return (
    <></>
  );
};