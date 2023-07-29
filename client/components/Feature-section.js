import {
  SunIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const FeatureSection = () => {
  const features = [
    {
      name: "50+ various recipes",
      description:
        "Recipes are divided into many categories. Experienced chef or beginner cook? Meat lover or veggie fan? You will find recipes that fit your needs for free!",
      icon: ClipboardDocumentListIcon,
    },
    {
      name: "Recipe authenticity guaranteed",
      description:
        'Say NO to "fake" Chinese dishes! All recipes are provided by pro-Northeastern Chinese chefs. What you cook is the exact same as what a Northeastern Chinese family eats at home!',

      icon: CheckBadgeIcon,
    },
    {
      name: "No ambiguity",
      description:
        "Step-by-step procedures to guide you in cooking an authentic Northeastern Chinese dish. Original recipe videos are also provided to make everything crystal clear!",

      icon: SunIcon,
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-orange-600">
            Cook better
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Enjoy the freshness and deliciousness without stepping out of the
            house.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Are you still paying big bucks for oily and unappetizing Chinese
            food takeout? Try one of our recipes today with easy-to-find
            ingredients at home.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-orange-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  {/* <p className="mt-6">
                    <a
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-indigo-600"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p> */}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
