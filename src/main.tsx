import { StrictMode } from 'react'
import { RouterProvider } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.tsx'
import Home from './pages/Home.tsx';
import Searching from './pages/Searching.tsx';
import {
  createBrowserRouter
} from "react-router";

import About from './pages/About.tsx';
import {ArraysPage,StacksPage,QueuesPage,LinkedListsPage,TreesPage} from './pages/data-structures';
import Sorting from './pages/Sorting.tsx';
import Race from './pages/race/Race.tsx';
import Graph from './pages/Graph.tsx';
import DP from './pages/DP.tsx';
import Greedy from './pages/Greedy.tsx';
import Math from './pages/Math.tsx';

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path='/' element={<Layout/>}>
//       <Route path='' element={<Home/>}/>
//       <Route path='race' element={<Race/>}/>
//       <Route path='algorithms/searching' element={<Searching/>}/>
//       <Route path='algorithms/sorting' element={<Sorting/>}/>
//       <Route path='about' element={<About/>}/>
//     </Route>
//   )
// )


let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "algorithms/searching", element: <Searching /> },
      { path: "algorithms/sorting", element: <Sorting /> },
      { path: "algorithms/graph", element: <Graph /> },
      { path: "algorithms/dp", element: <DP /> },
      { path: "algorithms/greedy", element: <Greedy /> },
      { path: "algorithms/math", element: <Math /> },
      { path: "race", element: <Race /> },
      { path: "data-structures/arrays", element: <ArraysPage /> },
      { path: "data-structures/queues", element: <QueuesPage /> },
      { path: "data-structures/stacks", element: <StacksPage /> },
      { path: "data-structures/linked-lists", element: <LinkedListsPage /> },
      { path: "data-structures/trees", element: <TreesPage /> }
    ],
  },
]);
createRoot(document.getElementById('root')!).render(

  <StrictMode>


<RouterProvider router={router} />


  </StrictMode>,

)
