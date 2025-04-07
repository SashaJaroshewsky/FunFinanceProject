export interface FamilyInvitation {
    id: number;
    familyId: number;
    email: string;
    token: string;
    isAccepted: boolean;
    expiresAt: string;
    createdAt: string;
}