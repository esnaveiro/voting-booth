import { Tabs, TabsProps } from "antd";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { FormComponent } from "../components/form/form.component"
import { LobbyComponent } from "../components/lobby/lobby.component";
import { PATHS } from "../constants/paths.const";
import { userService } from "../services/user.service";

export const AdminPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!userService.isUserAdmin()) {
            navigate(PATHS.ROOT);
        }
    });

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Poll Form',
            children: <FormComponent />,
        },
        {
            key: '2',
            label: `Lobby`,
            children: <LobbyComponent />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;

}