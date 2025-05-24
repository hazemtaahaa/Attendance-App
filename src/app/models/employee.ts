export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    phoneNumber: string;
    nationalId: string;
    email?: string; // Optional field for email
}