import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { Landing } from './pages/Landing';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <RecoilRoot>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={true}
        theme="colored"
      />
      <Landing />
    </RecoilRoot>
  </BrowserRouter>
);
