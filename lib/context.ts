import { createContext } from 'react';
import { User } from 'firebase/auth';

interface UserContextType {
    user: User | null | undefined
    username: string | null
}

const userContext: UserContextType = {
    user: null,
    username: null
}

export const UserContext = createContext(userContext);
