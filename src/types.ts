import { motion } from 'framer-motion';
import { CSSProperties, ReactElement } from 'react';
import { Models, Client } from "appwrite";
import * as THREE from 'three'

export enum status{
    available = 'AVAILABLE',
    unavailable = 'UNAVAILABLE',
    maintenance = 'MAINTENANCE_NEEDED',
    inuse = 'IN_USE'
}

export interface Station {
    online: boolean;
    status: status;
    location: string;
    last_online: string;
    batteries: Battery[];
    name: string;
}

export interface Battery{
    status: status;
    capacity: number;
    charge_level: number;
    station: Station[];
    drone_model: string;
}

export interface ImageData {
    position: [number, number, number];
    rotation: [number, number, number];
    url: string;
    title?: string;
}

export interface DeploymentsProps {
    images: ImageData[];
}

export interface FrameProps {
    url: string;
    c?: THREE.Color;
    details: () => void;
}

export interface FramesProps {
    images: ImageData[];
    q?: THREE.Quaternion;
    p?: THREE.Vector3;
}

export interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface AuthContextType {
    loggedInUser: Models.User<Models.Preferences> | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchLoggedInUser: () => Promise<void>;
    loading: boolean;
    client: Client;
}

export interface RootRouteProps {
    loggedInUser: Models.User<Models.Preferences> | null;
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
    style?: CSSProperties;
    data?: any;
}

export type ButtonType = 'login' | 'logout' | 'signup' | 'edit' | 'delete' | 'continue' | 'seemore';

export type AuthDialogType = 'login' | 'signup';

export type NavOption = 'Dashboard' | 'Deployments' | 'Live View' | null;

export type MotionDivProps = React.ComponentProps<typeof motion.div>;

export type RepeatType = "loop" | "reverse" | "mirror";

export type tickerDirection = 1 | -1;