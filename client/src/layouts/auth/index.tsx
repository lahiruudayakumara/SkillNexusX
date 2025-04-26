import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="dashboard-layout">
            <header>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}

export default AuthLayout;