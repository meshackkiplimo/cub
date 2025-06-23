




export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType;
    link: string;


}

export const AdminDrawerData: DrawerData[] = [
    {
        id: '1',
        name: 'Dashboard',
        icon: React.Fragment, // Placeholder for icon, can be replaced with an actual icon component
        link: '/admin/dashboard'
    },
    {
        id: '2',
        name: 'Users',
        icon: () => <i className="fas fa-users"></i>,
        link: '/admin/users'
    },
    {
        id: '3',
        name: 'Settings',
        icon: () => <i className="fas fa-cog"></i>,
        link: '/admin/settings'
    }
];