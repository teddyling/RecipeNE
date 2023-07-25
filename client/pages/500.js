import Link from "next/link";

const ServerDownPage = () => {
  return (
    <main className="relative isolate min-h-full">
      <img
        src="https://images.unsplash.com/photo-1515125997599-60e752dbc864?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
      />
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <p className="text-base font-semibold leading-8 text-white">500</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Website Unavailable
        </h1>
        <p className="mt-4 text-base text-white/90 sm:mt-6">
          It seems that our site is temporarily unavailable. We are working on
          resolving the issue and will be back up and running shortly.
        </p>
        <div className="mt-10 flex justify-center">
          <Link href="/" className="text-sm font-semibold leading-7 text-white">
            <span aria-hidden="true">&larr;</span> Back to home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ServerDownPage;
