export interface IUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
};

export interface IUserResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: IUser[];
};

export interface ICachedPage {
    page: number;
    users: IUser[];
};

export interface IToast {
    id: string;
    message: string;
    success: boolean;
};

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
};

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    className?: string;
    containerClassName?: string;
    reference?: React.RefObject<HTMLInputElement>;
};
