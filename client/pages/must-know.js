import NavBar from "@/components/Navbar";
import PageHeader from "@/components/Page-Header";
import Cookies from "cookies";
import axios from "axios";
import RecipeList from "@/components/RecipeList";

const MustKnow = ({ currentUser, recipes }) => {
  // const { recipes } = props;
  // console.log(recipes);

  console.log(recipes);

  return (
    <>
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
    "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/recipes/must-know",
    {
      headers: {
        Host: "authenticdongbei.com",
      },
    }
  );
  const recipes = recipeResponse.data.recipes;

  const { req, res } = context;
  const cookies = new Cookies(req, res);
  try {
    // console.log("headerCookie", req.headers.cookie);
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/users/currentuser",
      {
        headers: {
          Host: "authenticdongbei.com",
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
          `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/users/refresh-token`,
          {},
          {
            headers: {
              Host: "authenticdongbei.com",
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

// export async function getServerSideProps(context) {
//   const response = await axios.get(
//     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/recipes/must-know",
//     {
//       headers: {
//         Host: "authenticdongbei.com",
//       },
//     }
//   );

//   return {
//     props: {
//       recipes: response.data,
//     },
//   };
// }

export default MustKnow;
