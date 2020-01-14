import Activity from '../pages/Activity/Activity';
import Activity1 from '../pages/Activity1/Activity1';
import ServiceDetail from '../pages/ServiceDetail/ServiceDetail';
import MyPublish from '../pages/MyPublish/MyPublish';
import test from '../pages/test.js';
import CarHelp from  "../pages/CarHelp/CarHelp";
const routes = [
    {
      path: "/activity/:id/:userId/:location",
      component: Activity
    },
    {
      path: "/activity1",
      component: Activity1
    },
    {
      path: "/service/:type",
      component: ServiceDetail
    },
    {
      path:"/myPublish/:userId",
      component: MyPublish
    },
    {
      path: "/test",
      component: test
    },
    {
      path:'/carhelp',
      component:CarHelp
    }
]
export default routes;
