import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OrderFormPage from "./pages/OrderFormPage";
import SuperStorePage from "./pages/SuperStorePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"/superstore"}>Super Store</Link>
                </li>
                <li>
                  <Link to={"/order/create"}>Create Order</Link>
                </li>
              </ul>
            </div>
            <a className="text-xl btn btn-ghost">daisyUI</a>
          </div>
          <div className="hidden navbar-end lg:flex">
            <ul className="px-1 menu menu-horizontal">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/superstore"}>Super Store</Link>
              </li>
              <li>
                <Link to={"/order/create"}>Create Order</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/superstore" element={<SuperStorePage />}></Route>
            <Route path="/order/create" element={<OrderFormPage key={"add"}/>}></Route>
            <Route path="/order/edit/:_id" element={<OrderFormPage key={"edit"}/>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
