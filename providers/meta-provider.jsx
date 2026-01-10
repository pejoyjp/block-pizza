"use client"
import React from 'react'
import { MetaMaskProvider } from "@metamask/sdk-react";

const MetaProvider = ({children}) => {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "Example React Dapp",
          url: window.location.href,
        },
        infuraAPIKey: process.env.INFURA_API_KEY,
        // Other options.
      }}
    >
      {children}
    </MetaMaskProvider>
  )
}

export default MetaProvider