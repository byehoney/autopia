import Violate from '../pages/Violate';
import Carhistory from '../pages/carhistory'
import TopLineDetail from '../pages/TopLineDetail'
import ProductList from '../pages/ProductList'
import Address from '../pages/address'
import Shophistory from '../pages/shophistory'
import ProductDetail from "../pages/ProductDetail";
import EvaArea from '../pages/EvaArea';
import CitationFind from '../pages/CitationFind';
import Agreement from "../pages/Agreement";
import ProductOrder from "../pages/ProductOrder";
import Home from '../pages/Home';
import Index from '../pages/Index';
import Carlist from "../pages/carlist";
import Find from '../pages/Find';
import NearbyRoad from '../pages/NearbyRoad'
import Addcar from "../pages/addcar"
import Discusslist from "../pages/discusslist"
import My from "../pages/my"
import CitationFindDetail from '../pages/CitationFindDetail';
import ArticleRead from '../pages/ArticleRead';
import Dhsuccess from "../pages/dhsuccess"
import Setting from "../pages/setting"
import LoginNum from '../pages/loginnum';
import Aboutus from  "../pages/aboutus";
import InviteFriend from  "../pages/InviteFriend";
const routes = [
    {
      path: "/",
      component: Index
    },
    {
      path: "/home",
      component: Home
    },
    {
      path: "/violate",
      component: Violate
  
    },
    {
      path: "/productList",
      component: ProductList
    },
    {
      path: "/productDetail/:id",
      component: ProductDetail
    },
    {
      path: "/invite",
      component: InviteFriend
    },
    {
      path: "/agreement",
      component: Agreement
    },
    {
      path: "/order/:id",
      component: ProductOrder
    },
    {
      path:'/topLineDetail/:id',
      component:TopLineDetail
    },
    {
      path:'/EvaArea/:id',
      component:EvaArea
    },
    {
      path:'/carhistory',
      component:Carhistory
    }
    ,
    {
      path:'/address/:id',
      component:Address
    }  ,
    {
      path:'/shophistory',
      component:Shophistory
    },{
      path:'/CitationFind',
      component:CitationFind
    },
    {
      path:'/carlist',
      component:Carlist
    },
    {
      path:'/find',
      component:Find
    },
    {
      path:'/nearbyRoad',
      component:NearbyRoad
    },{
      path:'/addcar/:id',
      component:Addcar
    },
    {
      path:'/discusslist',
      component:Discusslist
    },
    {
      path:'/my',
      component:My
    },
    {
      path:'/citationFindDetail/:plate',
      component:CitationFindDetail
    },
    {
      path:'/articleRead',
      component:ArticleRead
    }
    ,
    {
      path:'/dhsuccess',
      component:Dhsuccess
    } ,
    {
      path:'/setting',
      component:Setting
    }
    ,
    {
      path:'/loginnum',
      component:LoginNum
    },
    {
      path:'/aboutus',
      component:Aboutus
    }
  ]
  export default routes;