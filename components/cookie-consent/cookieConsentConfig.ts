import type { CookieConsentConfig } from 'vanilla-cookieconsent';

const translations = {
    en: {
        consentModal: {
            title: "Hello traveller, it's cookie time!",
            description: `We use cookies and other similar technologies (collectively referred to as "Cookies") on our website. Some of these are essential, while others help us enhance this website and improve your experience.`,
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            footer: "<a href=\"#link\">Privacy Policy</a>\n<a href=\"#link\">Terms and conditions</a>"
        },
        preferencesModal: {
            title: "Consent Preferences Center",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            savePreferencesBtn: "Save preferences",
            closeIconLabel: "Close modal",
            serviceCounterLabel: "Service|Services",
            sections: [
                {
                    title: "Cookie Usage",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                },
                {
                    title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    linkedCategory: "necessary"
                },
                {
                    title: "Functionality Cookies",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    linkedCategory: "functionality"
                },
                {
                    title: "Analytics Cookies",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    linkedCategory: "analytics"
                },
                {
                    title: "Advertisement Cookies",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    linkedCategory: "marketing"
                },
                {
                    title: "More information",
                    description: "For any query in relation to my policy on cookies and your choices, please <a class=\"cc__link\" href=\"#yourdomain.com\">contact me</a>."
                }
            ]
        }
    },
    pt: {
        "consentModal": {
            "title": "Olá, viajante, é hora dos cookies!",
            "description": `Utilizamos cookies e outras tecnologias semelhantes (referidas coletivamente como "Cookies") em nosso site. Alguns deles são essenciais, enquanto outros nos ajudam a aprimorar este site e melhorar sua experiência.`,
            "acceptAllBtn": "Aceitar todos",
            "acceptNecessaryBtn": "Rejeitar todos",
            "footer": "<a href=\"#link\">Política de Privacidade</a>\n<a href=\"#link\">Termos e Condições</a>"
        },
        "preferencesModal": {
            "title": "Centro de Preferências de Consentimento",
            "acceptAllBtn": "Aceitar todos",
            "acceptNecessaryBtn": "Rejeitar todos",
            "savePreferencesBtn": "Salvar preferências",
            "closeIconLabel": "Fechar modal",
            "serviceCounterLabel": "Serviço|Serviços",
            "sections": [
                {
                    "title": "Uso de Cookies",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                },
                {
                    "title": "Cookies Estritamente Necessários <span class=\"pm__badge\">Sempre Ativados</span>",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "linkedCategory": "necessary"
                },
                {
                    "title": "Cookies de Funcionalidade",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "linkedCategory": "functionality"
                },
                {
                    "title": "Cookies de Análise",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "linkedCategory": "analytics"
                },
                {
                    "title": "Cookies de Publicidade",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "linkedCategory": "marketing"
                },
                {
                    "title": "Mais informações",
                    "description": "Para qualquer dúvida em relação à minha política de cookies e suas escolhas, por favor <a class=\"cc__link\" href=\"#yourdomain.com\">entre em contato</a>."
                }
            ]
        }
    }
}

export const getConfig = (locale = "en") => {
    const config: CookieConsentConfig = {
        disablePageInteraction: true,
        guiOptions: {
            consentModal: {
                layout: "box inline",
                position: "bottom left",
                equalWeightButtons: false,
                flipButtons: false
            },
            preferencesModal: {
                layout: "box",
                position: "right",
                equalWeightButtons: true,
                flipButtons: false
            }
        },
        categories: {
            necessary: {
                readOnly: true
            },
            analytics: {}
        },
        language: {
            default: locale,
            translations: translations
        }
    }
    return config
}