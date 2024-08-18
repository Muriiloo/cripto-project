import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Detail from "./pages/Detail/Detail";
import NotFound from "./pages/NotFound/NotFound";

const router = createBrowserRouter([
    {
        children:
        [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/detail/:cripto",
                element: <Detail/>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    }
])

export { router }