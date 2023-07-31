import Image from "next/image";
import NavBar from "@/components/Navbar";
import Cookies from "cookies";
import axios from "axios";
import Head from "next/head";
const NorthEasternPage = ({ currentUser }) => {
  return (
    <>
      <Head>
        <title>About Northeastern</title>
        <meta
          name="description"
          content="
          An Introduction to Northeast China, allowing you to have a better understanding of this beautiful region."
        ></meta>
      </Head>
      <NavBar currentUser={currentUser} />
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Brief Introduction to Northeast China
            </h1>
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
              <div>
                <p>
                  Northeast China, also known as Dongbei (东北), is a region
                  located in the northeastern part of China. It consists of
                  three provinces: Heilongjiang, Jilin, and Liaoning. This
                  region is known for its rich cultural heritage, diverse
                  landscapes, distinctive cuisine.
                </p>
                <p className="mt-8">
                  Northeast China experiences a continental climate
                  characterized by distinct seasons and significant temperature
                  variations throughout the year. The winter here is
                  particularly cold, with heavy snowfalls. The unique climate of
                  Northeast China has made it a popular tourist destination in
                  China and worldwide. Moreover, the warm-heartedness,
                  hospitality, and straightforwardness of the people in
                  Northeast China have become prominent characteristics of the
                  region.
                </p>
              </div>
              <div>
                <p>
                  Northeast China is also home to stunning natural landscapes,
                  including mountains, forests, and lakes. Changbai (long-white)
                  Mountain, located on the border between China and North Korea,
                  is a majestic peak known for its stunning scenery, hot
                  springs, and the spectacular Tianchi (Heavenly Lake) at its
                  summit. Here becomes a popular destination for nature lovers!
                </p>
                <p className="mt-8">
                  In addition, Northeast China is an important industrial and
                  economic region. The area is rich in natural resources,
                  including coal, oil, and minerals, which have contributed to
                  its development as an industrial hub. The Northeast region is
                  often called the "Eastern Ruhr" due to its powerful industrial
                  system.
                </p>
              </div>
            </div>
            <p className="mt-10">
              <a
                href="https://en.wikipedia.org/wiki/Northeast_China"
                className="text-sm font-semibold leading-6 text-orange-600 hover:text-orange-400"
                target="_blank"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              src="/about-northeastern1.jpg"
              alt="A photo of Northeastern China"
              height={810.6}
              width={1216}
              priority
            />
            {/* <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div> */}
          </div>
        </div>
      </div>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About Northeastern Chinese cuisine
            </h1>
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
              <div>
                <p>
                  Northeastern Chinese cuisine, also known as Dongbei cuisine,
                  is a unique local culinary style that combines the cooking
                  techniques of Han Chinese immigrants with the abundant
                  resources of Northeast China. It also incorporates elements
                  from ethnic groups such as the Manchu and Mongolian, as well
                  as influences from foreign cuisines, resulting in a
                  distinctive style and flavor profile.
                </p>
                <p className="mt-8">
                  The cooking techniques inherited from Han Chinese immigrants
                  form the foundation of Dongbei cuisine. These techniques
                  include stir-frying, stewing, boiling, and deep-frying, which
                  are widely employed in the preparation of dishes. They help
                  preserve the authentic flavors and create rich and satisfying
                  tastes.
                </p>
              </div>
              <div>
                <p>
                  The region's bountiful resources provide a wide array of
                  ingredients for Dongbei cuisine. Staple ingredients include
                  soybeans, corn, wheat, potato, eggplant, cabbage, and meats
                  like pork, beef, lamb, and chicken. These ingredients are
                  skillfully incorporated into various dishes, contributing to
                  the unique flavors and regional characteristics of Dongbei
                  cuisine.
                </p>
                <p className="mt-8">
                  Dongbei cuisine also incorporates culinary traditions from
                  ethnic groups such as the Manchu and Mongolian and elements
                  from foreign cuisines. Furthermore, the region's historical
                  connections with countries like Russia have left traces of
                  Russian-style ingredients and cooking methods in Dongbei
                  cuisine.
                </p>
              </div>
            </div>
            <p className="mt-10">
              <a
                href="https://en.wikipedia.org/wiki/Northeastern_Chinese_cuisine"
                className="text-sm font-semibold leading-6 text-orange-600 hover:text-orange-400"
                target="_blank"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              src="/about-northeastern2.png"
              alt="A Northeastern Chinese dish"
              height={810.6}
              width={1216}
            />
            {/* <div className="relative" aria-hidden="true">
              <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const cookies = new Cookies(req, res);
  try {
    const response = await axios.get(
      "https://www.recipe-ne.com/api/v1/users/currentuser",
      {
        headers: {
          Host: "www.recipe-ne.com",
          Cookie: req.headers.cookie,
        },
      }
    );

    const currentUser = response.data.currentUser;

    return {
      props: { currentUser },
    };
  } catch (err) {
    try {
      console.log("Trying to refresh token");
      if ((err.response.data.errors.message = `Token Expired`)) {
        const refreshResponse = await axios.post(
          `https://www.recipe-ne.com/api/v1/users/refresh-token`,
          {},
          {
            headers: {
              Host: "www.recipe-ne.com",
              Cookie: req.headers.cookie,
            },
          }
        );
        const refreshedEncodedCookie = btoa(
          JSON.stringify(refreshResponse.data)
        );
        const user = refreshResponse.data.user;

        cookies.set("session", refreshedEncodedCookie);
        return {
          props: { currentUser: user },
        };
      }
    } catch (err) {
      console.error(err);
      return {
        props: { currentUser: null },
      };
    }
  }
}

export default NorthEasternPage;
