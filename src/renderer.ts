const ipc_client = {
    invoke: async (channel: string, args: any) => {
      // @ts-ignore
      await window.ipc_client.invoke(channel, args);
    },
    removeListener:  (name: string, ...listener: Function[]) => {
      // @ts-ignore
      window.ipc_client.removeListener(name, ...listener);
    },
    addListener: (name: string, ...listener: Function[]) => {
      // @ts-ignore
      window.ipc_client.addListener(name, ...listener);
    }
  };
  
  export default ipc_client;
  