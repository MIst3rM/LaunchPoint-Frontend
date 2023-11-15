import { motion } from 'framer-motion';

export interface ContainerProps {
    children: React.ReactNode;
    customProps?: CustomProps;
}

export interface CustomProps {
    classes?: string | string[];
    effects?: Partial<MotionDivProps>;
}

export interface SidebarProps {
    openSidebar: (isOpen: boolean) => void;
    navClasses?: string | string[];
    backgroundClasses?: string | string[];
}

export interface HeroProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

export interface ButtonProps {
    text: string
    type: ButtonType
    layoutId?: string
    showDialog?: (isOpen: boolean) => void;
}

export interface AuthDialogProps {
    type: AuthDialogType
    layoutId?: string
    isOpen: boolean
    showDialog?: (isOpen: boolean) => void;
}

export interface OverlayProps {
    isOpen: boolean
}

export interface CounterProps {
    targetDigits: Array<number>
}

export interface HealthStatusIndicatorProps {
    healthPercentage: number;
    isSidebarOpen: boolean;
}

export interface MenuContainerProps {
    selectedNavOption: NavOption;
    selectedNavOptionPosition: { x: number }
}

export type ButtonType = 'login' | 'signup' | 'edit' | 'delete';

export type AuthDialogType = 'login' | 'signup';

export type NavOption = 'Dashboard' | 'Deployments' | 'Live View'

export type MotionDivProps = React.ComponentProps<typeof motion.div>;

export type RepeatType = "loop" | "reverse" | "mirror";