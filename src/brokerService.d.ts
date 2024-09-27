// brokerService.d.ts

export function connectToBroker(onMessageReceived: (message: string) => void): void;
export function sendMessage(message: string): void;