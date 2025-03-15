export interface Auth {
    _id: string;
    avatar?: {
        data: string;
        contentType: string;
    } | File;
    name?: string;
    bio?: string;
    phone?: string;
    birthDate?: Date | null;
    profession?: string;
}

export interface AuthContextProps {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
    charging: boolean;
    logOut: () => void;
    updateUser: (user:Auth) => Promise<void>;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const defaultAuth: Auth = {
    _id: '',
    avatar: undefined,
    name: '',
    bio: '',
    phone: '',
    birthDate: undefined,
    profession: ''
};