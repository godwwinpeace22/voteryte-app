import Vue from 'vue'
  import Router from 'vue-router'
  import Auth from '@/plugins/auth'
  import Layout from '@/views/Layout'

Vue.use(Router)

const requireAuth = async (to, from, next) => {

  let returnTo = `?returnTo=${to.fullPath}`

  try {
    
    if(Auth.isLoggedIn()){
      next()
    }

    else {
      next('/login' + returnTo)
    }

  } catch (error) {
    console.log(error)
    next('/login' + returnTo)
  }
  
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path:'/home',
      component: Layout,
      beforeEnter: requireAuth,
      children:[
        
        {
          path:'',
          name:'feed',
          component: () => import('@/components/feed/Feed'),
          // beforeEnter: requireAuth,
        },
        {
          path: '/posts/:postId',
          name: 'singlepost',
          component: () => import('@/components/feed/SinglePostView'),
          props: true
        },
        {
          path:'/discover',
          name:'discover',
          component: () => import('@/components/Discover'),
          // beforeEnter:requireAuth,
        },
        // {
        //   path:'/upgrade',
        //   name:'upgrade',
        //   component: () => import('@/components/Upgrade'),
        //   // beforeEnter:requireAuth,
        // },
        // {
        //   path: '/campaigns',
        //   name: 'campaigns',
        //   component: () => import('@/components/campaigns/Campaign.vue')
        // },
        
        {
          path: '/messages/received',
          name: 'messages-received',
          component: () => import('@/components/messages/Received')
        },
        {
          path: '/messages/sent',
          name: 'messages-sent',
          component: () => import('@/components/messages/Sent')
        },
        {
          path: '/messages/open/:from',
          name: 'messages-open',
          component: () => import('@/components/messages/Open'),
          props: true
        },
        // {
        //   path:'/forum/:forumId',
        //   component: () => import('@/components/forum/Forum'),
        //   props: true,
        //   name: 'forum',
          
        // },
        // {
        //   path:'/forum/:forumId/members',
        //   name:'forum_members',
        //   component: () => import('@/components/forum/ForumUsers')
        // },
        {
          path: '/settings',
          component: () => import('@/components/profile_settings/AccountSettings'),
          name: 'profile_settings',
        },
        // {
        //   path: '/contest',
        //   name: 'contest',
        //   component: () => import('@/components/elections/Contest'),
        // },
        {
          path: '/elections/create',
          name: 'create_election',
          component: () => import('@/components/elections/CreateElection'),
        },

        {
          path: '/elections/:electionId/',
          component: () => import('@/components/elections/ElectionHome'),
          props: true,
          children: [
            {
              path: '',
              name: 'about_election',
              component: () => import('@/components/elections/Watch'),
            },
            {
              path: 'contestants',
              name: 'contestants',
              component: () => import('@/components/elections/ElectionContestants'),
            },
            // {
            //   path: 'voters',
            //   name: 'voters',
            //   component: () => import('@/components/elections/ElectionVoters'),
            // },
            // {
            //   path: 'manifestos',
            //   name: 'election_manifestos',
            //   component: () => import('@/components/elections/ElectionManifestos'),
            // },
            {
              path: 'results',
              name: 'results',
              component: () => import('@/components/elections/ElectionResults'),
            },
            {
              path: 'terms',
              name: 'terms',
              component: () => import('@/components/elections/ElectionTerms'),
            },
          ]
        },
        // {
        //   path: '/manifestos/:manifestoId',
        //   name: 'view_manifesto',
        //   props: true,
        //   component: () => import('@/components/elections/Manifestos')
        // },
        {
          path: '/elections/:electionId/manager',
          name: 'manager',
          component: () => import('@/components/elections/ManageElection'),
        },
        {
          path: '/users/:username',
          component: () => import('@/components/user_profiles/User__Home'),
          props: true,
          children: [
            // {
            //   path: '',
            //   name: 'user_posts',
            //   component: () => import('@/components/user_profiles/User__Posts')
            // },
            // {
            //   path: 'posts',
            //   name: 'user_posts',
            //   component: () => import('@/components/user_profiles/User__Posts')
            // },
            // {
            //   path: 'events',
            //   name: 'user_events',
            //   component: () => import('@/components/user_profiles/User__Events')
            // },
            // {
            //   path: 'followers',
            //   name: 'user_followers',
            //   component: () => import('@/components/user_profiles/User__Followers')
            // },
            // {
            //   path: 'following',
            //   name: 'user_following',
            //   component: () => import('@/components/user_profiles/User__Following')
            // },
            
            // {
            //   path: 'manifestos',
            //   name: 'user_manifestos',
            //   component: () => import('@/components/user_profiles/User__Manifestos')
            // },
          ]
        },
        // {
        //   path: '/my-stats',
        //   name: 'user_stats',
        //   component: () => import('@/components/user_profiles/User__Stats')
        // },
        // {
        //   path: '/events/:eventId',
        //   component: () => import('@/components/events/Events'),
        //   props: true
        // },

        {
          path:'/not-found',
          name:'notfound',
          component: () => import('@/views/404'),
          // beforeEnter: requireAuth,
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component: () => import('@/views/Login'),
      // beforeEnter:requireLogout
    },
    {
      path:'/signup',
      name:'signup',
      component: () => import('@/views/Signup'),
      // beforeEnter:requireLogout
    },
    {
      path:'/not-found',
      name:'notfound2',
      component: () => import('@/views/404')
    },
    {
      path:'/complete',
      name:'complete',
      component: () => import('@/views/Complete')
    }
  ]
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      // $Nprogress.start()
  }
  next()
})

router.beforeEach((to, from, next) => {

  // preserve query strings
  let queryObj = to.query
  let queryStr = Object.keys(queryObj)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryObj[k]))
    .join('&')

  if(to.path == '/'){

    next('/home?' + queryStr)
  }
  else if (!to.matched.length) {
    next('/not-found');
  } else {

    next();
  }
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  // $Nprogress.done()
})

export default router