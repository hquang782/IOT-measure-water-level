import { NotFoundPage } from '../components/NotFoundPage';
import { HomePage } from '../components/HomePage';
import { ChatPage } from '../components/ChatPage';
import React from 'react';
import { LayOut } from '../components/LayOut';

const notFound = {
  path: '/*',
  element: <NotFoundPage />,
};

const Mainroutes = () => [
  {
    path: '/',
    element: <LayOut />,
    children: [
      {
        path: '/home',
        element:<HomePage/>
      },
      {
        path: '/user',
        element: <ChatPage />,
      },
    ],
  },
  notFound,
];

export default Mainroutes;
