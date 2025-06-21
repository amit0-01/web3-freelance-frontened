export interface LoginPayload {
    name: string;
    email: string;
    password: string;
    walletAddress: string;
    role: string | null;
}
