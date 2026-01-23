
import { useAuth } from '../../context/AuthContext';
import DonorHome from './home/DonorHome';
import HospitalHome from './home/HospitalHome';
import OrgHome from './home/OrgHome';

const DashboardHome = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    switch (user.role) {
        case 'donor': return <DonorHome />;
        case 'hospital': return <HospitalHome />;
        case 'organization': return <OrgHome />;
        default: return <DonorHome />;
    }
};

export default DashboardHome;
