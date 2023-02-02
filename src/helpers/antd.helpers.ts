import { NotificationInstance } from "antd/es/notification/interface";
import { NotificationType } from "../interfaces/antd-interface";

/**
 * Renders antd notifcation
 * @param api
 * @param type
 * @param message
 * @param description
 */
export const renderNotification = (api: NotificationInstance, type: NotificationType, message: string, description?: string) => {
    api[type]({ message, description, placement: 'bottomRight' });
};