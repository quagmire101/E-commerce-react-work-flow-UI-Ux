import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons";

export const showNotificaiton = (title, message, type = "success") => {

    const color = type === 'success' ? '#c0fcca' : type === 'error' ? '#ffadad' : '#c0fcca';


    return notifications.show({
        id: 'hello-there',
        withCloseButton: true,
        autoClose: 5000,
        title: title,
        message: message,
        color: 'black',
        icon: <IconX />,
        className: 'my-notification-class',
        style: { backgroundColor: color },
        loading: false,
    });
}