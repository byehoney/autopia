
import TopLineDetail from '../pages/TopLineDetail/TopLineDetail'
import MyOrders from '../pages/myOrders/MyOrders'
const routes = [
    {
      path:"/topLineDetail/:id",
      component:TopLineDetail
    },
    {
      path:"/myOrders",
      component:MyOrders
    }
]
export default routes;