import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import { RouteType } from "./components/navigators/Navigator";
import UserData from "./model/UserData";
import Cart  from "./components/pages/Cart";
import SalaryStatistics from "./components/pages/Orders";
import { StatusType } from "./model/StatusType";
import CodeType from "./model/CodeType";
import { useDispatch } from "react-redux";
import { authActions } from "./redux/slices/authSlice";
import { authService } from "./config/service-config";
import { Alert, Snackbar } from "@mui/material";
import { codeActions } from "./redux/slices/codeSlice";
import Generation from "./components/pages/Generation";
import process from "process";
import AddProduct from "./components/pages/AddProduct";
import Products from "./components/pages/Products";
import AdminProducts from "./components/pages/AdminProducts";
const {always, authenticated, admin, noadmin, noauthenticated, noauth} = routesConfig;
type RouteTypeOrder = RouteType & {order?: number}

function getRoutes(userData: UserData): RouteType[] {
  const res: RouteTypeOrder[] = [];
  
  if(userData) {
    res.push(...authenticated);
    if (userData.role === 'admin') {
      res.push(...admin);        
      if(routesConfig.developmentAdmin &&
         process.env.NODE_ENV !== "production") {
          res.push(...routesConfig.developmentAdmin);
      }
    } else {
      res.push(...noadmin)
      res.push(...noauth);
    }
  } else {
    res.push(...noauthenticated);
    res.push(...noauth);
  }
  res.sort((r1, r2) => {
    let res = 0;
    if (r1.order && r2.order) {
      res = r1.order - r2.order;
    } 
    return res
  });
  if (userData) {
    res[res.length - 1].label = userData.email;
  }
  return res
}

const App: React.FC = () => {
  const userData = useSelectorAuth();
  const code = useSelectorCode();
  const dispatch = useDispatch();

  const [alertMessage, severity] = useMemo(() => codeProcessing(), [code]);
  const routes = useMemo(() => getRoutes(userData), [userData]);
  function codeProcessing(): [string, StatusType] {
    const res: [string, StatusType] = [code.message, 'success'];
    switch (code.code) {
      case CodeType.OK: res[1] = 'success'; break;
      case CodeType.SERVER_ERROR: res[1] = 'error'; break;
      case CodeType.UNKNOWN: res[1] = 'error'; break;
      case CodeType.AUTH_ERROR: res[1] = 'error';
       dispatch(authActions.reset()); 
      authService.logout()
    }
    
    return res;
  }
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<NavigatorDispatcher routes={routes}/>}>
        <Route index element={<Products/>}/>
        <Route path="products/add" element={<AddProduct/>}/>
        <Route path="products/admin" element={<AdminProducts/>}/>
        <Route path="products/cart" element={<Cart/>}/>
        <Route path="orders" element={<SalaryStatistics/>}/>  
              
        <Route path="signin" element={<SignIn/>}/>
        <Route path="signout" element={<SignOut/>}/>        
        <Route path="generation" element={<Generation/>}/>
        <Route path="/*" element={<NotFound/>}/>
    </Route>
  </Routes>
  <Snackbar open={!!alertMessage} autoHideDuration={20000}
                     onClose={() => dispatch(codeActions.reset())}>
                        <Alert  onClose = {() => dispatch(codeActions.reset())} severity={severity} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
  </BrowserRouter>
}
export default App;