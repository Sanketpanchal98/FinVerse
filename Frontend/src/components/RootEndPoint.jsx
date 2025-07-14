import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLoader from '../Animations/ArrowLoader.jsx';
import { fetchUser } from '../Slices/AuthSlice.jsx';
import { Navigate } from 'react-router-dom';

const RootEndPoint = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {        
        await dispatch(fetchUser())
        
      } catch (err) {
        console.log(err);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  
  if (!authChecked || isLoading) return <ArrowLoader />;
  if(!isAuthenticated){
    return <Navigate to={'/auth'} replace/>
  }

  return children;
};


export default RootEndPoint;
