import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go back to Home
      </Link>
    </div>
  );
}