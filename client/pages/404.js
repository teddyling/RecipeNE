const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404 Not Found</title>
        <meta
          name="description"
          content="
          Not Found"
        ></meta>
      </Head>
      <div className="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] bg-white lg:grid-cols-[max(50%,36rem),1fr]">
        <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
          <div className="max-w-lg">
            <p className="text-2xl font-semibold leading-8 text-orange-600">
              404
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-6 text-xl leading-7 text-gray-600">
              Oops, Mooncake ate your page again.
            </p>
            <div className="mt-10">
              <a
                href="/"
                className="text-sm font-semibold leading-7 text-orange-600 hover:text-orange-400"
              >
                <span aria-hidden="true">&larr;</span> Back to home
              </a>
            </div>
          </div>
        </main>

        <div className="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
          <img
            src="/404.jpg"
            alt="Image of Mooncake"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
