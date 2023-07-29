import Image from "next/image";
import NavBar from "@/components/Navbar";
import Cookies from "cookies";
import axios from "axios";
import Head from "next/head";
const AboutUs = ({ currentUser }) => {
  const people = [
    {
      name: "Taichen Ling",
      role: `Frontend Developer/Backend Developer/
      Recipe Selector/Recipe Translator`,
      imageUrl: "/testmonial.jpg",
      bio: "This is me. I am responsible for the front-end design, back-end design, data selection, recipe translation, and database seeding of this micro-service website. The intention behind this website is driven by personal interest. RecipeNE is the first website I have developed as a full-stack project. The purpose of this website is to enhance and improve my coding skills and system design abilities. Additionally, I hope that this website can assist visitors in cooking delicious dishes from Northeastern China.",
      twitterUrl: "#",
      linkedinUrl: "#",
    },
    {
      name: "Mooncake Ling",
      role: "Emotional Supporter/Recipe Tester",
      imageUrl: "/mooncake.png",
      bio: "Mooncake is a 4-year-old American Eskimo. His favorite activities include hiking, running, and playing with squeaky toys. His preferred foods are peanut butter and scrambled eggs. Mooncake played a significant role in the development of this website, providing me with emotional support and daily exercise. He also served as a tester for several dog-friendly recipes, and he absolutely loves them!",
    },
  ];

  return (
    <>
      <Head>
        <title>About Us</title>
        <meta
          name="description"
          content="
          A brief introduction to the developer team of this project. "
        ></meta>
      </Head>
      <NavBar currentUser={currentUser} />
      <div className="bg-white py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-5">
          <div className="max-w-2xl xl:col-span-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About us
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              As an enthusiastic and vibrant duo, we have invested a great deal
              of effort into this website. Our goal is to provide content that
              not only helps our customers but also promotes Northeastern
              Chinese cuisine. We are passionate about what we do and hope that
              RecipeNE can assist you in preparing the most authentic
              Northeastern Chinese dishes in the comfort of your home.
            </p>
          </div>
          <ul
            role="list"
            className="-mt-12 space-y-12 divide-y divide-gray-200 xl:col-span-3"
          >
            {people.map((person) => (
              <li
                key={person.name}
                className="flex flex-col gap-10 pt-12 sm:flex-row"
              >
                <img
                  className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                  src={person.imageUrl}
                  alt="Team member photo"
                  height={364}
                  width={208}
                />
                <div className="max-w-xl flex-auto">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                    {person.name}
                  </h3>
                  <p className="text-base leading-7 text-gray-600">
                    {person.role}
                  </p>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    {person.bio}
                  </p>
                  {/* <ul role="list" className="mt-6 flex gap-x-6">
                  <li>
                    <a
                      href={person.twitterUrl}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href={person.linkedinUrl}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                </ul> */}
                </div>
              </li>
            ))}
          </ul>
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
      "http://www.recipe-ne.com/api/v1/users/currentuser",
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
      if (err.response.data.errors.message === `Token Expired`) {
        const refreshResponse = await axios.post(
          `http://www.recipe-ne.com/api/v1/users/refresh-token`,
          {},
          {
            headers: {
              Host: "recipe-ne.com",
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

export default AboutUs;
