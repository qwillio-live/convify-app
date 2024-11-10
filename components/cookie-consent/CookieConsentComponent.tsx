'use client'
import React, { useEffect } from 'react';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import { config } from './cookieConsentConfig';

export const CookieConsentComponent = ({forceShow = false}) => {
  useEffect(() => {
    setTimeout(()=> {
        
        CookieConsent.run(config);
        if(forceShow){
            CookieConsent.show(true)
    }
    }, 1000)
  }, []);

  return (
    <></>
  );
};