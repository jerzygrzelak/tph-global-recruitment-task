import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from 'primereact/button';

const Header: React.FC = () => {
    const {data: session} = useSession();

    return (
            <div className="flex flex-row align-items-center justify-content-end gap-4">
                <p>
                    {session?.user.name} ({session?.user.email})
                </p>
                <Button onClick={() => signOut()} label="Log out" icon="pi pi-sign-out" className="p-button-sm p-mt-2"/>
            </div>
    );
};

export default Header;