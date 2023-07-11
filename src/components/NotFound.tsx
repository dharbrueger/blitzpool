import Link from 'next/link';
import Image from 'next/image';
import NotFoundImage from '../../public/404.png';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col text-white items-center justify-center min-h-screen bg-gradient-to-b from-[#202232] to-[#0D0D10]">
      <h1 className="text-4xl font-bold mb-4">Oops! Page not found</h1>
      <p className="text-lg text-gray-400 mb-8">We're working on it...</p>
      <div className="w-96">
        <Image src={NotFoundImage} alt="Not Found" layout="responsive" width={1200} height={800} />
      </div>
      <div className={`text-l px-4 rounded-full bg-white/10 px-10 py-3 text-white transition hover:bg-white/20`}>
          <Link href="/">Return Home</Link>
        </div>
    </div>
  );
};

export default NotFound;
