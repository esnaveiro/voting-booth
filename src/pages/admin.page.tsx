import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { FormComponent } from "../components/form/form.component"
import { userService } from "../services/user.service";

export const AdminPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!userService.isUserAdmin()) {
            navigate('/');
        }
    });

    return (
        <FormComponent />
    )
}