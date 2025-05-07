import HomeHeader from '@/components/home/home-header';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <HomeHeader />
      {children}
    </div>
  );
}
