import { motion } from 'framer-motion';
import { CSSProperties, ReactElement } from 'react';

export interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

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
    onClick?: () => void;
    disabled?: boolean;
}

export interface AuthDialogProps {
    type?: AuthDialogType
    layoutId?: string
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

export interface DownArrowProps {
    classes?: string | string[];
    handleClick: () => void;
    isExpanded: boolean;
}

interface FadeOptions {
    fadeContent: boolean;
    overflow: false;
    fadeWidth: number;
    fadeAlpha: number;
    fadeInset: number;
}

interface TransitionControl {
    type: string;
    ease: string;
    duration: number;
}

export interface TickerProps {
    slots: ReactElement[];
    gap: number;
    padding: number;
    paddingPerSide?: boolean;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    speed?: number;
    hoverFactor?: number;
    direction?: string | boolean;
    alignment?: string;
    fadeOptions?: FadeOptions;
    transitionControl?: TransitionControl;
    style?: CSSProperties;
}

export interface TickerCardProps {
    id: string;
    style?: CSSProperties;
    data?: { [key: string]: any };
}

export type ButtonType = 'login' | 'signup' | 'edit' | 'delete' | 'continue';

export type AuthDialogType = 'login' | 'signup';

export type NavOption = 'Dashboard' | 'Deployments' | 'Live View' | null;

export type MotionDivProps = React.ComponentProps<typeof motion.div>;

export type RepeatType = "loop" | "reverse" | "mirror";

export type tickerDirection = 1 | -1;