import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {     //children = component wrapped inside ProtectedRoute which is Dashboard in this case
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;