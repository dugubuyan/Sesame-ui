import { createContext, useContext } from 'react';
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: "fa21b2ba088ed4d4d7c11fb43a8cd60d",
});

const ClientContext = createContext(client);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider = ({ children }) => {
  return (
    <ClientContext.Provider value={client}>
      {children}
    </ClientContext.Provider>
  );
};