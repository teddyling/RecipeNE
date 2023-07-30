import NavBar from "@/components/Navbar";
import PageHeader from "@/components/Page-Header";
import Cookies from "cookies";
import axios from "axios";
import RecipeList from "@/components/RecipeList";
import Head from "next/head";

const MustKnow = ({ currentUser, recipes }) => {
  return (
    <>
      <Head>
        <title>Recipes you must know</title>
        <meta
          name="description"
          content="
          When it comes to Northeastern cuisine, these dishes are always mentioned. They are a must-try when it comes to Northeastern cuisine as they represent the soul of the region."
        ></meta>
      </Head>
      <NavBar currentUser={currentUser} />
      <PageHeader
        heading="The recipes you must know"
        subHeading="When it comes to Northeastern Chinese cuisine, these recipes are always mentioned. They represent the essence of Northeastern Chinese cuisine."
        bgImageURL="/must-know-header.png"
      />
      <div className="bg-white mt-12">
        <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
          <RecipeList recipes={recipes} />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const recipeResponse = await axios.get(
    "http://www.recipe-ne.com/api/v1/recipes/must-know",
    {
      headers: {
        Host: "www.recipe-ne.com",
      },
    }
  );
  const recipes = recipeResponse.data.recipes;

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
      props: { currentUser, recipes },
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
          props: { currentUser: user, recipes },
        };
      }
    } catch (err) {
      console.error(err);
      return {
        props: { currentUser: null, recipes },
      };
    }
  }
}

export default MustKnow;
