import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { FormComponent } from "../components/form/form.component"
import { PATHS } from "../constants/paths.const";
import { userService } from "../services/user.service";

export const AdminPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!userService.isUserAdmin()) {
            navigate(PATHS.ROOT);
        }
    });

    return (
        <FormComponent />
    )
}