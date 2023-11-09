export interface ContainerProps {
    children: React.ReactNode;
    customStyles?: React.CSSProperties;
}

export interface HeroProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export interface ButtonProps {
    text: string
    type: ButtonType
    layoutId?: string
    showDialog?: (isOpen: boolean) => void;
}

export interface AuthDialogProps {
    type: AuthDialogType
    layoudId?: string
    isOpen: boolean
    showDialog?: (isOpen: boolean) => void;
}

export interface OverlayProps {
    isOpen: boolean
}

export type ButtonType = 'login' | 'signup' | 'edit' | 'delete';

export type AuthDialogType = 'login' | 'signup';

export type NavOption = 'Dashboard' | 'Deployments' | 'Live View'