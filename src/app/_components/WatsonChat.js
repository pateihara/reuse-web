"use client";
import Script from "next/script";

/**
 * Componente para renderizar o Web Chat do IBM Watson Assistant.
 * As credenciais devem ser colocadas no .env como NEXT_PUBLIC_...
 */
export default function WatsonChat() {
  const integrationID = process.env.NEXT_PUBLIC_WATSON_INTEGRATION_ID;
  const region = process.env.NEXT_PUBLIC_WATSON_REGION || "us-south";
  const serviceInstanceID = process.env.NEXT_PUBLIC_WATSON_SERVICE_INSTANCE_ID;

  // Só renderiza se o ID estiver configurado para não dar erro
  if (!integrationID) {
    console.warn("WatsonChat: NEXT_PUBLIC_WATSON_INTEGRATION_ID não definido no .env");
    return null;
  }

  return (
    <Script
      id="watson-assistant-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.watsonAssistantChatOptions = {
            integrationID: "${integrationID}",
            region: "${region}",
            serviceInstanceID: "${serviceInstanceID}",
            onLoad: async (instance) => { await instance.render(); }
          };
          setTimeout(() => {
            const t = document.createElement('script');
            t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
            document.head.appendChild(t);
          }, 500);
        `,
      }}
    />
  );
}
