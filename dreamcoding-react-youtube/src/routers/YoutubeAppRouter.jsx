import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import Layout from '../layouts/Layout';
import VideosPage from '../pages/VideosPage';
import VideoDetailPage from '../pages/VideoDetailPage';

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<div>NotFound</div>}>
      <Route index element={<VideosPage />} />
      <Route path="videos" element={<VideosPage />} />
      <Route path="videos/:keyword" element={<VideosPage />} />
      <Route path="videos/watch/:videoId" element={<VideoDetailPage />} />
    </Route>
  )
);

function YoutubeAppRouter() {
  return <RouterProvider router={router} />
}

export default YoutubeAppRouter;
