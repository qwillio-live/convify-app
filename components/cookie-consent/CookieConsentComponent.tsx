'use client'
import React, { useEffect } from 'react';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import { getConfig } from './cookieConsentConfig';
import { useParams } from 'next/navigation';

export const CookieConsentComponent = ({forceShow = false}) => {
  const params = useParams();
  const locale = params?.locale as string | undefined;
  useEffect(() => {
    setTimeout(()=> {
        CookieConsent.run(getConfig(locale ?? "en"));
        if(forceShow){
            CookieConsent.show(true)
    }
    }, 1000)
  }, []);

  return (
    <></>
  );
};