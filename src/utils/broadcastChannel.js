
const createBroadcastChannel = (name, onmessage) => {
  return {
    channel: null,
    listen() {
      this.channel = new BroadcastChannel(name);
      this.channel.onmessage = onmessage;
    },
    send(message) {
      if(this.channel) {
        this.channel.postMessage(message);
      }
    }
  };

};

export const reloadChannel = createBroadcastChannel('RELOAD', () => {
  if (typeof window !== 'undefined') {
    location.reload();
  }
});
