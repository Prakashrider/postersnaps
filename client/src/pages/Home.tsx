import { User } from 'firebase/auth';
import PosterGenerator from '@/components/PosterGenerator';
import AdminDashboard from '@/components/AdminDashboard';

interface HomeProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

export default function Home({ user, onAuthModalOpen }: HomeProps) {
  return (
    <>
      <PosterGenerator user={user} />
      <AdminDashboard user={user} />
    </>
  );
}
