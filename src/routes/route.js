import Home from '../pages/User/Home';


import Login from '../pages/User/Auth/Login';
import MyPage from '../pages/User/Auth/MyPage';
import EditMyInfo from '../pages/User/Auth/EditMyInfo';
import FindMyInfo from '../pages/User/Auth/FindMyInfo';
import SignUp from '../pages/User/Auth/SignUp';
import Resign from '../pages/User/Auth/Resign';


import Post from '../pages/User/Posts/Post';

import Policy from '../pages/User/Policy/Policy';

import MLogin from '../pages/Manager/MLogin';
import MUserEdit from '../pages/Manager/MUserEdit';


import MItemEdit from '../pages/Manager/MItemEdit';
import MItemList from '../pages/Manager/MItemList';


import Request from '../pages/User/Auth/Request';


import MShopEdit from '../pages/Manager/MShopEdit';
import ShopList from '../pages/User/Shop/ShopList';
import Shop from '../pages/User/Shop/Shop';
import AddShop from '../pages/User/Shop/AddShop';
import CommunityList from '../pages/User/Community/CommunityList';
import AddCommunity from '../pages/User/Community/AddCommunity';

const zManagerRoute = [
    { link: '/', element: <MLogin />, title: "관리자로그인" },
    { link: '/manager', element: <MLogin />, title: "관리자로그인" },
    { link: '/manager/login', element: <MLogin />, title: "관리자로그인" },
    { link: '/manager/edit/user/:pk', element: <MUserEdit />, title: "회원관리" },
    { link: '/manager/edit/shop/:pk', element: <MShopEdit />, title: "" },
    { link: '/manager/edit/:table/:pk', element: <MItemEdit />, title: "" },
    { link: '/manager/list/:table/:pk', element: <MItemList />, title: "" },
    { link: '/manager/list/:table', element: <MItemList />, title: "" },
];
const zUserRoute = [
    { link: '/', element: <Home />, title: "홈" },
    { link: '/home', element: <Home />, title: "홈" },
    { link: '/post/:table/:pk', element: <Post />, title: "게시물" },

    { link: '/login', element: <Login />, title: "로그인" },
    { link: '/mypage', element: <MyPage />, title: "마이페이지" },
    { link: '/editmyinfo', element: <EditMyInfo />, title: "회원수정" },
    { link: '/findmyinfo', element: <FindMyInfo />, title: "아이디/비밀번호 찾기" },
    { link: '/signup', element: <SignUp />, title: "회원가입" },
    { link: '/resign', element: <Resign />, title: "회원탈퇴" },
    { link: '/request', element: <Request />, title: "문의하기" },
    { link: '/request/:pk', element: <Request />, title: "문의하기" },

    { link: '/policy/:pk', element: <Policy />, title: "" },

    { link: '/add-community/:table', element: <AddCommunity />, title: "" },
    { link: '/community-list/:table', element: <CommunityList />, title: "" },
    { link: '/add-shop', element: <AddShop />, title: "" },
    { link: '/shop/:city_1/:city_2/:pk', element: <Shop />, title: "" },
    { link: '/_shop', element: <Shop />, title: "" },
    { link: '/shop-list', element: <ShopList />, title: "" },

];
let str = "";
for(var i = 0;i<zUserRoute.length;i++){
    str += `<`
}
export { zUserRoute, zManagerRoute }