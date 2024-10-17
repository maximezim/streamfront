// brokerService.d.ts

export function connectToBroker(onMessageReceived: (message: string) => void): void;
export function sendMessage(message: string): void;
export function brokerService(): void;
export function sendStream(id: number, setVideoData: Dispatch<SetStateAction<Uint8Array | null>>): void {}
