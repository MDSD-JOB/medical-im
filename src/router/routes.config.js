import { BasicLayout } from '@/layouts'
export default [
  {
    path: '/',
    name: 'index',
    redirect: '/im',
    component: BasicLayout,
    children: [
      {
        name: 'im',
        path: '/im',
        redirect: '/imchat/list',
        component: resolve =>
          import('@views/im').then(module => resolve(module)),
        children: [
          {
            name: 'imchat',
            path: '/imchat/list',
            component: resolve =>
              import('@views/im/imchat/list').then(module => resolve(module))
          },
          {
            name: 'imgroups',
            path: '/imgroups/list',
            component: resolve =>
              import('@views/im/imgroups/list').then(module => resolve(module))
          },
          {
            name: 'imfriends',
            path: '/imfriends/list',
            component: resolve =>
              import('@views/im/imfriends/list').then(module => resolve(module))
          }
        ]
      },
      {
        name: 'imchatDetail',
        path: '/imchat/detail/:id',
        component: resolve =>
          import('@views/im/imchat/detail').then(module => resolve(module))
      },
      {
        name: 'imgroupsDetail',
        path: '/imgroups/detail/:id',
        component: resolve =>
          import('@views/im/imgroups/detail').then(module => resolve(module))
      },
      {
        name: 'imfriendsDetail',
        path: '/imfriends/detail/:id',
        component: resolve =>
          import('@views/im/imfriends/detail').then(module => resolve(module))
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: resolve => import('@views/login').then(module => resolve(module))
  },
  {
    name: '404',
    path: '/404',
    component: resolve => import('@views/404').then(module => resolve(module))
  }
]
